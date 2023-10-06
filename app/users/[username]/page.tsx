"use client";

import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import MyProfile from "../../components/PostList";

export default function Page({
  params,
}: {
  params: { username: string };
}) {
  console.log(params.username);
  const [loaded, setLoaded] = React.useState(false);

  const [neededPosts, setData] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    pages: [],
    pageCount: 0,
  });
  const [page, setPage] = React.useState("1");
  const [sort, setSort] = React.useState([{ field: "posted", direction: "asc" }]);
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState([
    { field: "loves", operation: ">", value: "0" },
  ]);
  function fetchData() {
    fetch(
      "../../api/filterPosts?user=" +
        params.username +
        "&page=" +
        page.toString() +
        "&sort=" +
        JSON.stringify(sort) +
        "&filters=" +
        JSON.stringify(filters) +
        "&search=" +
        search
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert("Rate limted. :/ Please wait 1 minute and try again")
        } else {
        setData(data.posts);
        setPagination(data.pagination);
        setLoaded(true);
        }
      });
  }

  function applyFilters() {
    console.log("applying filters");
    setLoaded(false);
    fetchData();
  }
  if (!loaded) {
    fetchData();
  }
  return (
    <>
      <CssVarsProvider disableTransitionOnChange>
        <CssBaseline />
        <Box sx={{ display: "flex", minHeight: "100dvh" }}>
          <Sidebar page="user" user={params.username} />
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
            <MyProfile
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
