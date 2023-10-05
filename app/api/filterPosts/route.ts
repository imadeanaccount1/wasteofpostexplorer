import { type NextRequest } from "next/server";
import fs from "fs";
import path from "path";

import { getData, getRecordCount } from "./getdata";

function compareNumbers(a: any, b: any) {
  return b.time - a.time;
}

function isGreaterThan(x: any, y: any) {
  return x > y;
}
function isLessThan(x: any, y: any) {
  return x < y;
}

function greaterThanOrEqualTo(x: any, y: any) {
  return x >= y;
}
function lessThanOrEqualTo(x: any, y: any) {
  return x <= y;
}
function equalTo(x: any, y: any) {
  return x == y;
}
function notEqualTo(x: any, y: any) {
  return x != y;
}

async function getQuery(filters: any) {
  let fullquery: any = {};
  console.log("filterlist", filters);
  for (let step = 0; step < filters.length; step++) {
    let fieldValue: string | null = null;
    if (filters[step].field === "loves") {
      fieldValue = "loves";
    }
    console.log("fieldValue", filters[step].field, fieldValue)

    let operationValue: Function | null = null;
    let valueValue: any = null;
    let mongoQuery: any = null;
    if (filters[step].operation === ">") {
      operationValue = isGreaterThan;
      valueValue = parseInt(filters[step].value);
      mongoQuery = { $gt: valueValue };
    } else if (filters[step].operation === "<") {
      operationValue = isLessThan;
      valueValue = parseInt(filters[step].value);
      mongoQuery = { $lt: valueValue };
    } else if (filters[step].operation === ">=") {
      operationValue = greaterThanOrEqualTo;
      valueValue = parseInt(filters[step].value);
      mongoQuery = { $gte: valueValue };
    } else if (filters[step].operation === "<=") {
      operationValue = lessThanOrEqualTo;
      valueValue = parseInt(filters[step].value);
      mongoQuery = { $lte: valueValue };
    } else if (filters[step].operation === "!=") {
      operationValue = notEqualTo;
      valueValue = parseInt(filters[step].value);
      mongoQuery = { $ne: valueValue };
    } else if (filters[step].operation === "==") {
      operationValue = equalTo;
      valueValue = parseInt(filters[step].value);
      mongoQuery = { $eq: valueValue };
    }
    fullquery[fieldValue!] = {...fullquery[fieldValue!], ...mongoQuery};
    console.log(mongoQuery);
    //     if (fieldValue != null && operationValue != null && valueValue != null) {
    //     postlist = postlist.filter((post: any) => {
    //         // console.log(post[fieldValue!], post[fieldValue!]> valueValue)
    //         return operationValue!(post[fieldValue!], valueValue)
    //     })
    // }
    console.log("step", step);
  }
  console.log(fullquery);
  return fullquery;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const user = searchParams.get("user");
  const page: string = searchParams.get("page")!;
  const sort: any = searchParams.get("sort")!;
  const searchtext : string = searchParams.get("search")!; 
  const filters: any = JSON.parse(searchParams.get("filters")!);
  console.log("filters", sort);

  // const test = await fetch('app/api/getdata').then(res => res.json()).then(data => {
  //     console.log(data)
  //   })
  //   console.log(test)
  // const test = await getData(user, parseInt(page))
  // console.log(test)

  // const sortDirection : string = searchParams.get('sortDirection')!

  // const sorting : any= {
  //     "time.asc": (a: any, b: any) => a.time - b.time,
  //     "time.desc": (a: any, b: any) => b.time - a.time,
  // }

  // console.log("path is222", path.resolve('app/api/myjsonfile.json'))
  // const allposts = await fs.readFileSync(path.resolve('app/api/myjsonfile.json'), 'utf8')
  // let count = 0
  // const postsbyuser : any= JSON.parse(allposts).filter((post: any) => post.poster.name === user)

  // console.log("HELLO WORLD")
  // postsbyuser.sort(sorting[sort+"."+sortDirection])

  const query = await getQuery(filters);
  console.log(query);
  const filteredposts = await getData(user, page, query, sort, searchtext);
  const recordCount = await getRecordCount(user, query, searchtext);
  console.log("count", recordCount);

  const pageCount = Math.ceil(recordCount / 15);
  console.log(pageCount);

  const pages = Array.from({ length: pageCount }, (x, i) => i).map((page) =>
    (page + 1).toString()
  );

  console.log(pages);
  if (pageCount > 6) {
    console.log(Math.floor(pageCount / 2) - (pageCount - 3) / 2, pageCount - 2);
    pages.splice(3, pageCount - 6, "...");
  }
  const displaypages = pages;
  // console.log(displaypages)
  // console.log("parse", parseInt(page))
  //     // @ts-ignore
  // filteredposts.splice(0, parseInt(page!-1)*15)

  // const selectedposts = filteredposts.filter((post: any) => {
  //     if (count < 15) {
  //         count++;
  //         return true;
  //       }
  //       return false;
  // })
  // console.log(selectedposts[0])

  return Response.json({
    posts: filteredposts,
    pagination: { pages: displaypages, pageCount: pageCount },
  });
  // return Response.json(fs.readFile(path.resolve('app/api/myjsonfile.json'), 'utf8', (err, data) => {
  //     console.log("got something")
  //     if (err) {
  //         console.log(err)
  //         return { posts: [] }
  //     }

  // }))
  // console.log(allposts)
  // console.log(query)
}
