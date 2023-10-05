import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import { iconButtonClasses } from "@mui/joy/IconButton";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

import SearchIcon from "@mui/icons-material/Search";

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
import CircularProgress from "@mui/joy/CircularProgress";

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
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";

import "./post.module.css";
function formatTime(timeCreated: any) {
  var diff = Math.floor((Date.now() - timeCreated) / 1000);
  var interval = Math.floor(diff / 31536000);

  if (interval >= 1) {
    return interval + " years ago";
  }
  interval = Math.floor(diff / 2592000);
  if (interval >= 1) {
    return interval + " months ago";
  }
  interval = Math.floor(diff / 604800);
  if (interval >= 1) {
    return interval + " weeks ago";
  }
  interval = Math.floor(diff / 86400);
  if (interval >= 1) {
    return interval + " days ago";
  }
  interval = Math.floor(diff / 3600);
  if (interval >= 1) {
    return interval + " hours ago";
  }
  interval = Math.floor(diff / 60);
  if (interval >= 1) {
    return interval + " minutes ago";
  }
  return "Just now";
}

function FilterBy(props: any) {
  return (
    <Stack
      sx={{ width: "100%", justifyContent: "space-between" }}
      direction="row"
    >
      <Stack spacing={2} direction="row">
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
            console.log(filters, props.filterIndex, props.setFilters);
            props.setFilters(filters);
            console.log(props.filters);
          }}
          size="sm"
          defaultValue=">"
          sx={{ minWidth: 60 }}
        >
          <Option value=">">{">"}</Option>
          <Option value="<">{"<"}</Option>
          <Option value=">=">{">="}</Option>
          <Option value="<=">{"<="}</Option>
          <Option value="==">{"=="}</Option>
          <Option value="!=">{"!="}</Option>
        </Select>
        <Typography
          sx={{ alignSelf: "center" }}
          level="body-sm"
          fontWeight={700}
        >
          Value:
        </Typography>
        <Input
          value={props.value}
          size="md"
          sx={{ width: "100px" }}
          onChange={(event) => {
            const filters: any = [...props.filters];
            filters[props.filterIndex].value = event.target.value;
            props.setFilters(filters);
          }}
          placeholder="Small"
        />
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
      <Stack spacing={2} direction="row">
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
          <Option value="time">Posted Time</Option>
          <Option value="loves">Love Count</Option>

          <Option value="edit">Last Edit Time</Option>
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

function Post(props: { data: any }) {
  var parse = require("html-react-parser");

  return (
    <Card>
      <Box sx={{ mb: 1 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ display: { xs: "none", md: "flex" }, my: 1 }}
        >
          <Stack direction="column" spacing={1}>
            <AspectRatio
              ratio="1"
              maxHeight={48}
              sx={{ flex: 1, minWidth: 48, borderRadius: "100%" }}
            >
              <img
                src={`https://api.wasteof.money/users/${props.data.poster.name}/picture`}
                srcSet={`https://api.wasteof.money/users/${props.data.poster.name}/picture`}
                loading="lazy"
                alt=""
              />
            </AspectRatio>
          </Stack>
          <Stack direction="column" spacing={0}>
            <Typography level="title-md">@{props.data.poster.name}</Typography>
            <Typography level="body-sm">
              Customize how your profile information will apper to the networks.
            </Typography>
          </Stack>
        </Stack>
      </Box>
      <Divider />
      {parse(props.data.content)}
      {props.data.repost ? <Post data={props.data.repost} /> : null}
      {/* {JSON.stringify(props.data)} */}
      <CardOverflow sx={{ borderTop: "1px solid", borderColor: "divider" }}>
        <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
          <Stack spacing={3} direction="row">
            <Typography startDecorator={<FavoriteBorderIcon />}>
              {props.data.loves}
            </Typography>
            <Typography
              startDecorator={<LoopIcon />}
              display={{
                xs: "none",
                md: "flex",
              }}
            >
              {props.data.reposts}
            </Typography>
            <Typography
              startDecorator={<ChatBubbleOutlineOutlinedIcon />}
              display={{
                xs: "none",
                md: "flex",
              }}
            >
              {props.data.comments}
            </Typography>
            <Typography
              startDecorator={<EditNoteOutlinedIcon />}
              display={{
                xs: "none",
                md: "flex",
              }}
            >
              {props.data.revisions.length}
            </Typography>
            <Typography
              startDecorator={<QueryBuilderOutlinedIcon />}
              display={{
                xs: "none",
                md: "flex",
              }}
            >
              {/* {props.data.time} */}
              {formatTime(props.data.time)}
            </Typography>
          </Stack>
        </CardActions>
      </CardOverflow>
    </Card>
  );
}

export default function MyProfile(props: {
  sort: any;
  setSort: Function;
  setPage: Function;
  filters: any;
  applyFilters: Function;
  setFilters: Function;
  page: string;
  user: string;
  pagination: any;
  setSearch: Function;
  search: string;
  loaded: boolean;
  selectedPosts: any;
}) {
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
              Users
            </Link>
            <Typography color="primary" fontWeight={500} fontSize={12}>
              {"@" + props.user + "'s"} profile
            </Typography>
          </Breadcrumbs>
          <Typography
            level="h2"
            sx={{
              mt: 1,
              mb: 2,
            }}
          >
            {"@" + props.user + "'s"} profile
          </Typography>
        </Box>
        <Tabs
          defaultValue={0}
          sx={{
            bgcolor: "transparent",
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
            <Tab sx={{ borderRadius: "6px 6px 0 0" }} indicatorInset value={0}>
              Posts
            </Tab>
            <Tab sx={{ borderRadius: "6px 6px 0 0" }} indicatorInset value={1}>
              Media
            </Tab>
            <Tab sx={{ borderRadius: "6px 6px 0 0" }} indicatorInset value={2}>
              Stats
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
                props.setSearch(event.target.value)
              }}
              aria-label="Search"
            />
          </FormControl>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Button variant="outlined" color="neutral">
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
                    console.log("clicked on!!");
                    const filters: any = [...props.filters];
                    filters.push({
                      field: "loves",
                      operation: ">",
                      value: "0",
                    });
                    console.log(filters);
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
                    direction: "asc"
                  });
                  console.log(sorts);
                  props.setSort(sorts);
                }}>Sort by</MenuItem>
                <ListDivider />

                <MenuItem>Add Calculation</MenuItem>
              </Menu>
            </Dropdown>
            <Button
              startDecorator={<FilterAltOutlinedIcon />}
              variant="solid"
              onClick={(event) => {
                props.applyFilters();
              }}
            >
              Apply Filters
            </Button>
          </Stack>
        </Stack>
        

        {props.selectedPosts.length == 0 && props.loaded ? (
          <EmptyState />
        ) : props.loaded ? (
          props.selectedPosts.map((data: any) => {
            return <Post key={data["_id"]} data={data} />;
          })
        ) : (
          <CircularProgress sx={{justifySelf: 'center', alignSelf: 'center'}} />
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
            >
              <i data-feather="arrow-left" />
            </IconButton>
            <Typography level="body-sm" mx="auto">
              Page 1 of 10
            </Typography>
            <IconButton
              aria-label="next page"
              variant="outlined"
              color="neutral"
              size="sm"
            >
              <i data-feather="arrow-right" />
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
              startDecorator={<i data-feather="arrow-left" />}
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
                  onClick={() => {
                    props.setPage(parseInt(page));
                    props.applyFilters();
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
              endDecorator={<i data-feather="arrow-right" />}
            >
              Next
            </Button>
          </Box>
        </div>
      </Stack>
    </Box>
  );
}
