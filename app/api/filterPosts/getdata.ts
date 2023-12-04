const { MongoClient } = require("mongodb");

export async function getData(
  username: string | null,
  page: string,
  fullquery: any,
  sortValue: any,
  searchtext: string
) {
  const uri = process.env.CONNECTION_STRING;
  const client = new MongoClient(uri);
  try {
    const database = client.db("womposts");
    const posts = database.collection("posts");
    console.log(fullquery)

    // Query for a movie that has the title 'Back to the Future'
    let query : any = {}
    if (username=="any") {
      query["poster.name"] = { $exists: true }
    } else {
      query["poster.name"] = username;
    }
    let search = { $text: { $search: searchtext } };
    if (searchtext === "") {
      query = { ...query, ...fullquery };
    } else {
      query = { ...query, ...fullquery, ...search };
    }
    let sort: any = {};
    // loop through sort
    for (let i = 0; i < JSON.parse(sortValue).length; i++) {
      let fieldValue = ""
      if (JSON.parse(sortValue)[i].field === "loves") {
        fieldValue = "loves";
      } else if (JSON.parse(sortValue)[i].field === "comments") {
        fieldValue = "comments";
      } else if (JSON.parse(sortValue)[i].field === "reposts") {
        fieldValue = "reposts";
      } else if (JSON.parse(sortValue)[i].field === "posted") {
        fieldValue = "time";
      } 
      sort[fieldValue] =
        JSON.parse(sortValue)[i].direction === "asc" ? 1 : -1;
    }

    console.log(15 * (parseInt(page) - 1))
    console.log(query)
    const postlist = await posts
      .find(query)
      .sort(sort)
      .skip(15 * (parseInt(page) - 1))
      .limit(15)
      .toArray(function (err: any, result: any) {
        if (err) throw err;
        client.close();
      });

    return postlist;
  } finally {
    await client.close();

    // Ensures that the client will close when you finish/error
  }
}

export async function getRecordCount(
  username: string | null,
  fullquery: any,
  searchtext: string
) {
  const uri = process.env.CONNECTION_STRING;
  const client = new MongoClient(uri);
  try {
    const database = client.db("womposts");
    const posts = database.collection("posts");

    // Query for a movie that has the title 'Back to the Future'
    let query : any = {}
    if (username=="any") {
      query["poster.name"] = { $exists: true }
    } else {
      query["poster.name"] = username;
    }
    // let query = { "poster.name": username };
    let search = { $text: { $search: searchtext } };

    if (searchtext === "") {
      query = { ...query, ...fullquery };
    } else {
      query = { ...query, ...fullquery, ...search };
    }
    const count = await posts.find(query).count();

    return count;
  } finally {
    await client.close();
  }
}
