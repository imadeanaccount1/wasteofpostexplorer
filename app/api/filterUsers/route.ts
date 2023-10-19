import { type NextRequest } from "next/server";
// @ts-ignore
import { get, set } from 'lodash';

import { getData, getRecordCount } from "./getdata";

async function getQuery(filters: any) {
  let fullquery: any = {};
  for (let step = 0; step < filters.length; step++) {
    let fieldValue: string | null = null;
    if (filters[step].field === "join") {
      fieldValue = "history.joined";
    } else if (filters[step].field === "followers") {
      fieldValue = "stats.followers";
    } else if (filters[step].field === "following") {
      fieldValue = "stats.following";
    } else if (filters[step].field === "name") {
      fieldValue = "name";
    } else if (filters[step].field === "posts") {
      fieldValue = "stats.posts";
    }

    let valueValue: any = null;
    let mongoQuery: any = null;
    if (filters[step].operation === ">") {
      if (filters[step].field === "join") {
        valueValue = new Date(filters[step].value).getTime();
      } else {
        valueValue = parseInt(filters[step].value);
      }
      mongoQuery = { $gt: valueValue };
    } else if (filters[step].operation === "<") {
      if (filters[step].field === "join") {
        valueValue = new Date(filters[step].value).getTime();
      } else {
        valueValue = parseInt(filters[step].value);
      }
      mongoQuery = { $lt: valueValue };
    } else if (filters[step].operation === ">=") {
      valueValue = parseInt(filters[step].value);
      mongoQuery = { $gte: valueValue };
    } else if (filters[step].operation === "<=") {
      valueValue = parseInt(filters[step].value);
      mongoQuery = { $lte: valueValue };
    } else if (filters[step].operation === "!=") {
      if (filters[step].field === "name") {
        valueValue = filters[step].value;
      } else {
        valueValue = parseInt(filters[step].value);
      }

      mongoQuery = { $ne: valueValue };
    } else if (filters[step].operation === "==") {
      if (filters[step].field === "name") {
        valueValue = filters[step].value;
      } else {
        valueValue = parseInt(filters[step].value);
      }
      mongoQuery = { $eq: valueValue };
    }
    fullquery[fieldValue!] = { ...fullquery[fieldValue!], ...mongoQuery };
  }
  return fullquery;
}


const rateLimit = 20; // Number of allowed requests per minute

const rateLimiter = {};

const rateLimiterMiddleware = (ip: any) => {
  const now = Date.now();
  const windowStart = now - 60 * 1000; // 1 minute ago

  const requestTimestamps = get(rateLimiter, ip, []).filter((timestamp: any) => timestamp > windowStart);
  requestTimestamps.push(now);

  set(rateLimiter, ip, requestTimestamps);

  return requestTimestamps.length <= rateLimit;
};

export async function GET(request: NextRequest) {
  const ip : any = request.headers.get('x-real-ip') ||  request.ip;

  if (!rateLimiterMiddleware(ip)) {
    return Response.json({ error: 'Rate Limited' }, { status: 429 })
    // return Response.status(429).json({ message: 'Too Many Requests' });
  }
  const searchParams = request.nextUrl.searchParams;
  const user = searchParams.get("user");
  const page: string = searchParams.get("page")!;
  const sort: any = searchParams.get("sort")!;
  const filters: any = JSON.parse(searchParams.get("filters")!);
  const search: string = searchParams.get("search")!;

  const query = await getQuery(filters);
  const filteredposts = await getData(page, query, sort, search);
  const recordCount = await getRecordCount(query, search);

  const pageCount = Math.ceil(recordCount / 15);

  const pages = Array.from({ length: pageCount }, (x, i) => i).map((page) =>
    (page + 1).toString()
  );

  if (pageCount > 6) {
    // console.log("page", parseInt(page), (parseInt(pages[pages.length-1]) -1), parseInt(pages[Math.floor(pages.length/2)]) )
    if (parseInt(page)< (parseInt(pages[pages.length-1]) -1) && parseInt(page)> parseInt(pages[Math.floor(pages.length/2)])) {
      // console.log('tail end')
      // console.log(parseInt(page)+2, pages.length - (parseInt(page)+2)+1)
      pages.splice(parseInt(page)+1, pages.length - (parseInt(page)+2)+1)
      // console.log(pages)
    } else if (parseInt(page)> 2 && parseInt(page)< parseInt(pages[Math.ceil(pages.length/2)])) {
      // console.log('begin end')
      pages.splice(0, parseInt(page)-2)
      // console.log(pages) 
    }
    pages.splice(3, pages.length-6, "...");
  }
  const displaypages = pages;

  return Response.json({
    posts: filteredposts,
    pagination: { pages: displaypages, recordCount: recordCount, pageCount: pageCount },
  });
}
