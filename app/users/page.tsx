"use client";

import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import UserList from "../components/UserList";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Page({
  params,
}: {
  params: { username: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // console.log(params.username);
  const [loaded, setLoaded] = React.useState(false);
  const [everloaded, seteverLoaded] = React.useState(false);


  const [neededPosts, setData] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    pages: [],
    pageCount: 0,
  });
  const [page, setPage] = React.useState(searchParams.get("page") ||"1");
  const [sort, setSort] = React.useState(JSON.parse(searchParams.get("sort")!) || [{ field: "join", direction: "asc" }]);
  const [search, setSearch] = React.useState(searchParams.get("search") ||"");
  const [filters, setFilters] = React.useState(JSON.parse(searchParams.get("filters")!) || [
    { field: "join", operation: ">", value: "2023-01-01" },
  ]);
  function fetchData(thispage: string|null=null) {
    onSelect(sort, filters, search, thispage ? thispage : page)

    fetch(
      "../../api/filterUsers?user=" +
        params.username +
        "&page=" +
        (thispage?thispage:page) +
        "&sort=" +
        JSON.stringify(sort) +
        "&filters=" +
        JSON.stringify(filters) +
        "&search=" +
        search
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)
        if (data.error) {
          alert("Rate limted. :/ Please wait 1 minute and try again")
        } else {
          setPagination(data.pagination);

        setData(data.posts);
        setLoaded(true);
        seteverLoaded(true)
        }
      });
  }

  const onSelect = (sort: any, filters: any, search: string, page:string) => {
    // now you got a read/write object
    const current = new URLSearchParams(Array.from(searchParams.entries())); // -> has to use this form

    // update as necessary
    // @ts-ignore
    if (!search) {
      current.delete("search");
    } else {

      current.set("search", search)
    }
      current.set("filters", JSON.stringify(filters));
      current.set("sort", JSON.stringify(sort));
    if (page == "1") {
      current.delete("page");
    } else {
      current.set("page", page);
    }

    // cast to string
    const searchp = current.toString();
    // or const query = `${'?'.repeat(search.length && 1)}${search}`;
    const query = searchp ? `?${searchp}` : "";

    router.push(`${pathname}${query}`);
  };

  function applyFilters(thispage: string|null=null) {
    // console.log("applying filters");
    setLoaded(false);
    fetchData(thispage);
  }
  if (!everloaded) {
    fetchData();
  }
  return (
    <>
      <CssVarsProvider disableTransitionOnChange>
        <CssBaseline />
        <Box sx={{ display: "flex", minHeight: "100dvh" }}>
          <Sidebar page="users" user={params.username} />
          <Header />
          <Box
            component="main"
            className="MainContent"
            sx={{
              pt: {
                xs: "calc(12px + var(--Header-height))",
                md: 3,
              },
              pb: {
                xs: 2,
                sm: 2,
                md: 3,
              },
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              height: "100dvh",
              gap: 1,
              overflow: "auto",
            }}
          >
            <UserList
              applyFilters={applyFilters}
              setFilters={setFilters}
              filters={filters}
              sort={sort}
              search={search}
              setSearch={setSearch}
              setSort={setSort}
              setPage={setPage}
              page={page}
              pagination={pagination}
              selectedPosts={neededPosts}
              loaded={loaded}
              user={params.username}
            />
          </Box>
        </Box>
      </CssVarsProvider>
    </>
  );
}
