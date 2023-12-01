const { MongoClient } = require("mongodb");
import { type NextRequest } from "next/server";
// @ts-ignore
import { get, set } from "lodash";
const rateLimit = 20; // Number of allowed requests per minute

const rateLimiter = {};

const rateLimiterMiddleware = (ip: any) => {
  const now = Date.now();
  const windowStart = now - 60 * 1000; // 1 minute ago

  const requestTimestamps = get(rateLimiter, ip, []).filter(
    (timestamp: any) => timestamp > windowStart
  );
  requestTimestamps.push(now);

  set(rateLimiter, ip, requestTimestamps);

  return requestTimestamps.length <= rateLimit;
};

export async function GET(request: NextRequest) {
  const ip: any = request.headers.get("x-real-ip") || request.ip;

  if (!rateLimiterMiddleware(ip)) {
    return Response.json({ error: "Rate Limited" }, { status: 429 });
    // return Response.status(429).json({ message: 'Too Many Requests' });
  }
  const uri = process.env.CONNECTION_STRING;
  const client = new MongoClient(uri);
  const searchParams = request.nextUrl.searchParams;

  const user = searchParams.get("user");
  const year: string = searchParams.get("year")!;

  const userrecord = await fetch(
    "https://api.wasteof.money/users/" + user + "/"
  ).then((res) => res.json());
  let followerChange = null;
  let followingChange = null;
  let initialFollowers = null;
  let userGraph = undefined;
  let userList = await fetch(
    `https://raw.githubusercontent.com/Quantum-Codes/Wob-Graphs/main/tracklist.json`
  ).then((res) => res.json());
  if (userList.includes(userrecord.id)) {
    userGraph = await fetch(
      `https://raw.githubusercontent.com/Quantum-Codes/Wob-Graphs/main/stats/${userrecord.id}.json`
    );
    userGraph = await userGraph.json();
    const firstGreaterThan = userGraph.timestamp.findIndex(
      (element: any) =>
        element >= new Date(year + "-01-01").getTime() / 1000 &&
        element <= new Date(year + "-12-31").getTime() / 1000
    );
    const lastGreaterThan =
      userGraph.timestamp.length -
      userGraph.timestamp
        .reverse()
        .findIndex(
          (element: any) =>
            element >= new Date(year + "-01-01").getTime() / 1000 &&
            element <= new Date(year + "-12-31").getTime() / 1000
        );
    if (firstGreaterThan !== -1) {
      followerChange =
        userGraph.followers[lastGreaterThan - 1] -
        userGraph.followers[firstGreaterThan];
      followingChange =
        userGraph.following[lastGreaterThan - 1] -
        userGraph.following[firstGreaterThan];

      if (firstGreaterThan > 0) {
        initialFollowers = userGraph.followers[firstGreaterThan - 1];
      } else {
        initialFollowers = userGraph.followers[firstGreaterThan];
      }
    }
  }
  const database = client.db("womposts");
  const posts = database.collection("posts");
  const query2 = posts.aggregate([
    {
      $match: {
        time: {
          $gte: new Date(year + "-01-01").getTime(),
          $lte: new Date(year + "-12-31").getTime(),
        },
      },
    },
    {
      $match: {
        "poster.id": { $eq: userrecord.id },
      },
    },
    {
      $count: "number_of_days",
    },
  ]);
  const query3 = posts.aggregate([
    {
      $match: {
        time: {
          $gte: new Date((parseInt(year) - 1).toString() + "-01-01").getTime(),
          $lte: new Date((parseInt(year) - 1).toString() + "-12-31").getTime(),
        },
      },
    },
    {
      $match: {
        "poster.id": { $eq: userrecord.id },
      },
    },
    {
      $count: "number_of_days",
    },
  ]);
  const query = posts.aggregate([
    {
      $match: {
        time: {
          $gte: new Date(year + "-01-01").getTime(),
          $lte: new Date(year + "-12-31").getTime(),
        },
      },
    },
    {
      $match: {
        "poster.id": { $eq: userrecord.id },
      },
    },
    {
      $project: {
        _id: 0,
        date: {
          $toDate: "$time",
        },
      },
    },
    {
      $project: {
        _id: 0,
        year: { $year: "$date" },
        month: { $month: "$date" },
        day: { $dayOfMonth: "$date" },
      },
    },
    // { "$group": {
    //     "_id": null,
    //     "distinctDate": { "$addToSet": { "year": "$year", "month": "$month",  "month": "$month" }}
    // }},
    {
      $project: {
        _id: 0,
        date2: {
          $dateFromParts: {
            year: "$year",
            month: "$month",
            day: "$day",
          },
        },
        count: 1,
      },
    },
    // {
    //     $project: {
    //       _id: 0,
    //       date: {
    //         $dateToString: {
    //           format: "%Y%m%d",
    //           date: "$date2"
    //         }
    //       }
    //     }
    //   },
    {
      $group: {
        _id: "$date2",
        count: { $sum: 1 },
      },
    },
    { $skip: 0 },
    // { $limit: 15 },
    // { $count: "number_of_days" }
  ]);
  const query4 = posts.aggregate([
    {
      $match: {
        time: {
          $gte: new Date((parseInt(year) - 1).toString() + "-01-01").getTime(),
          $lte: new Date((parseInt(year) - 1).toString() + "-12-31").getTime(),
        },
      },
    },
    {
      $match: {
        "poster.id": { $eq: userrecord.id },
      },
    },
    {
      $project: {
        _id: 0,
        date: {
          $toDate: "$time",
        },
      },
    },
    {
      $project: {
        _id: 0,
        year: { $year: "$date" },
        month: { $month: "$date" },
        day: { $dayOfMonth: "$date" },
      },
    },
    // { "$group": {
    //     "_id": null,
    //     "distinctDate": { "$addToSet": { "year": "$year", "month": "$month",  "month": "$month" }}
    // }},
    {
      $project: {
        _id: 0,
        date2: {
          $dateFromParts: {
            year: "$year",
            month: "$month",
            day: "$day",
          },
        },
        count: 1,
      },
    },
    // {
    //     $project: {
    //       _id: 0,
    //       date: {
    //         $dateToString: {
    //           format: "%Y%m%d",
    //           date: "$date2"
    //         }
    //       }
    //     }
    //   },
    {
      $group: {
        _id: "$date2",
        count: { $sum: 1 },
      },
    },
    { $skip: 0 },
    // { $limit: 15 },
    // { $count: "number_of_days" }
  ]);
  const rawBeesList = await posts
    .find({
      $text: { $search: "raw bees" },
      "poster.id": { $eq: userrecord.id },
      time: {
        $gte: new Date(year + "-01-01").getTime(),
        $lte: new Date(year + "-12-31").getTime(),
      },
    })
    .limit(1)
    .toArray(function (err: any, result: any) {
      if (err) throw err;
      client.close();
    });
    const nightyMorningList = await posts
    .find({
      $text: { $search: "\"nighty morning\"" },
      "poster.id": { $eq: userrecord.id },
      time: {
        $gte: new Date(year + "-01-01").getTime(),
        $lte: new Date(year + "-12-31").getTime(),
      },
    })
    .toArray(function (err: any, result: any) {
      if (err) throw err;
      client.close();
    });
  const list8443 = await posts
    .find({
      $text: { $search: "8443" },
      "poster.id": { $eq: userrecord.id },
      time: {
        $gte: new Date(year + "-01-01").getTime(),
        $lte: new Date(year + "-12-31").getTime(),
      },
    })
    .limit(1)
    .toArray(function (err: any, result: any) {
      if (err) throw err;
      client.close();
    });
    const kidsAreMoreList = await posts
    .find({
      $text: { $search: "\"kids\" \more accepting\" \"adults\"" },
      "poster.id": { $eq: userrecord.id },
      time: {
        $gte: new Date(year + "-01-01").getTime(),
        $lte: new Date(year + "-12-31").getTime(),
      },
    })
    .limit(1)
    .toArray(function (err: any, result: any) {
      if (err) throw err;
      client.close();
    });
    const ratioList = await posts
    .find({
      $text: { $search: "\"ratio\"" },
      "poster.id": { $eq: userrecord.id },
      "repost._id": { $exists: true },
      time: {
        $gte: new Date(year + "-01-01").getTime(),
        $lte: new Date(year + "-12-31").getTime(),
      },
    })
    .toArray(function (err: any, result: any) {
      if (err) throw err;
      client.close();
    });
    const repostList = await posts
    .find({
      "poster.id": { $eq: userrecord.id },
      "repost._id": { $exists: true },
      time: {
        $gte: new Date(year + "-01-01").getTime(),
        $lte: new Date(year + "-12-31").getTime(),
      },

    })
    .count();

    const repostList2 = await posts
    .find({
      "poster.id": { $eq: userrecord.id },
      "repost._id": { $exists: true },
      time: {
        $gte: new Date((parseInt(year) - 1).toString() + "-01-01").getTime(),
        $lte: new Date((parseInt(year) - 1).toString() + "-12-31").getTime(),
      },
    })
    .count();
    const ratiodList = await posts
    .find({
      $text: { $search: "\"ratio\"" },
      "repost.poster.id": { $eq: userrecord.id },
      time: {
        $gte: new Date(year + "-01-01").getTime(),
        $lte: new Date(year + "-12-31").getTime(),
      },
    })
    .toArray(function (err: any, result: any) {
      if (err) throw err;
      client.close();
    });
    const mathClassList = await posts
    .find({
      "poster.id": { $eq: userrecord.id },
      "repost._id": "648cb32739982005336a7a6d",

      time: {
        $gte: new Date(year + "-01-01").getTime(),
        $lte: new Date(year + "-12-31").getTime(),
      },
    })
    .toArray(function (err: any, result: any) {
      if (err) throw err;
      client.close();
    });
    const elonList = await posts
    .find({
      "poster.id": { $eq: userrecord.id },
      $text: { $search: "\"elon\"" },

      time: {
        $gte: new Date(year + "-01-01").getTime(),
        $lte: new Date(year + "-12-31").getTime(),
      },
    })
    .toArray(function (err: any, result: any) {
      if (err) throw err;
      client.close();
    });
    const immark_v2List = await posts
    .find({
      "poster.id": { $eq: userrecord.id },
      "repost.poster.name": "immark_v2",

      time: {
        $gte: new Date(year + "-01-01").getTime(),
        $lte: new Date(year + "-12-31").getTime(),
      },
    })
    .toArray(function (err: any, result: any) {
      if (err) throw err;
      client.close();
    });
  console.log(rawBeesList);
  const pictures = [];
  for await (const doc of query) {
    pictures.push(doc);
  }
  const pictures2 = [];

  for await (const doc of query2) {
    pictures2.push(doc);
  }
  const pictures3 = [];

  for await (const doc of query3) {
    pictures3.push(doc);
  }
  const pictures4 = [];

  for await (const doc of query4) {
    pictures4.push(doc);
  }

  // var val = pictures.reduce(function(previousValue, currentValue) {
  //   return {
  //     count: previousValue.count + currentValue.count
  //   }
  // });
  console.log(ratioList)
  return Response.json({
    datesPosted: pictures,
    datesPostedLastYear: pictures4,
    joindate: userrecord.history.joined,
    postCount: {
      count: pictures2[0] ? pictures2[0].number_of_days : 0,
      count2: pictures3[0] ? pictures3[0].number_of_days : 0,
      repostCount: repostList > 0? repostList : 0,
      repostCount2: repostList2 > 0 ? repostList2 : 0,
    },
    statChanges: {
      followerChange: followerChange,
      followingChange: followingChange,
    },
    stats: userrecord.stats,
    trends: { rawBees: rawBeesList.length > 0, ratioList: ratioList.length > 0 ? ratioList.map((post: any) => post.loves > post.repost.loves) : [], ratiodList: ratiodList.length > 0 ? ratiodList.map((post: any) => post.loves > post.repost.loves) : [], kidsAreMore: kidsAreMoreList.length > 0, elonMusk: elonList.length > 0 ? elonList.length : 0, mathClass: mathClassList.length > 0 ? mathClassList.length : 0, nightyMorning: nightyMorningList.length > 0 ? nightyMorningList.length : 0,"8443": list8443.length > 0, twoyear: userrecord.history.joined < 1676091600000, immark_v2: immark_v2List.length > 0 ? immark_v2List.length : 0 },
  });
}
