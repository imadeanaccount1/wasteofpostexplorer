const { MongoClient } = require("mongodb");
import { type NextRequest } from "next/server";
import rateLimiterMiddleware from "../utils/rateLimiterMiddleware";
const rateLimit = 20; // Number of allowed requests per minute

export async function GET(request: NextRequest) {
  const ip : any = request.headers.get('x-real-ip') ||  request.ip;

  if (!rateLimiterMiddleware(ip, rateLimit)) {
    return Response.json({ error: 'Rate Limited' }, { status: 429 })
    // return Response.status(429).json({ message: 'Too Many Requests' });
  }
  const uri = process.env.CONNECTION_STRING;
  const client = new MongoClient(uri);
  const searchParams = request.nextUrl.searchParams;

  const search = searchParams.get("search");
  const advanced = searchParams.get("advanced");
  console.log(advanced)

  try {
    const database = client.db("womposts");
    const users = database.collection("users");

    const userlistpipeline = [
      {
        $sort: {"stats.followers": -1}
      },
    {
        $limit: advanced=="true" ? 6 : 10
    }
    ];
    if (search!=null && search!="" && search != undefined) {
    userlistpipeline.splice(0, 0, {
      // @ts-ignore
      $search: {
          "autocomplete": {
              "query": search,
              "path": "name",
              "fuzzy": {
                "maxEdits": 2,
                "prefixLength": 3
            }                }
      } 
  })
}else {
  console.log('equals null')

}

    const userslist = users.aggregate(userlistpipeline);
    const userslistdata = [];
    for await (const doc of userslist) {
      console.log(doc);
      userslistdata.push(doc);
    }
   return Response.json({
    users: userslistdata
   })
  } finally {
    await client.close();

    // Ensures that the client will close when you finish/error
  }
}