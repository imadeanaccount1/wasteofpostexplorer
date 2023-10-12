
export function getPagination(recordCount: number, page: string) {
const pageCount = Math.ceil(recordCount / 15);
  const pages = Array.from({ length: pageCount }, (x, i) => i).map((page) =>
    (page + 1).toString()
  );

  if (pageCount > 6) {
    // console.log("page", parseInt(page), (parseInt(pages[pages.length-1]) -1), parseInt(pages[Math.floor(pages.length/2)]) )
    if (parseInt(page)< (parseInt(pages[pages.length-1]) -1) && parseInt(page)> parseInt(pages[Math.floor(pages.length/2)])) {
      // console.log('tail end')
      // console.log(parseInt(page)+2, pages.length - (parseInt(page)+2)+1)
      pages.splice(parseInt(page)+1, pages.length - (parseInt(page)+2)+1)
      // console.log(pages)
    } else if (parseInt(page)> 2 && parseInt(page)< parseInt(pages[Math.ceil(pages.length/2)])) {
      // console.log('begin end')
      pages.splice(0, parseInt(page)-2)
      // console.log(pages) 
    }
    pages.splice(3, pages.length-6, "...");
  }
  const displaypages = pages;
  return [displaypages, pageCount]
}