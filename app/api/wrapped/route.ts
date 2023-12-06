const { MongoClient } = require("mongodb");
import { type NextRequest } from "next/server";
// @ts-ignore
import { get, set } from "lodash";
const rateLimit = 2; // Number of allowed requests per minute

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
  const topPosts = posts.aggregate([
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
      $sort: { loves: -1 },
    },
    {
      $limit: 3,
    },
  ]);
  const worstPosts = posts.aggregate([
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
      $sort: { loves: 1 },
    },
    {
      $limit: 3,
    },
  ]);
  const topReposted = posts.aggregate([
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
      $sort: { reposts: -1 },
    },
    {
      $limit: 3,
    },
  ]);
  const topComments = posts.aggregate([
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
      $sort: { comments: -1 },
    },
    {
      $limit: 3,
    },
  ]);
  const averageLoves = posts.aggregate([
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
      $group: {
        _id: "poster.id",
        avgQuantity: { $avg: "$loves" },
      },
    },
  ]);
  const averageLoves2 = posts.aggregate([
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
      $group: {
        _id: "poster.id",
        avgQuantity: { $avg: "$loves" },
      },
    },
  ]);
  const countpipeline = posts.aggregate([
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
    { $project: { _id: 1, imgTag: "$imgTags.match" } },
    { $count: "numberOfImages" },
  ]);
  const topImages = posts.aggregate([
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
      $sort: {
        loves: -1,
      },
    },
    {
      $project: {
        imgTags: {
          $regexFindAll: {
            input: "$content",
            regex: "<img[^>]*>",
          },
        },
        loves: 1,
      },
    },
    {
      $unwind: "$imgTags",
    },
    {
      $project: {
        _id: 1,
        imgTag: "$imgTags.match",
        loves: 1,
      },
    },
    { $limit: 10 },
  ]);
  const averageComments = posts.aggregate([
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
      $group: {
        _id: "poster.id",
        avgQuantity: { $avg: "$comments" },
      },
    },
  ]);
  const averageComments2 = posts.aggregate([
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
      $group: {
        _id: "poster.id",
        avgQuantity: { $avg: "$comments" },
      },
    },
  ]);
  const averageReposts = posts.aggregate([
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
      $group: {
        _id: "poster.id",
        avgQuantity: { $avg: "$reposts" },
      },
    },
  ]);
  const averageReposts2 = posts.aggregate([
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
      $group: {
        _id: "poster.id",
        avgQuantity: { $avg: "$reposts" },
      },
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
  const youReposted = posts.aggregate([
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
      $match: {
        "repost._id": { $exists: true },
      },
    },
    {
      $group: {
        _id: "$repost.poster.id",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 3 },
  ]);
  const repostedYou = posts.aggregate([
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
        "repost._id": { $exists: true },
      },
    },
    {
      $match: {
        "repost.poster.id": { $eq: userrecord.id },
      },
    },
    {
      $group: {
        _id: "$poster.id",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 3 },
  ]);
  const topMentions = posts.aggregate([
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
    // Match messages containing mentions
    {
      $match: {
        content: { $regex: /@(\w+)/ },
      },
    },
    // Extract mentioned usernames using $regex and $project
    {
      $project: {
        mentionedUsers: {
          $regexFindAll: {
            input: "$content",
            regex: /@(\w+)/,
          },
        },
      },
    },
    // Unwind the array of mentioned users
    {
      $unwind: "$mentionedUsers",
    },
    // Group and count the mentions for each user
    {
      $group: {
        _id: "$mentionedUsers.match",
        count: { $sum: 1 },
      },
    },
    // Sort users by mention count in descending order
    {
      $sort: { count: -1 },
    },
    // Limit the result to the top N mentioned users
    {
      $limit: 5, // Change this number based on your requirement
    },
  ]);
  const wordCount = posts.aggregate([
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
    // Match messages containing mentions
    {
      $project: {
        wordCount: { $size: { $split: ["$content", " "] } }
      }
    },
    {
      $group: {
        _id: null,
        averageWordCount: { $avg: "$wordCount" }
      }
    }
  ]);
  const characterCount = posts.aggregate([
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
    // Match messages containing mentions
    {
      $project: {
        characterCount: { $strLenCP: "$content" }
      }
    },
    {
      $group: {
        _id: null,
        averageCharacterCount: { $avg: "$characterCount" }
      }
    }
  ]);
  const wordLength = posts.aggregate([
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
    // Match messages containing mentions
    {
      $project: {
        wordLengths: {
          $map: {
            input: { $split: ["$content", " "] },
            as: "word",
            in: { $strLenCP: "$$word" }
          }
        }
      }
    },
    {
      $unwind: "$wordLengths"
    },
    {
      $group: {
        _id: null,
        averageWordLength: { $avg: "$wordLengths" }
      }
    }
  ]);
  const wordCount2 = posts.aggregate([
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
    // Match messages containing mentions
    {
      $project: {
        wordCount: { $size: { $split: ["$content", " "] } }
      }
    },
    {
      $group: {
        _id: null,
        averageWordCount: { $avg: "$wordCount" }
      }
    }
  ]);
  const characterCount2 = posts.aggregate([
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
    // Match messages containing mentions
    {
      $project: {
        characterCount: { $strLenCP: "$content" }
      }
    },
    {
      $group: {
        _id: null,
        averageCharacterCount: { $avg: "$characterCount" }
      }
    }
  ]);
  const wordLength2 = posts.aggregate([
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
    // Match messages containing mentions
    {
      $project: {
        wordLengths: {
          $map: {
            input: { $split: ["$content", " "] },
            as: "word",
            in: { $strLenCP: "$$word" }
          }
        }
      }
    },
    {
      $unwind: "$wordLengths"
    },
    {
      $group: {
        _id: null,
        averageWordLength: { $avg: "$wordLengths" }
      }
    }
  ]);
  const topWords = posts.aggregate([
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
        plainTextContent: {
          $replaceAll: {
            input: "$content",
            find: '/<.*?>/g',  // Regex to match HTML tags
            replacement: "",
          },
        },
      },
    },
    {
      $project: {
        words: { $split: ["$plainTextContent", " "] },
      },
    },
    {
      $unwind: {
        path: "$words",
      },
    },
    {
      $group: {
        _id: "$words",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 25 },
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
      $text: { $search: '"nighty morning"' },
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
      $text: { $search: '"kids" more accepting" "adults"' },
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
      $text: { $search: '"ratio"' },
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
  const blankRepostCount = await posts
    .find({
      "poster.id": { $eq: userrecord.id },
      content: "",
      "repost._id": { $exists: true },

      time: {
        $gte: new Date((parseInt(year) - 1).toString() + "-01-01").getTime(),
        $lte: new Date((parseInt(year) - 1).toString() + "-12-31").getTime(),
      },
    })
    .count();
  const ratiodList = await posts
    .find({
      $text: { $search: '"ratio"' },
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
  const hotTakeList = await posts
    .find({
      $text: { $search: '"hot take"' },
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
      $text: { $search: '"elon"' },

      time: {
        $gte: new Date(year + "-01-01").getTime(),
        $lte: new Date(year + "-12-31").getTime(),
      },
    })
    .toArray(function (err: any, result: any) {
      if (err) throw err;
      client.close();
    });
    const dragonList = await posts
    .find({
      "poster.id": { $eq: userrecord.id },
      $text: { $search: '"dragon"' },

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
  const pictures = [];
  for await (const doc of query) {
    pictures.push(doc);
  }
  const pictures5 = [];
  for await (const doc of averageLoves) {
    pictures5.push(doc);
  }
  const pictures6 = [];
  for await (const doc of averageComments) {
    pictures6.push(doc);
  }
  const pictures7 = [];
  for await (const doc of averageReposts) {
    pictures7.push(doc);
  }
  console.log(pictures5);
  const pictures2 = [];

  for await (const doc of query2) {
    pictures2.push(doc);
  }
  const pictures3 = [];

  for await (const doc of query3) {
    pictures3.push(doc);
  }
  const pictures8 = [];

  for await (const doc of countpipeline) {
    pictures8.push(doc);
  }
  const pictures4 = [];

  for await (const doc of query4) {
    pictures4.push(doc);
  }
  const pictures9 = [];
  for await (const doc of averageLoves2) {
    pictures9.push(doc);
  }
  const pictures10 = [];
  for await (const doc of averageComments2) {
    pictures10.push(doc);
  }
  const pictures11 = [];
  for await (const doc of averageReposts2) {
    pictures11.push(doc);
  }
  const pictures12 = [];
  for await (const doc of topPosts) {
    pictures12.push(doc);
  }
  const pictures13 = [];
  for await (const doc of topReposted) {
    pictures13.push(doc);
  }
  const pictures14 = [];
  for await (const doc of topComments) {
    pictures14.push(doc);
  }
  const pictures15 = [];
  for await (const doc of topWords) {
    if (doc._id !== '' && doc._id !== ' ' && doc._id !== "</p>") {
      pictures15.push(doc);
    }
  }
  const pictures16 = [];
  for await (const doc of topImages) {
    pictures16.push(doc);
  }
  const pictures17 = [];
  for await (const doc of worstPosts) {
    pictures17.push(doc);
  }
  const pictures18 = [];
  for await (const doc of youReposted) {
    const uname = await fetch(
      `https://api.wasteof.money/username-from-id/` + doc._id + `/`
    ).then((res) => res.json());
    pictures18.push(Object.assign(doc, { username: uname.username }));
  }
  const pictures19 = [];
  for await (const doc of repostedYou) {
    const uname = await fetch(
      `https://api.wasteof.money/username-from-id/` + doc._id + `/`
    ).then((res) => res.json());
    pictures19.push(Object.assign(doc, { username: uname.username }));
  }
  const pictures20 = [];
  for await (const doc of topMentions) {
    pictures20.push(Object.assign(doc, { username: doc._id.split("@")[1] }));
  }
  const pictures21 = [];
  for await (const doc of wordCount) {
    pictures21.push(doc);
  }
  const pictures22 = [];
  for await (const doc of characterCount) {
    pictures22.push(doc);
  }
  const pictures23 = [];
  for await (const doc of wordLength) {
    pictures23.push(doc);
  }
  const pictures24 = [];
  for await (const doc of wordCount2) {
    pictures24.push(doc);
  }
  const pictures25 = [];
  for await (const doc of characterCount2) {
    pictures25.push(doc);
  }
  const pictures26 = [];
  for await (const doc of wordLength2) {
    pictures26.push(doc);
  }

  const has4000 = await fetch(
    "https://api.wasteof.money/users/4000/followers/" + userrecord.name + "/"
  ).then((res) => res.json());

  // var val = pictures.reduce(function(previousValue, currentValue) {
  //   return {
  //     count: previousValue.count + currentValue.count
  //   }
  // });
  console.log(userrecord)
  return Response.json({
    datesPosted: pictures,
    datesPostedLastYear: pictures4,
    joindate: userrecord.history ? userrecord.history.joined : 0,
    postCount: {
      count: pictures2[0] ? pictures2[0].number_of_days : 0,
      count2: pictures3[0] ? pictures3[0].number_of_days : 0,
      repostCount: repostList > 0 ? repostList : 0,
      repostCount2: repostList2 > 0 ? repostList2 : 0,
      blankRepostCount: blankRepostCount > 0 ? blankRepostCount : 0,
      mediaCount: pictures8[0] ? pictures8[0].numberOfImages : 0,
    },
    postAverages: {
      averageLoves: pictures5[0] ? pictures5[0].avgQuantity : 0,
      averageComments: pictures6[0] ? pictures6[0].avgQuantity : 0,
      averageReposts: pictures7[0] ? pictures7[0].avgQuantity : 0,
      averageLoves2: pictures9[0] ? pictures9[0].avgQuantity : 0,
      averageComments2: pictures10[0] ? pictures10[0].avgQuantity : 0,
      averageReposts2: pictures11[0] ? pictures11[0].avgQuantity : 0,
    },
    statChanges: {
      followerChange: followerChange,
      followingChange: followingChange,
    },
    top: {
      topPosts: pictures12,
      topReposted: pictures13,
      topCommented: pictures14,
      topImages: pictures16,
      worstPosts: pictures17,
      youReposted: pictures18,
      repostedYou: pictures19,
      topMentions: pictures20,
    },
    postContentAnalysis: {
      topWords: pictures15,
      wordCount: pictures21[0] ? pictures21[0].averageWordCount : 0,
      characterCount: pictures22[0] ? pictures22[0].averageCharacterCount : 0,
      wordLength: pictures23[0] ? pictures23[0].averageWordLength : 0,
      wordCount2: pictures24[0] ? pictures24[0].averageWordCount : 0,
      characterCount2: pictures25[0] ? pictures25[0].averageCharacterCount : 0,
      wordLength2: pictures26[0] ? pictures26[0].averageWordLength : 0,

    },
    stats: userrecord.stats,
    trends:
      year == "2023"
        ? {
            hottake: hotTakeList.length > 0 ? hotTakeList.length : 0,
            rawBees: rawBeesList.length > 0,
            ratioList:
              ratioList.length > 0
                ? ratioList.map((post: any) => post.loves > post.repost.loves)
                : [],
            ratiodList:
              ratiodList.length > 0
                ? ratiodList.map((post: any) => post.loves > post.repost.loves)
                : [],
            kidsAreMore: kidsAreMoreList.length > 0,
            elonMusk: elonList.length > 0 ? elonList.length : 0,
            dragons: dragonList.length > 0 ? dragonList.length : 0,
            mathClass: mathClassList.length > 0 ? mathClassList.length : 0,
            nightyMorning:
              nightyMorningList.length > 0 ? nightyMorningList.length : 0,
            "8443": list8443.length > 0,
            twoyear: (userrecord.history ? userrecord.history.joined : 0) < 1676091600000,
            immark_v2: immark_v2List.length > 0 ? immark_v2List.length : 0,
            "4000": has4000,
          }
        : {},
  });
}
