const { MongoClient } = require("mongodb");
import { type NextRequest } from "next/server";
// @ts-ignore
import { get, set } from 'lodash';
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
      fieldValue = "time";
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
  const ip : any = request.headers.get('x-real-ip') ||  request.ip;

  if (!rateLimiterMiddleware(ip)) {
    return Response.json({ error: 'Rate Limited' }, { status: 429 })
    // return Response.status(429).json({ message: 'Too Many Requests' });
  }
  const uri = process.env.CONNECTION_STRING;
  const client = new MongoClient(uri);
  const searchParams = request.nextUrl.searchParams;

  const user = searchParams.get("user");
  const page: string = searchParams.get("page")!;
  const sort: any = JSON.parse(searchParams.get("sort")!);
  console.log(sort);
  const filters: any = JSON.parse(searchParams.get("filters")!);
  console.log(filters);

  const search: string = searchParams.get("search")!;
  const query = await getQuery(filters);
  let queryval: any = {};
  if (user == "any") {
    queryval["poster.name"] = { $exists: true };
  } else {
    queryval["poster.name"] = user;
  }
  // let query = { "poster.name": username };
  console.log(search);
  let searchval = { $text: { $search: search } };

  if (search === "") {
    queryval = { ...query, ...queryval };
  } else {
    queryval = { ...query, ...queryval, ...searchval };
  }

  let sortval: any = {};
  // loop through sort
  for (let i = 0; i < sort.length; i++) {
    let fieldValue = "";
    if (sort[i].field === "loves") {
      fieldValue = "loves";
    } else if (sort[i].field === "comments") {
      fieldValue = "comments";
    } else if (sort[i].field === "reposts") {
      fieldValue = "reposts";
    } else if (sort[i].field === "posted") {
      fieldValue = "time";
    }
    sortval[fieldValue] = sort[i].direction === "asc" ? 1 : -1;
  }

  console.log(page, sortval, filters, search);

  try {
    const database = client.db("womposts");
    const posts = database.collection("posts");

    const countpipeline = [
      {
        $match: queryval,
      },
      {
        $project: {
          imgTags: {
            $regexFindAll: {
              input: "$content",
              regex: "<img[^>]*>",
            },
          },
        },
      },
      {
        $unwind: "$imgTags",
      },
      {
        $project: {
          _id: 1,
          imgTag: "$imgTags.match",
        },
      },
    ];
    const postlistpipeline = [
      {
        $match: queryval,
      },
      {
        $project: {
          time: 1,
          poster: 1,
          imgTags: {
            $regexFindAll: {
              input: "$content",
              regex: "<img[^>]*>",
            },
          },
        },
      },
      {
        $unwind: "$imgTags",
      },
    ];

    if (Object.keys(sortval)) {
      // @ts-ignore
      countpipeline.push({ $sort: sortval });
      // @ts-ignore
      postlistpipeline.push({ $sort: sortval });
    }

    // @ts-ignore
    postlistpipeline.push({ $skip: 15 * (parseInt(page) - 1) });
    // @ts-ignore
    postlistpipeline.push({ $limit: 15 });
    // @ts-ignore
    postlistpipeline.push({ $project: { _id: 1, imgTag: "$imgTags.match", time: 1, poster:  1} });
    countpipeline.push({ $project: { _id: 1, imgTag: "$imgTags.match" } });
        // @ts-ignore
        countpipeline.push({ $count: "numberOfImages" });
    console.log(postlistpipeline);
    const postlist = posts.aggregate(postlistpipeline);
    const postcounts = posts.aggregate(countpipeline);
    const pictures = [];
    const counts = [];
    for await (const doc of postcounts) {
      console.log(doc);
      counts.push(doc);
    }
    for await (const doc of postlist) {
      console.log(doc);
      pictures.push(doc);
    }
    // for await (const doc of postcounts) {
    //     console.log(doc);
    //     pictures.push(doc)
    // }
    console.log(counts);
    const recordCount = counts[0].numberOfImages;
    const pageCount = Math.ceil(recordCount / 15);

    const pages = Array.from({ length: pageCount }, (x, i) => i).map((page) =>
      (page + 1).toString()
    );

    if (pageCount > 6) {
      // console.log("page", parseInt(page), (parseInt(pages[pages.length-1]) -1), parseInt(pages[Math.floor(pages.length/2)]) )
      if (
        parseInt(page) < parseInt(pages[pages.length - 1]) - 1 &&
        parseInt(page) > parseInt(pages[Math.floor(pages.length / 2)])
      ) {
        // console.log('tail end')
        // console.log(parseInt(page)+2, pages.length - (parseInt(page)+2)+1)
        pages.splice(
          parseInt(page) + 1,
          pages.length - (parseInt(page) + 2) + 1
        );
        // console.log(pages)
      } else if (
        parseInt(page) > 2 &&
        parseInt(page) < parseInt(pages[Math.ceil(pages.length / 2)])
      ) {
        // console.log('begin end')
        pages.splice(0, parseInt(page) - 2);
        // console.log(pages)
      }
      pages.splice(3, pages.length - 6, "...");
    }
    const displaypages = pages;
    return Response.json({
      posts: pictures,
      pagination: { pages: displaypages, recordCount: recordCount, pageCount: pageCount },
    });
  } finally {
    await client.close();

    // Ensures that the client will close when you finish/error
  }
}
// export async function getData(
//   page: string,
//   fullquery: any,
//   sortValue: any,
//   searchtext: string
// ) {
//   const uri = process.env.CONNECTION_STRING;
//   const client = new MongoClient(uri);
//   try {
//     const database = client.db("womposts");
//     const posts = database.collection("users");

//     // Query for a movie that has the title 'Back to the Future'
//     let search = { $text: { $search: searchtext } };

//     let query = null;
//     if (searchtext === "") {
//       query = { ...fullquery };
//     } else {
//       query = { ...fullquery, ...search };
//     }
//     let sort: any = {};
//     // loop through sort
//     for (let i = 0; i < JSON.parse(sortValue).length; i++) {
//       let fieldValue = ""
//       if (JSON.parse(sortValue)[i].field === "join") {
//         fieldValue = "history.joined";
//       } else if (JSON.parse(sortValue)[i].field === "followers") {
//         fieldValue = "stats.followers";
//       } else if (JSON.parse(sortValue)[i].field === "following") {
//         fieldValue = "stats.following";
//       } else if (JSON.parse(sortValue)[i].field === "name") {
//         fieldValue = "name";
//       } else if (JSON.parse(sortValue)[i].field === "posts") {
//         fieldValue = "stats.posts";
//       }

//       sort[fieldValue] =
//         JSON.parse(sortValue)[i].direction === "asc" ? 1 : -1;
//     }
//     // console.log(sort)
//     // console.log(page)

//     const postlist = await posts
//       .find(query)
//       .sort(sort)
//       .skip(15 * (parseInt(page) - 1))
//       .limit(15)
//       .toArray(function (err: any, result: any) {
//         if (err) throw err;
//         client.close();
//       });

//     return postlist;
//   } finally {
//     await client.close();

//     // Ensures that the client will close when you finish/error
//   }
// }

// export async function getRecordCount(
//   fullquery: any,
//   searchtext: string
// ) {
//   const uri = process.env.CONNECTION_STRING;
//   const client = new MongoClient(uri);
//   try {
//     const database = client.db("womposts");
//     const posts = database.collection("users");

//     // Query for a movie that has the title 'Back to the Future'
//     let search = { $text: { $search: searchtext } };

//     let query = null;
//     if (searchtext === "") {
//       query = { ...fullquery };
//     } else {
//       query = { ...fullquery, ...search };
//     }
//     const count = await posts.find(query).count();

//     return count;
//   } finally {
//     await client.close();
//   }
// }
