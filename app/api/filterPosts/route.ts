import { type NextRequest, type NextResponse } from "next/server"; 
import { getData, getRecordCount } from "./getdata";
import rateLimiterMiddleware from "../utils/rateLimiterMiddleware";
import { getPagination } from "../utils/pagination";
const rateLimit = 20; // Number of allowed requests per minute

async function getQuery(filters: any) {
  let fullquery: any = {};
  for (let step = 0; step < filters.length; step++) {
    let fieldValue: string | null = null;
    if (filters[step].field === "loves") {
      fieldValue = "loves";
    } else if (filters[step].field === "reposts") {
      fieldValue = "reposts";
    } else if (filters[step].field === "comments") {
      fieldValue = "comments";
    } else if (filters[step].field === "name") {
      fieldValue = "poster.name";
    } else if (filters[step].field === "posted") {
      fieldValue = "time"
    }

    let valueValue: any = null;
    let mongoQuery: any = null;
    if (filters[step].operation === ">") {
      if (filters[step].field === "posted") {

      valueValue = new Date(filters[step].value).getTime();
      } else {
        valueValue = parseInt(filters[step].value);
      }
      mongoQuery = { $gt: valueValue };
    } else if (filters[step].operation === "<") {
      if (filters[step].field === "posted") {

        valueValue = new Date(filters[step].value);
        } else {
          valueValue = parseInt(filters[step].value);
        }      mongoQuery = { $lt: valueValue };
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
      };
      mongoQuery = { $eq: valueValue };
    }
    fullquery[fieldValue!] = { ...fullquery[fieldValue!], ...mongoQuery };
  }
  return fullquery;
}

export async function GET(request: NextRequest) {
  console.log('request')
  const ip : any = request.headers.get('x-real-ip') ||  request.ip;

  if (!rateLimiterMiddleware(ip, rateLimit)) {
    return Response.json({ error: 'Rate Limited' }, { status: 429 })
    // return Response.status(429).json({ message: 'Too Many Requests' });
  }
  const searchParams = request.nextUrl.searchParams;
  const user = searchParams.get("user");
  const page: string = searchParams.get("page")!;
  const sort: any = searchParams.get("sort")!;
  const searchtext: string = searchParams.get("search")!;
  const filters: any = JSON.parse(searchParams.get("filters")!);

  const query = await getQuery(filters);

  const filteredposts = await getData(user, page, query, sort, searchtext);
  const recordCount = await getRecordCount(user, query, searchtext);

  const [displaypages, pageCount] = await getPagination(recordCount, page);

  return Response.json({
    posts: filteredposts,
    pagination: { pages: displaypages, pageCount: pageCount },
  });
}
