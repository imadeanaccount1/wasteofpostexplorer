import { type NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'


function compareNumbers(a: any, b: any) {
    return b.time - a.time;
  }

  function isGreaterThan(x: any, y: any) {
    return x > y
  }
  function isLessThan(x: any, y: any) {
    return x < y
  }


  function greaterThanOrEqualTo(x: any, y: any) {
    return x >= y
  }
  function lessThanOrEqualTo(x: any, y: any) {
    return x <= y
  }
  function equalTo(x: any, y: any) {
    return x == y
  }
  function notEqualTo(x: any, y: any) {
    return x != y
  }


function evaluateFilters(posts: any, filters: any) {
    console.log(typeof(filters), filters.length, filters)
    let postlist = [...posts]
    for (let step = 0; step < filters.length; step++) {
        let fieldValue : string | null = null
        if (filters[step].field === "likes") {
            fieldValue = "loves"
        }
        let operationValue : Function | null = null
        let valueValue : any = null
        if (filters[step].operation === ">") {
            operationValue = isGreaterThan
            valueValue = parseInt(filters[step].value)
        } else if (filters[step].operation === "<") {
            operationValue = isLessThan
            valueValue = parseInt(filters[step].value)
        } else if (filters[step].operation === ">=") {
            operationValue = greaterThanOrEqualTo
            valueValue = parseInt(filters[step].value)
        } else if (filters[step].operation === "<=") {
            operationValue = lessThanOrEqualTo
            valueValue = parseInt(filters[step].value)
        }  else if (filters[step].operation === "!=") {
            operationValue = notEqualTo
            valueValue = parseInt(filters[step].value)
        } else if (filters[step].operation === "==") {
            operationValue = equalTo
            valueValue = parseInt(filters[step].value)
        }
        if (fieldValue != null && operationValue != null && valueValue != null) {
        postlist = postlist.filter((post: any) => {
            console.log(post[fieldValue!], post[fieldValue!]> valueValue)
            return operationValue!(post[fieldValue!], valueValue)
        })
    }
        console.log("step", step)
    }
    console.log(postlist.length)
    return postlist
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const user = searchParams.get('user')
    const page : string = searchParams.get('page')!
    const sort : string = searchParams.get('sortBy')!
    const filters : any = JSON.parse(searchParams.get('filters')!)
    console.log('filters', filters)

    const sortDirection : string = searchParams.get('sortDirection')!

    const sorting : any= {
        "time.asc": (a: any, b: any) => a.time - b.time,
        "time.desc": (a: any, b: any) => b.time - a.time,
    }

    console.log("path is222", path.resolve('app/api/myjsonfile.json'))
    const allposts = await fs.readFileSync(path.resolve('app/api/myjsonfile.json'), 'utf8')
    let count = 0
    const postsbyuser : any= JSON.parse(allposts).filter((post: any) => post.poster.name === user)
    
    console.log("HELLO WORLD")
    postsbyuser.sort(sorting[sort+"."+sortDirection])

    const filteredposts = await evaluateFilters(postsbyuser, filters)

    const pageCount = Math.ceil(filteredposts.length/15)
    console.log(pageCount)

    const pages = Array.from({length: pageCount}, (x, i) => i).map((page) => (page+1).toString());

    console.log(pages)
    if (pageCount > 6) {
        console.log(Math.floor(pageCount/2)-((pageCount-3)/2), (pageCount-2))
        pages.splice(3, (pageCount-6), "...")
    }
    const displaypages = pages
    console.log(displaypages)
    console.log("parse", parseInt(page))
    if (typeof(page) == number) {
        // @ts-ignore
    filteredposts.splice(0, parseInt(page!-1)*15)

    const selectedposts = filteredposts.filter((post: any) => {
        if (count < 15) {
            count++;
            return true;
          }
          return false;
    })
}
    // console.log(selectedposts[0])


    return  Response.json({ posts: selectedposts, pagination: {pages: displaypages, pageCount: pageCount} })
    // return Response.json(fs.readFile(path.resolve('app/api/myjsonfile.json'), 'utf8', (err, data) => {
    //     console.log("got something")
    //     if (err) {
    //         console.log(err)
    //         return { posts: [] }
    //     }
        
    // }))
    // console.log(allposts)
    // console.log(query)
}
  