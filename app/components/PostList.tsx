import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import Divider from "@mui/joy/Divider";
import { iconButtonClasses } from "@mui/joy/IconButton";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import LinearProgress from '@mui/joy/LinearProgress';
import SearchIcon from "@mui/icons-material/Search";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import Input from "@mui/joy/Input";
import FormControl from "@mui/joy/FormControl";
import IconButton from "@mui/joy/IconButton";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, { tabClasses } from "@mui/joy/Tab";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import CardOverflow from "@mui/joy/CardOverflow";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import EmptyState from "./EmptyState";

import FolderIcon from "@mui/icons-material/Folder";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import LoopIcon from "@mui/icons-material/Loop";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import QueryBuilderOutlinedIcon from "@mui/icons-material/QueryBuilderOutlined";

import Select from "@mui/joy/Select";

import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import Option from "@mui/joy/Option";
import ListDivider from "@mui/joy/ListDivider";

import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import WestOutlinedIcon from "@mui/icons-material/WestOutlined";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import formatTime from "../utils/formatTime";
import Image from "next/image";
import type { ChangeEvent } from "react";

import styles from "./post.module.css";
import Post from "./Post";

function FilterBy(props: any) {
  return (
    <Stack
      sx={{ width: "100%", justifyContent: "space-between" }}
      direction="row"
    >
      <Stack sx={{flexWrap: "wrap", rowGap: "8px"}} spacing={2} direction="row">
        <FilterAltOutlinedIcon sx={{ alignSelf: "center" }} />
        <Typography
          sx={{ alignSelf: "center" }}
          level="body-sm"
          fontWeight={700}
        >
          Field:
        </Typography>
        <Select
          value={props.field}
          onChange={(
            event: React.SyntheticEvent | null,
            newValue: string | null
          ) => {
            const filters: any = [...props.filters];
            filters[props.filterIndex].field = newValue;
            props.setFilters(filters);
          }}
          size="sm"
          defaultValue="1"
          sx={{ minWidth: 160 }}
        >
          <Option value="loves">Love Count</Option>
          <Option value="posted">Posted Time</Option>
          <Option value="name">Username</Option>
          <Option value="reposts">Repost Count</Option>
          <Option value="comments">Comment Count</Option>
        </Select>
        <Typography
          sx={{ alignSelf: "center" }}
          level="body-sm"
          fontWeight={700}
        >
          Operation:
        </Typography>
        <Select
          value={props.operation}
          onChange={(
            event: React.SyntheticEvent | null,
            newValue: string | null
          ) => {
            const filters: any = [...props.filters];
            filters[props.filterIndex].operation = newValue;
            // console.log(filters, props.filterIndex, props.setFilters);
            props.setFilters(filters);
            // console.log(props.filters);
          }}
          size="sm"
          defaultValue=">"
          sx={{ minWidth: 60 }}
        >
          {props.field == "name" ? (
            <>
              <Option value="==">{"=="}</Option>
              <Option value="!=">{"!="}</Option>
            </>
          ) : (
            <>
              <Option value=">">{">"}</Option>
              <Option value="<">{"<"}</Option>
              <Option value=">=">{">="}</Option>
              <Option value="<=">{"<="}</Option>
              <Option value="==">{"=="}</Option>
              <Option value="!=">{"!="}</Option>
            </>
          )}
        </Select>
        <Typography
          sx={{ alignSelf: "center" }}
          level="body-sm"
          fontWeight={700}
        >
          Value:
        </Typography>
        {props.field == "posted" ? (
          <Input
            id="filters-start-date"
            type="date"
            placeholder="Jan 6 - Jan 13"
            aria-label="Date"
            value={props.value}
            onChange={(event) => {
              const filters: any = [...props.filters];
              filters[props.filterIndex].value = event.target.value;
              // console.log(filters, props.filterIndex, props.setFilters);
              props.setFilters(filters);
              // console.log(props.filters);
            }}
          />
        ) : (
          <Input
            value={props.value}
            size="md"
            sx={{ width: "100px" }}
            onChange={(event) => {
              const filters: any = [...props.filters];
              filters[props.filterIndex].value = event.target.value;
              props.setFilters(filters);
            }}
          />
        )}
      </Stack>
      <IconButton
        onClick={(event) => {
          const filters: any = [...props.filters];
          filters.splice(props.filterIndex, 1);
          props.setFilters(filters);
        }}
        variant="plain"
      >
        <DeleteForeverOutlinedIcon />
      </IconButton>
    </Stack>
  );
}

function SortBy(props: any) {
  return (
    <Stack
      sx={{ width: "100%", justifyContent: "space-between" }}
      direction="row"
    >
      <Stack sx={{flexWrap: "wrap", rowGap: "8px"}} spacing={2} direction="row">
        <Typography
          sx={{ alignSelf: "center" }}
          level="body-sm"
          fontWeight={700}
        >
          Sort by:
        </Typography>
        <Select
          value={props.field}
          // onChange={(
          //   event: React.SyntheticEvent | null,
          //   newValue: string | null
          // ) => props.setSort(newValue)}
          onChange={(
            event: React.SyntheticEvent | null,
            newValue: string | null
          ) => {
            const sorts: any = [...props.sort];
            sorts[props.sortIndex].field = newValue;
            props.setSort(sorts);
          }}
          size="sm"
          defaultValue="asc"
          sx={{ minWidth: 160 }}
        >
          <Option value="posted">Posted Time</Option>
          <Option value="loves">Love Count</Option>
          <Option value="reposts">Repost Count</Option>
          <Option value="comments">Comment Count</Option>
        </Select>
        <Typography
          sx={{ alignSelf: "center" }}
          level="body-sm"
          fontWeight={700}
        >
          Sort direction:
        </Typography>
        <Select
          value={props.direction}
          onChange={(
            event: React.SyntheticEvent | null,
            newValue: string | null
          ) => {
            const sorts: any = [...props.sort];
            sorts[props.sortIndex].direction = newValue;
            props.setSort(sorts);
          }}
          size="sm"
          defaultValue="1"
          sx={{ minWidth: 160 }}
        >
          <Option value="asc">Ascending</Option>
          <Option value="desc">Descending</Option>
        </Select>
      </Stack>
      <IconButton
        onClick={(event) => {
          const sorts: any = [...props.sort];
          sorts.splice(props.sortIndex, 1);
          props.setSort(sorts);
        }}
        variant="plain"
      >
        <DeleteForeverOutlinedIcon />
      </IconButton>
    </Stack>
  );
}



export default function PostList(props: {
  sort: any;
  setSort: Function;
  setPage: Function;
  filters: any;
  applyFilters: Function;
  setFilters: Function;
  page: string;
  user: string;
  pagination: any;
  tab: string | number | null;
  setTab: Function;
  setSearch: Function;
  search: string;
  loaded: boolean;
  selectedPosts: any;
  selectedMedia: any;
}) {

  var parse = require("html-react-parser");



  return (
    <Box
      sx={{
        flex: 1,
        width: "100%",
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: {
            sm: -100,
            md: -110,
          },
          bgcolor: "background.body",
          zIndex: 9995,
        }}
      >
        <Box
          sx={{
            paddingTop: {
              xs: '68px',
              md: '0px',
            },
            px: {
              xs: 2,
              md: 6,
            },
          }}
        >
          <Breadcrumbs
            size="sm"
            aria-label="breadcrumbs"
            separator={<ChevronRightRoundedIcon />}
            sx={{ pl: 0 }}
          >
            <Link
              underline="none"
              color="neutral"
              href="#some-link"
              aria-label="Home"
            >
              <HomeRoundedIcon />
            </Link>
            <Link
              underline="hover"
              color="neutral"
              href="#some-link"
              fontSize={12}
              fontWeight={500}
            >
              {props.user == "any" ? "Posts" : "Users"}
            </Link>
            {props.user == "any" ? null : (
              <Typography color="primary" fontWeight={500} fontSize={12}>
                {"@" + props.user + "'s"} profile
              </Typography>
            )}
          </Breadcrumbs>
          {props.user == "any" ? (
            <Typography
              level="h2"
              sx={{
                mt: 1,
                mb: 2,
              }}
            >
              All Posts
            </Typography>
          ) : (
            <Stack direction="row" spacing={1}>
              <Typography
                level="h2"
                sx={{
                  mt: 1,
                  mb: 2,
                }}
              >
                {"@" + props.user + "'s"} profile
              </Typography>
              <Divider orientation="vertical" />
              <Link href={"https://wasteof.money/users/" + props.user}>
                <Button>View Profile on wasteof</Button>
              </Link>
            </Stack>
          )}
        </Box>
        <Tabs
          defaultValue="Posts"
          value={props.tab}
          onChange={(event, newValue) => {
            console.log(newValue);
            props.setTab(newValue);
            if (newValue == "Media") {
              console.log('media tab!!')
              props.applyFilters(props.page, "Media")
            }
          }}
          sx={{
            top: props.user=="any" ? "-4px" : '12px',
          }}
        >
          <TabList
            tabFlex={1}
            size="sm"
            sx={{
              pl: {
                xs: 0,
                md: 4,
              },
              justifyContent: "left",
              [`&& .${tabClasses.root}`]: {
                flex: "initial",
                bgcolor: "transparent",
                [`&.${tabClasses.selected}`]: {
                  fontWeight: "600",
                  "&::after": {
                    height: "2px",
                    bgcolor: "primary.500",
                  },
                },
              },
            }}
          >
            <Tab sx={{ borderRadius: "6px 6px 0 0" }} indicatorInset value="Posts">
              Posts
            </Tab>
            <Tab sx={{ borderRadius: "6px 6px 0 0" }} indicatorInset value="Media">
              Media
              <Chip color="primary" variant="solid" sx={{ marginLeft: "8px" }}>
                New!
              </Chip>
            </Tab>
            <Tab sx={{ borderRadius: "6px 6px 0 0" }} indicatorInset value="Stats">
              Statistics
              <Chip color="primary" variant="solid" sx={{ marginLeft: "8px" }}>
                Soon!
              </Chip>
            </Tab>
          </TabList>
        </Tabs>
      </Box>

      <Stack
        spacing={4}
        sx={{
          display: "flex",
          maxWidth: "800px",
          mx: "auto",
          px: {
            xs: 2,
            md: 6,
          },
          py: {
            xs: 2,
            md: 3,
          },
        }}
      >
         <Stack spacing={2}>
          {props.sort.map((sort: any, index: number) => {
            return (
              <SortBy
                key={index}
                setSort={props.setSort}
                field={sort.field}
                direction={sort.direction}
                sort={props.sort}
                sortIndex={index}
              />
            );
          })}
          <Typography level="body-sm" fontWeight={700}>
            Filter by:
          </Typography>
          {props.filters.map((filter: any, index: number) => {
            return (
              <FilterBy
                setFilters={props.setFilters}
                key={index}
                filters={props.filters}
                field={filter.field}
                operation={filter.operation}
                value={filter.value}
                filterIndex={index}
              />
            );
          })}
          <Typography level="body-sm" fontWeight={700}>
            Text Search:
          </Typography>
          <Stack spacing={1.5} direction="row">
            <FormControl sx={{ flex: 1 }}>
              <Input
                placeholder="Search"
                startDecorator={<SearchIcon />}
                value={props.search}
                onChange={(event) => {
                  props.setSearch(event.target.value);
                }}
                aria-label="Search"
              />
            </FormControl>
            <Box>
              <Button
                variant="outlined"
                color="neutral"
                onClick={(event) => {
                  props.setSearch("");
                }}
              >
                Clear
              </Button>
            </Box>
          </Stack>
          <Stack spacing={1.5} direction="row" sx={{ alignSelf: "flex-end" }}>
            <Dropdown
            // sx={{ width: "130px", alignSelf: "flex-end" }}
            >
              <MenuButton
                startDecorator={<AddOutlinedIcon />}
                // sx={{ width: "130px", alignSelf: "flex-end" }}
              >
                Add filter
              </MenuButton>
              <Menu>
                <MenuItem
                  onClick={(event) => {
                    // console.log("clicked on!!");
                    const filters: any = [...props.filters];
                    filters.push({
                      field: "loves",
                      operation: ">",
                      value: "0",
                    });
                    // console.log(filters);
                    props.setFilters(filters);
                  }}
                >
                  Filter by
                </MenuItem>
                <MenuItem
                  onClick={(event) => {
                    // console.log("clicked on!!");
                    const sorts: any = [...props.sort];
                    sorts.push({
                      field: "loves",
                      direction: "asc",
                    });
                    // console.log(sorts);
                    props.setSort(sorts);
                  }}
                >
                  Sort by
                </MenuItem>
                <ListDivider />

                <MenuItem disabled>
                  Add Calculation{" "}
                  <Chip
                    color="primary"
                    variant="solid"
                    sx={{ marginLeft: "8px" }}
                  >
                    Soon!
                  </Chip>
                </MenuItem>
              </Menu>
            </Dropdown>
            <Button
              startDecorator={<FilterAltOutlinedIcon />}
              variant="solid"
              onClick={(event) => {
                console.log(props.filters)
                props.applyFilters();
              }}
            >
              Apply Filters
            </Button>
          </Stack>
        </Stack>
        { props.tab=="Posts" ? (
          <>
        {props.selectedPosts.length == 0 && props.loaded ? (
          <EmptyState contenttype="Posts" />
        ) : props.loaded ? (
          props.selectedPosts.map((data: any) => {
            return <Post key={data["_id"]} data={data} />;
          })
        ) : (
          <>
            <LinearProgress />
          </>
        )}
        <div>
          <Box
            className="Pagination-mobile"
            sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}
          >
            <IconButton
              aria-label="previous page"
              variant="outlined"
              color="neutral"
              size="sm"
              onClick={(event) => {
                props.setPage((parseInt(props.page) - 1).toString());
                props.applyFilters((parseInt(props.page) - 1).toString());
              }}
            >
              <WestOutlinedIcon />
            </IconButton>
            <Typography level="body-sm" mx="auto">
              Page {props.page} of 10
            </Typography>
            <IconButton
              aria-label="next page"
              variant="outlined"
              color="neutral"
              size="sm"
              onClick={(event) => {
                props.setPage((parseInt(props.page) + 1).toString());
                props.applyFilters((parseInt(props.page) + 1).toString());
              }}
            >
              <EastOutlinedIcon />
            </IconButton>
          </Box>
          <Box
            className="Pagination-laptopUp"
            sx={{
              pt: 0.5,
              gap: 1,
              [`& .${iconButtonClasses.root}`]: { borderRadius: "50%" },
              display: {
                xs: "none",
                md: "flex",
              },
            }}
          >
            <Button
              size="sm"
              variant="plain"
              color="neutral"
              startDecorator={<WestOutlinedIcon />}
              onClick={(event) => {
                props.setPage((parseInt(props.page) - 1).toString());
                props.applyFilters((parseInt(props.page) - 1).toString());
              }}
            >
              Previous
            </Button>

            <Box sx={{ flex: 1 }} />
            {props.pagination.pages
              .map((x: any) => x.toString())
              .map((page: any) => (
                <IconButton
                  key={page}
                  size="sm"
                  onClick={async () => {
                    console.log(typeof page);
                    await props.setPage(page);
                    console.log("pags is equal to", props.page);
                    // console.log(props.page)
                    props.applyFilters(page);
                  }}
                  variant={props.page == page ? "solid" : "outlined"}
                  color="neutral"
                >
                  {page}
                </IconButton>
              ))}
            <Box sx={{ flex: 1 }} />

            <Button
              size="sm"
              variant="plain"
              color="neutral"
              endDecorator={<EastOutlinedIcon />}
              onClick={(event) => {
                props.setPage((parseInt(props.page) + 1).toString());
                props.applyFilters((parseInt(props.page) + 1).toString());
              }}
            >
              Next
            </Button>
          </Box>
        </div>
        </>
        ) : (
          <Stack spacing={2}>
            {props.selectedMedia.length == 0 && props.loaded ? (
          <EmptyState contenttype="Images" />
        ) : props.loaded ? (
          props.selectedMedia.map((picture: any) => {
            return (
              <div style={{position: 'relative'}} key={picture["_id"]}>
                
                  <AspectRatio sx={{ width: "100%" }}>
{
              parse(picture.imgTag)
}
              </AspectRatio>
               <Typography level="body-sm" fontWeight={700} sx={{
                  position: 'absolute',
                  zIndex: 2,
                  left: 8,
                  top: 8,
                  color: 'white',
                  textShadow: '3px 3px 3px black',
                }}>
                  {picture.imgTag.split('.')[picture.imgTag.split('.').length-2] ? picture.imgTag.split('.')[picture.imgTag.split('.').length-2].split('/')[picture.imgTag.split('.')[picture.imgTag.split('.').length-2].split('/').length-1] : ""}
                </Typography>
                <Typography level="body-sm" fontWeight={700} sx={{
                  position: 'absolute',
                  zIndex: 2,
                  left: 8,
                  bottom: 8,
                  color: 'white',
                  textShadow: '3px 3px 3px black',
                }}>
                  Posted by @{picture.poster.name} {formatTime(picture.time)}
                </Typography>
                <Link href={"https://wasteof.money/posts/" + picture["_id"]} sx={{
                  position: 'absolute',
                  zIndex: 2,
                  right: 8,
                  bottom: 8,
                  boxShadow: 'sm',
                }}>
                <Button startDecorator={<OpenInNewIcon />} variant="solid" color="primary" >View Post</Button>
                </Link>
              {/* <IconButton
      aria-label="upload new picture"
      size="sm"
      variant="outlined"
      color="neutral"
      sx={{
        bgcolor: 'background.body',
        position: 'absolute',
        zIndex: 2,
        borderRadius: '50%',
        right: 0,
        bottom: 0,
        boxShadow: 'sm',
      }}
    ><EditRoundedIcon /></IconButton> */}
              </div>
            )
          })
        ) : (
          <>
            <LinearProgress />
          </>
        )}
            <div>
          <Box
            className="Pagination-mobile"
            sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}
          >
            <IconButton
              aria-label="previous page"
              variant="outlined"
              color="neutral"
              size="sm"
              onClick={(event) => {
                props.setPage((parseInt(props.page) - 1).toString());
                props.applyFilters((parseInt(props.page) - 1).toString());
              }}
            >
              <WestOutlinedIcon />
            </IconButton>
            <Typography level="body-sm" mx="auto">
              Page {props.page} of {props.pagination.pages[props.pagination.pages.length-1]}
            </Typography>
            <IconButton
              aria-label="next page"
              variant="outlined"
              color="neutral"
              size="sm"
              onClick={(event) => {
                props.setPage((parseInt(props.page) + 1).toString());
                props.applyFilters((parseInt(props.page) + 1).toString());
              }}
            >
              <EastOutlinedIcon />
            </IconButton>
          </Box>
          <Box
            className="Pagination-laptopUp"
            sx={{
              pt: 0.5,
              gap: 1,
              [`& .${iconButtonClasses.root}`]: { borderRadius: "50%" },
              display: {
                xs: "none",
                md: "flex",
              },
            }}
          >
            <Button
              size="sm"
              variant="plain"
              color="neutral"
              startDecorator={<WestOutlinedIcon />}
              onClick={(event) => {
                props.setPage((parseInt(props.page) - 1).toString());
                props.applyFilters((parseInt(props.page) - 1).toString());
              }}
            >
              Previous
            </Button>

            <Box sx={{ flex: 1 }} />
            {props.pagination.pages
              .map((x: any) => x.toString())
              .map((page: any) => (
                <IconButton
                  key={page}
                  size="sm"
                  onClick={async () => {
                    console.log(typeof page);
                    await props.setPage(page);
                    console.log("pags is equal to", props.page);
                    // console.log(props.page)
                    props.applyFilters(page);
                  }}
                  variant={props.page == page ? "solid" : "outlined"}
                  color="neutral"
                >
                  {page}
                </IconButton>
              ))}
            <Box sx={{ flex: 1 }} />

            <Button
              size="sm"
              variant="plain"
              color="neutral"
              endDecorator={<EastOutlinedIcon />}
              onClick={(event) => {
                props.setPage((parseInt(props.page) + 1).toString());
                props.applyFilters((parseInt(props.page) + 1).toString());
              }}
            >
              Next
            </Button>
          </Box>
        </div>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
