const { MongoClient } = require("mongodb");

export async function getData(
  page: string,
  fullquery: any,
  sortValue: any,
  searchtext: string
) {
  const uri = process.env.CONNECTION_STRING;
  const client = new MongoClient(uri);
  try {
    const database = client.db("womposts");
    const posts = database.collection("users");

    // Query for a movie that has the title 'Back to the Future'
    let search = { $text: { $search: searchtext } };

    let query = {...fullquery};

    let sort: any = {};
    // loop through sort
    for (let i = 0; i < JSON.parse(sortValue).length; i++) {
      let fieldValue = ""
      if (JSON.parse(sortValue)[i].field === "join") {
        fieldValue = "history.joined";
      } else if (JSON.parse(sortValue)[i].field === "followers") {
        fieldValue = "stats.followers";
      } else if (JSON.parse(sortValue)[i].field === "following") {
        fieldValue = "stats.following";
      } else if (JSON.parse(sortValue)[i].field === "name") {
        fieldValue = "name";
      }

      sort[fieldValue] =
        JSON.parse(sortValue)[i].direction === "asc" ? 1 : -1;
    }
    console.log(sort)


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
  fullquery: any,
  searchtext: string
) {
  const uri = process.env.CONNECTION_STRING;
  const client = new MongoClient(uri);
  try {
    const database = client.db("womposts");
    const posts = database.collection("users");

    // Query for a movie that has the title 'Back to the Future'
    let search = { $text: { $search: searchtext } };

    let query = { ...fullquery };
    
    const count = await posts.find(query).count();

    return count;
  } finally {
    await client.close();
  }
}
