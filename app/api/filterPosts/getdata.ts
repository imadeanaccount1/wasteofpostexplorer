const { MongoClient } = require("mongodb");
// Replace the uri string with your connection string.

export async function getData(
  username: string | null,
  page: string,
  fullquery: any,
  sortValue: any,
  searchtext: string
) {
  const uri = process.env.CONNECTION_STRING;
  console.log(uri);
  const client = new MongoClient(uri);
  try {
    const database = client.db("womposts");
    const posts = database.collection("posts");

    // Query for a movie that has the title 'Back to the Future'
    let query = { "poster.name": username };
    let search = { $text: { $search: searchtext } }
    console.log(searchtext)
    if (searchtext === "") {
    query = { ...query, ...fullquery };
    } else {
      query = { ...query, ...fullquery, ...search };
    }
    let sort: any = { };
    // loop through sort
    console.log('sortloop', JSON.parse(sortValue))
    for (let i = 0; i < JSON.parse(sortValue).length; i++) {
      console.log(JSON.parse(sortValue)[i])
      sort[JSON.parse(sortValue)[i].field] = JSON.parse(sortValue)[i].direction==="asc"?1:-1;
    }

    // sort[sortValue] = sortDir
    console.log("sort", sort);
    console.log("page number", page, 15 * (parseInt(page) - 1));
    console.log('alsoquery', query)
    const movie = await posts
      .find(query)
      .sort(sort)
      .skip(15 * (parseInt(page) - 1))
      .limit(15)
      .toArray(function (err: any, result: any) {
        if (err) throw err;
        console.log(result);
        client.close();
      });
    console.log("allresults", movie.length);

    return movie;
  } finally {
    await client.close();

    // Ensures that the client will close when you finish/error
  }
}

export async function getRecordCount(username: string | null, fullquery: any, searchtext: string) {
  const uri = process.env.CONNECTION_STRING;
  console.log(uri);
  const client = new MongoClient(uri);
  try {
    const database = client.db("womposts");
    const posts = database.collection("posts");

    // Query for a movie that has the title 'Back to the Future'
    let query = { "poster.name": username };
    let search = { $text: { $search: searchtext } }

    if (searchtext === "") {
      query = { ...query, ...fullquery };
      } else {
        query = { ...query, ...fullquery, ...search };
      }    console.log("query", query);

    const movie = await posts.find(query).count();
    console.log("number of posts", movie);

    return movie;
  } finally {
    await client.close();

    // Ensures that the client will close when you finish/error
  }
}
