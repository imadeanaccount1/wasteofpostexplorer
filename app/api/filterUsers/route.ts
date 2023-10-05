import { type NextRequest } from "next/server";

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

export async function GET(request: NextRequest) {
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
    pages.splice(3, pageCount - 6, "...");
  }
  const displaypages = pages;

  return Response.json({
    posts: filteredposts,
    pagination: { pages: displaypages, pageCount: pageCount },
  });
}
