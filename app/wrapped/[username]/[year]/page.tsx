"use client";

import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
// import 'react-calendar-heatmap/dist/styles.css';
// import CalendarHeatmap from 'react-calendar-heatmap';
import AspectRatio from "@mui/joy/AspectRatio";
import WhatshotOutlinedIcon from "@mui/icons-material/WhatshotOutlined";

import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";

import Box from "@mui/joy/Box";
// import Tooltip from "@uiw/react-tooltip";
import Tooltip from "@mui/joy/Tooltip";
import Sidebar from "../../../components/Sidebar";
import RecyclingOutlinedIcon from "@mui/icons-material/RecyclingOutlined";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import ChildCareOutlinedIcon from "@mui/icons-material/ChildCareOutlined";
import Header from "../../../components/Header";
// import Cal from '../../../components/CalHeatmap';
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardActions from "@mui/joy/CardActions";
import Button from "@mui/joy/Button";
import EmojiNatureOutlinedIcon from "@mui/icons-material/EmojiNatureOutlined";
import Typography from "@mui/joy/Typography";
import CircularProgress from "@mui/joy/CircularProgress";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import PercentIcon from "@mui/icons-material/Percent";
import Stack from "@mui/joy/Stack";
import SvgIcon from "@mui/joy/SvgIcon";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import Sheet from "@mui/joy/Sheet";
// import PostList from "../../../components/PostList";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import RedeemIcon from "@mui/icons-material/Redeem";
import HeatMap from "@uiw/react-heat-map";
import Image from "next/image";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import ElectricalServicesOutlinedIcon from "@mui/icons-material/ElectricalServicesOutlined";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import CelebrationOutlinedIcon from "@mui/icons-material/CelebrationOutlined";
import NightsStayOutlinedIcon from "@mui/icons-material/NightsStayOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import Post from "../../../components/Post";
export default function Page({
  params,
}: {
  params: { username: string; year: string };
}) {
  const [selected, setSelected] = React.useState("");
  const [datesPosted, setDatesPosted] = React.useState<any>([]);
  const [postCount, setPostCount] = React.useState<any>(0);

  const [joinedDate, setJoinedDate] = React.useState<any>([]);
  const [everloaded, seteverLoaded] = React.useState(false);
  const [postIncrease, setPostIncrease] = React.useState<any>("");
  const [followerIncrease, setFollowerIncrease] = React.useState<any>(0);
  const [followerPercent, setFollowerPercent] = React.useState<any>("");
  const [followingIncrease, setFollowingIncrease] = React.useState<any>(0);
  const [followingPercent, setFollowingPercent] = React.useState<any>("");
  const [postCountChange, setPostCountChange] = React.useState<any>("");
  const [trends, setTrends] = React.useState<any>({});
  const [repostPercent, setRepostPercent] = React.useState<any>("");
  const [repostIncrease, setRepostIncrease] = React.useState<any>("");
  const [blankRepostPercent, setBlankRepostPercent] = React.useState<any>("");
  const [blankRepostCount, setBlankRepostCount] = React.useState<any>("");
  const [postAverages, setPostAverages] = React.useState<any>({});
  const [mediaCount, setMediaCount] = React.useState<any>(0);
  const [mediaPercent, setMediaPercent] = React.useState<any>("");
  const [lovesIncrease, setLovesIncrease] = React.useState<any>("");
  const [commentsIncrease, setCommentsIncrease] = React.useState<any>("");
  const [repostsIncrease, setRepostsIncrease] = React.useState<any>("");
  const [topPosts, setTopPosts] = React.useState<any>([]);
  const [daysPercent, setDaysPercent] = React.useState<any>("");
  const [daysPercentIncrease, setDaysPercentIncrease] = React.useState<any>("");
  const [topReposted, setTopReposted] = React.useState<any>([]);
  const [topCommented, setTopCommented] = React.useState<any>([]);
  const [topWords, setTopWords] = React.useState<any>([]);
  const [topImages, setTopImages] = React.useState<any>([]);
  const [worstPosts, setWorstPosts] = React.useState<any>([]);
  var parse = require("html-react-parser");

  function fetchData() {
    console.log("fetch data");
    seteverLoaded(true);
    fetch(
      "../../../api/wrapped?user=" + params.username + "&year=" + params.year
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data.postCount.count);
        setDatesPosted(
          data.datesPosted.map((rec: any) => {
            return { date: rec._id, count: rec.count };
          })
        );
        setJoinedDate(data.joindate);
        setPostCount(data.postCount.count);
        setPostIncrease(
          Math.abs(
            Math.round((1 - data.postCount.count / data.postCount.count2) * 100)
          ).toString() +
            "% " +
            (1 - data.postCount.count / data.postCount.count2 > 0
              ? "decrease"
              : "increase")
        );
        setFollowerIncrease(
          data.joindate > new Date(params.year + "-01-01").getTime()
            ? data.stats.followers
            : data.statChanges.followerChange
        );
        setFollowingIncrease(
          data.joindate > new Date(params.year + "-01-01").getTime()
            ? data.stats.following
            : data.statChanges.followingChange
        );

        console.log(
          "follower",
          data.stats.followers,
          data.statChanges.followerChange
        );
        console.log(
          "follower percent",
          Math.round(
            Math.abs(
              (1 -
                data.stats.followers /
                  (data.stats.followers -
                    (data.joindate > new Date(params.year + "-01-01").getTime()
                      ? data.stats.followers
                      : data.statChanges.followerChange))) *
                100
            )
          ).toString() +
            "%" +
            (1 -
              data.stats.followers /
                (data.stats.followers -
                  (data.joindate > new Date(params.year + "-01-01").getTime()
                    ? data.stats.followers
                    : data.statChanges.followerChange)) >
            0
              ? "decrease"
              : "increase")
        );
        setFollowerPercent(
          Math.round(
            Math.abs(
              (1 -
                data.stats.followers /
                  (data.stats.followers -
                    (data.joindate > new Date(params.year + "-01-01").getTime()
                      ? data.stats.followers
                      : data.statChanges.followerChange))) *
                100
            )
          ).toString() +
            "% " +
            (1 -
              data.stats.followers /
                (data.stats.followers -
                  (data.joindate > new Date(params.year + "-01-01").getTime()
                    ? data.stats.followers
                    : data.statChanges.followerChange)) >
            0
              ? "decrease"
              : "increase")
        );
        setFollowingPercent(
          Math.round(
            Math.abs(
              (1 -
                data.stats.following /
                  (data.stats.following -
                    (data.joindate > new Date(params.year + "-01-01").getTime()
                      ? data.stats.following
                      : data.statChanges.followingChange))) *
                100
            )
          ).toString() +
            "% " +
            (1 -
              data.stats.following /
                (data.stats.following -
                  (data.joindate > new Date(params.year + "-01-01").getTime()
                    ? data.stats.following
                    : data.statChanges.followingChange)) >
            0
              ? "decrease"
              : "increase")
        );
        setPostCountChange(
          Math.abs(
            Math.round(
              (1 - data.datesPosted.length / data.datesPostedLastYear.length) *
                100
            )
          ).toString() +
            "% " +
            (1 - data.datesPosted.length / data.datesPostedLastYear.length > 0
              ? "decrease"
              : "increase")
        );
        setTrends(data.trends);
        setRepostPercent(
          Math.round(
            (data.postCount.repostCount / data.postCount.count) * 100
          ).toString() + "%"
        );
        setRepostIncrease(
          (
            Math.round(
              (data.postCount.repostCount / data.postCount.count) * 100
            ) -
            Math.round(
              (data.postCount.repostCount2 / data.postCount.count2) * 100
            )
          ).toString() +
            "% " +
            (Math.round(
              (data.postCount.repostCount / data.postCount.count) * 100
            ) -
              Math.round(
                (data.postCount.repostCount2 / data.postCount.count2) * 100
              ) >
            0
              ? "increase"
              : "decrease")
        );
        setBlankRepostCount(data.postCount.blankRepostCount);
        setBlankRepostPercent(
          Math.round(
            (data.postCount.blankRepostCount / data.postCount.repostCount) * 100
          ).toString() + "%"
        );
        setPostAverages(data.postAverages);
        setMediaCount(data.postCount.mediaCount);
        setMediaPercent(
          Math.round(
            (data.postCount.mediaCount / data.postCount.count) * 100
          ).toString() + "%"
        );
        // set loves count (data.postAverages.averageLoves) increase/decrease since last year (data.postAverages.averageLoves2)
        setLovesIncrease(
          (
            Math.round(
              (data.postAverages.averageLoves /
                data.postAverages.averageLoves2) *
                100
            ) - 100
          ).toString() +
            "% " +
            (Math.round(
              (data.postAverages.averageLoves /
                data.postAverages.averageLoves2) *
                100
            ) -
              100 >
            0
              ? "increase"
              : "decrease")
        );
        setCommentsIncrease(
          (
            Math.round(
              (data.postAverages.averageComments /
                data.postAverages.averageComments2) *
                100
            ) - 100
          ).toString() +
            "% " +
            (Math.round(
              (data.postAverages.averageComments /
                data.postAverages.averageComments2) *
                100
            ) -
              100 >
            0
              ? "increase"
              : "decrease")
        );
        setRepostsIncrease(
          (
            Math.round(
              (data.postAverages.averageReposts /
                data.postAverages.averageReposts2) *
                100
            ) - 100
          ).toString() +
            "% " +
            (Math.round(
              (data.postAverages.averageReposts /
                data.postAverages.averageReposts2) *
                100
            ) -
              100 >
            0
              ? "increase"
              : "decrease")
        );
        setTopPosts(data.top.topPosts);
        setWorstPosts(data.top.worstPosts);
        setDaysPercent(
          Math.round((data.datesPosted.length / 365) * 100).toString() + "%"
        );
        // compare days posted to last year
        setDaysPercentIncrease(
          (
            Math.round(
              (data.datesPosted.length / data.datesPostedLastYear.length) * 100
            ) - 100
          ).toString() +
            "% " +
            (Math.round(
              (data.datesPosted.length / data.datesPostedLastYear.length) * 100
            ) -
              100 >
            0
              ? "increase"
              : "decrease")
        );
        setTopReposted(data.top.topReposted);
        setTopCommented(data.top.topCommented);
        setTopWords(data.postContentAnalysis.topWords);
        setTopImages(data.top.topImages);
      });
  }
  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <CssVarsProvider disableTransitionOnChange>
        <CssBaseline />
        <Box sx={{ display: "flex", minHeight: "100dvh" }}>
          <Sidebar page="wrapped" user={params.username} />
          <Header />

          <Box
            component="main"
            className="MainContent"
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              height: "100dvh",
              gap: 1,
              overflowX: "hidden",
              overflowY: "auto",
            }}
          >
            <Stack sx={{ width: "100%" }}>
              <Sheet
                color="primary"
                variant="soft"
                sx={{
                  width: "100%",
                  display: "flex",
                  height: "240px",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  justifyItems: "center",
                  marginTop: {
                    xs: "65px",
                    md: "0px",
                  },
                }}
              >
                <Stack
                  sx={{
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "center",
                    justifyItems: "center",
                  }}
                >
                  <RedeemIcon
                    color="primary"
                    fontSize="large"
                    sx={{ width: "64px", height: "64px", marginRight: "16px" }}
                  />{" "}
                  <br />
                  <Typography
                    color="primary"
                    level="h1"
                    sx={{
                      display: "flex",
                      justifySelf: "center",
                      alignSelf: "center",
                    }}
                  >
                    wasteof Wrapped {params.year}
                  </Typography>
                  <Stack
                    sx={{
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "center",
                      justifyItems: "center",
                      marginTop: "24px",
                      position: "sticky",
                      top: {
                        sm: -100,
                        md: -110,
                      },
                    }}
                    direction="row"
                  >
                    <Image
                      src={`https://api.wasteof.money/users/${params.username}/picture`}
                      loading="lazy"
                      alt=""
                      width="48"
                      height="48"
                      style={{
                        marginRight: "12px",
                        borderRadius: "50%",
                      }}
                    />
                    <Typography fontSize="large" fontWeight="bold">
                      @{params.username}
                    </Typography>
                  </Stack>
                </Stack>
              </Sheet>
              <Box
                sx={{
                  px: {
                    xs: 2,
                    sm: 2,
                    md: 2,
                  },
                  pt: {
                    xs: "calc(12px + var(--Header-height))",
                    md: 3,
                  },
                  pb: {
                    xs: 2,
                    sm: 2,
                    md: 3,
                  },
                  paddingRight: "0px !important",
                }}
              >
                <Typography
                  level="h2"
                  sx={{ mb: "24px", centerSelf: "center" }}
                >
                  In {params.year}, you...
                </Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                  flexWrap={{
                    xs: "wrap",
                    sm: "wrap",
                  }}
                >
                  {joinedDate > new Date(params.year + "-01-01").getTime() ? (
                    <Card
                      sx={{ height: "160px", width: "280px", margin: "6px" }}
                      variant="outlined"
                      color="primary"
                      invertedColors
                    >
                      <CardContent orientation="horizontal">
                        <CardContent>
                          <Typography level="body-md">
                            joined wasteof.money
                          </Typography>
                          <Typography level="h2">Feb 22, 2023</Typography>
                        </CardContent>
                        <CakeOutlinedIcon />
                      </CardContent>
                    </Card>
                  ) : null}
                  {postCount > 0 ? (
                    <Card
                      sx={{ height: "160px", width: "280px", margin: "6px" }}
                      variant="solid"
                      color="primary"
                      invertedColors
                    >
                      <CardContent orientation="horizontal">
                        <CardContent>
                          <Typography level="h2">{postCount}</Typography>
                          <Typography level="body-md">created posts</Typography>
                        </CardContent>
                        <EditOutlinedIcon />
                      </CardContent>
                      <CardActions>
                        <Button variant="soft" size="sm">
                          {postIncrease.replace("Infinity", "∞")} from{" "}
                          {(parseInt(params.year) - 1).toString()}
                        </Button>
                        {/* <Button variant="solid" size="sm">
          See breakdown
        </Button> */}
                      </CardActions>
                    </Card>
                  ) : null}
                  {followerIncrease > 0 ? (
                    <Card
                      sx={{ height: "160px", width: "280px", margin: "6px" }}
                      variant="solid"
                      color="primary"
                      invertedColors
                    >
                      <CardContent orientation="horizontal">
                        <CardContent>
                          <Typography level="h2">{followerIncrease}</Typography>
                          <Typography level="body-md">
                            {followerIncrease > 0 ? "gained" : "lost"} followers
                          </Typography>
                        </CardContent>
                        <PersonAddAltOutlinedIcon />
                      </CardContent>
                      <CardActions>
                        <Button variant="soft" size="sm">
                          {followerPercent.replace("Infinity", "∞")} from{" "}
                          {(parseInt(params.year) - 1).toString()}
                        </Button>
                        {/* <Button variant="solid" size="sm">
          See breakdown
        </Button> */}
                      </CardActions>
                    </Card>
                  ) : null}
                  {followingIncrease > 0 ? (
                    <Card
                      sx={{ height: "160px", width: "280px", margin: "6px" }}
                      variant="solid"
                      color="primary"
                      invertedColors
                    >
                      <CardContent orientation="horizontal">
                        <CardContent>
                          <Typography level="h2">
                            {followingIncrease}
                          </Typography>
                          <Typography level="body-md">
                            {followingIncrease > 0 ? "followed" : "unfollowed"}{" "}
                            users
                          </Typography>
                        </CardContent>
                        <GroupOutlinedIcon />
                      </CardContent>
                      <CardActions>
                        <Button variant="soft" size="sm">
                          {followingPercent.replace("Infinity", "∞")} from{" "}
                          {(parseInt(params.year) - 1).toString()}
                        </Button>
                        {/* <Button variant="solid" size="sm">
          See breakdown
        </Button> */}
                      </CardActions>
                    </Card>
                  ) : null}
                  {datesPosted != null &&
                  datesPosted != undefined &&
                  datesPosted.length > 0 ? (
                    <Card
                      sx={{ height: "160px", width: "280px", margin: "6px" }}
                      variant="solid"
                      color="primary"
                      invertedColors
                    >
                      <CardContent orientation="horizontal">
                        <CardContent>
                          <Typography level="h2">
                            {datesPosted.length}
                          </Typography>
                          <Typography level="body-md">days posted</Typography>
                        </CardContent>
                        <TodayOutlinedIcon />
                      </CardContent>
                      <CardActions>
                        <Button variant="soft" size="sm">
                          {postCountChange.replace("Infinity", "∞")} from{" "}
                          {(parseInt(params.year) - 1).toString()}
                        </Button>
                        {/* <Button variant="solid" size="sm">
          See breakdown
        </Button> */}
                      </CardActions>
                    </Card>
                  ) : null}
                  {(
                    trends.ratioList
                      ? trends.ratioList.filter((l: any) => {
                          return l;
                        }).length > 0
                      : false
                  ) ? (
                    <Card
                      sx={{ height: "160px", width: "280px", margin: "6px" }}
                      variant="soft"
                      color="primary"
                      invertedColors
                    >
                      <CardContent orientation="horizontal">
                        <CardContent>
                          <Typography level="body-md">
                            successfully ratio{"'"}d
                          </Typography>

                          <Typography level="h2">
                            {
                              trends.ratioList.filter((l: any) => {
                                return l;
                              }).length
                            }{" "}
                            time
                            {trends.ratioList.filter((l: any) => {
                              return l;
                            }).length > 1
                              ? "s"
                              : ""}
                          </Typography>
                        </CardContent>
                        <PercentIcon />
                      </CardContent>
                    </Card>
                  ) : null}
                  {(
                    trends.ratioList
                      ? trends.ratioList.filter((l: any) => {
                          return !l;
                        }).length > 0
                      : false
                  ) ? (
                    <Card
                      sx={{ height: "160px", width: "280px", margin: "6px" }}
                      variant="soft"
                      color="primary"
                      invertedColors
                    >
                      <CardContent orientation="horizontal">
                        <CardContent>
                          <Typography level="body-md">
                            unsuccessfully ratio{"'"}d
                          </Typography>

                          <Typography level="h2">
                            {
                              trends.ratioList.filter((l: any) => {
                                return !l;
                              }).length
                            }{" "}
                            time
                            {trends.ratioList.filter((l: any) => {
                              return !l;
                            }).length > 1
                              ? "s"
                              : ""}
                          </Typography>
                        </CardContent>
                        <PercentIcon />
                      </CardContent>
                    </Card>
                  ) : null}
                  {(
                    trends.ratiodList
                      ? trends.ratiodList.filter((l: any) => {
                          return l;
                        }).length > 0
                      : false
                  ) ? (
                    <Card
                      sx={{ height: "160px", width: "280px", margin: "6px" }}
                      variant="soft"
                      color="primary"
                      invertedColors
                    >
                      <CardContent orientation="horizontal">
                        <CardContent>
                          <Typography level="body-md">
                            been successfully ratio{"'"}d
                          </Typography>

                          <Typography level="h2">
                            {
                              trends.ratiodList.filter((l: any) => {
                                return l;
                              }).length
                            }{" "}
                            time
                            {trends.ratiodList.filter((l: any) => {
                              return l;
                            }).length > 1
                              ? "s"
                              : ""}
                          </Typography>
                        </CardContent>
                        <PercentIcon />
                      </CardContent>
                    </Card>
                  ) : null}
                  {(
                    trends.ratiodList
                      ? trends.ratiodList.filter((l: any) => {
                          return !l;
                        }).length > 0
                      : false
                  ) ? (
                    <Card
                      sx={{ height: "160px", width: "280px", margin: "6px" }}
                      variant="soft"
                      color="primary"
                      invertedColors
                    >
                      <CardContent orientation="horizontal">
                        <CardContent>
                          <Typography level="body-md">
                            been unsuccessfully ratio{"'"}d
                          </Typography>

                          <Typography level="h2">
                            {
                              trends.ratiodList.filter((l: any) => {
                                return !l;
                              }).length
                            }{" "}
                            time
                            {trends.ratiodList.filter((l: any) => {
                              return !l;
                            }).length > 1
                              ? "s"
                              : ""}
                          </Typography>
                        </CardContent>
                        <PercentIcon />
                      </CardContent>
                    </Card>
                  ) : null}
                  {trends.rawBees ? (
                    <Card
                      sx={{ height: "160px", width: "280px", margin: "6px" }}
                      variant="outlined"
                      color="primary"
                      invertedColors
                    >
                      <CardContent orientation="horizontal">
                        <CardContent>
                          <Typography level="h3" fontWeight="bold">
                            showed your love for raw bees
                          </Typography>
                        </CardContent>
                        <EmojiNatureOutlinedIcon />
                      </CardContent>
                      <CardActions>
                        {/* <Button variant="solid" size="sm">
          See breakdown
        </Button> */}
                      </CardActions>
                    </Card>
                  ) : null}
                  {trends.kidsAreMore ? (
                    <Card
                      sx={{ height: "160px", width: "280px", margin: "6px" }}
                      variant="outlined"
                      color="primary"
                      invertedColors
                    >
                      <CardContent orientation="horizontal">
                        <CardContent>
                          <Typography level="h3" fontWeight="bold">
                            discussed how kids are more accepting than adults
                          </Typography>
                        </CardContent>
                        <ChildCareOutlinedIcon />
                      </CardContent>
                    </Card>
                  ) : null}
                  {trends["8443"] ? (
                    <Card
                      sx={{ height: "160px", width: "280px", margin: "6px" }}
                      variant="outlined"
                      color="primary"
                      invertedColors
                    >
                      <CardContent orientation="horizontal">
                        <CardContent>
                          <Typography level="h3" fontWeight="bold">
                            saw the rise and fall of :8443
                          </Typography>
                        </CardContent>
                        <ElectricalServicesOutlinedIcon />
                      </CardContent>
                      <CardActions>
                        {/* <Button variant="solid" size="sm">
          See breakdown
        </Button> */}
                      </CardActions>
                    </Card>
                  ) : null}
                  {trends.twoyear ? (
                    <Card
                      sx={{ height: "160px", width: "280px", margin: "6px" }}
                      variant="outlined"
                      color="primary"
                      invertedColors
                    >
                      <CardContent orientation="horizontal">
                        <CardContent>
                          <Typography level="h3" fontWeight="bold">
                            saw wasteof2{"'"}s second birthday
                          </Typography>
                        </CardContent>
                        <CelebrationOutlinedIcon />
                      </CardContent>
                      <CardActions>
                        {/* <Button variant="solid" size="sm">
          See breakdown
        </Button> */}
                      </CardActions>
                    </Card>
                  ) : null}
                  {trends.nightyMorning > 0 ? (
                    <Card
                      sx={{ height: "160px", width: "280px", margin: "6px" }}
                      variant="soft"
                      color="primary"
                      invertedColors
                    >
                      <CardContent orientation="horizontal">
                        <CardContent>
                          <Typography level="body-md">
                            said nighty morning
                          </Typography>

                          <Typography level="h2">
                            {trends.nightyMorning} time
                            {trends.nightyMorning > 1 ? "s" : ""}
                          </Typography>
                        </CardContent>
                        <NightsStayOutlinedIcon />
                      </CardContent>
                    </Card>
                  ) : null}
                  {trends.mathClass > 0 ? (
                    <Card
                      sx={{ height: "160px", width: "280px", margin: "6px" }}
                      variant="soft"
                      color="primary"
                      invertedColors
                    >
                      <CardContent orientation="horizontal">
                        <CardContent>
                          <Typography level="body-md">
                            reposted dertermenter{"'"}s math class story 💀
                          </Typography>

                          <Typography level="h2">
                            {trends.mathClass} time
                            {trends.mathClass > 1 ? "s" : ""}
                          </Typography>
                        </CardContent>
                        <CalculateOutlinedIcon />
                      </CardContent>
                    </Card>
                  ) : null}
                  {trends.elonMusk > 0 ? (
                    <Card
                      sx={{ height: "160px", width: "280px", margin: "6px" }}
                      variant="soft"
                      color="primary"
                      invertedColors
                    >
                      <CardContent orientation="horizontal">
                        <CardContent>
                          <Typography level="body-md">
                            mentioned Elon Musk
                          </Typography>

                          <Typography level="h2">
                            {trends.elonMusk} time
                            {trends.elonMusk > 1 ? "s" : ""}
                          </Typography>
                        </CardContent>
                        <RocketLaunchOutlinedIcon />
                      </CardContent>
                    </Card>
                  ) : null}
                  {trends.hottake > 0 ? (
                    <Card
                      sx={{ height: "160px", width: "280px", margin: "6px" }}
                      variant="soft"
                      color="primary"
                      invertedColors
                    >
                      <CardContent orientation="horizontal">
                        <CardContent>
                          <Typography level="body-md">
                            shared hot takes
                          </Typography>

                          <Typography level="h2">
                            {trends.hottake} time{trends.hottake > 1 ? "s" : ""}
                          </Typography>
                        </CardContent>
                        <WhatshotOutlinedIcon />
                      </CardContent>
                    </Card>
                  ) : null}
                  {trends.immark_v2 > 0 ? (
                    <Card
                      sx={{ height: "160px", width: "280px", margin: "6px" }}
                      variant="soft"
                      color="primary"
                      invertedColors
                    >
                      <CardContent orientation="horizontal">
                        <CardContent>
                          <Typography level="body-md">
                            reposted immark_v2
                          </Typography>

                          <Typography level="h2">
                            {trends.immark_v2} time
                            {trends.immark_v2 > 1 ? "s" : ""}
                          </Typography>
                        </CardContent>
                        <InsertEmoticonIcon />
                      </CardContent>
                    </Card>
                  ) : null}
                  {blankRepostCount > 0 ? (
                    <Card
                      sx={{ height: "160px", width: "280px", margin: "6px" }}
                      variant="soft"
                      color="primary"
                      invertedColors
                    >
                      <CardContent orientation="horizontal">
                        <CardContent>
                          <Typography level="body-md">
                            posted blank reposts
                          </Typography>

                          <Typography level="h2">
                            {blankRepostCount} time
                            {blankRepostCount > 1 ? "s" : ""}
                          </Typography>
                        </CardContent>
                        <ForumOutlinedIcon />
                      </CardContent>
                    </Card>
                  ) : null}
                  {mediaCount > 0 ? (
                    <Card
                      sx={{ height: "160px", width: "280px", margin: "6px" }}
                      variant="soft"
                      color="primary"
                      invertedColors
                    >
                      <CardContent orientation="horizontal">
                        <CardContent>
                          <Typography level="body-md">posted images</Typography>

                          <Typography level="h2">
                            {mediaCount} time{mediaCount > 1 ? "s" : ""}
                          </Typography>
                        </CardContent>
                        <ForumOutlinedIcon />
                      </CardContent>
                    </Card>
                  ) : null}
                </Stack>
                <Typography
                  level="h2"
                  sx={{ mb: "24px", mt: "12px", centerSelf: "center" }}
                >
                  Of your posts,
                </Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                  flexWrap={{
                    xs: "wrap",
                    sm: "wrap",
                  }}
                >
                  {repostPercent ? (
                    <Card
                      sx={{ height: "160px", width: "280px", margin: "6px" }}
                      variant="soft"
                      color="primary"
                      invertedColors
                    >
                      <CardContent orientation="horizontal">
                        <CardContent>
                          <Typography level="h2">{repostPercent}</Typography>
                          <Typography level="body-md">were reposts</Typography>
                        </CardContent>
                        <CircularProgress
                          size="lg"
                          determinate
                          value={parseInt(
                            repostPercent
                              .replace("%", "")
                              .replace("Infinity", "0")
                          )}
                        >
                          <RecyclingOutlinedIcon />
                        </CircularProgress>
                      </CardContent>
                      <CardActions>
                        <Button variant="soft" size="sm">
                          {repostIncrease.replace("Infinity", "∞")} from{" "}
                          {(parseInt(params.year) - 1).toString()}
                        </Button>
                        {/* <Button variant="solid" size="sm">
          See breakdown
        </Button> */}
                      </CardActions>
                    </Card>
                  ) : null}

                  {postAverages.averageLoves ? (
                    <Card
                      sx={{ height: "160px", width: "280px", margin: "6px" }}
                      variant="solid"
                      color="primary"
                      invertedColors
                    >
                      <CardContent orientation="horizontal">
                        <CardContent>
                          <Typography level="h2">
                            {Math.round(postAverages.averageLoves * 100) / 100}
                          </Typography>
                          <Typography level="body-md">average loves</Typography>
                        </CardContent>
                        <FavoriteBorderOutlinedIcon />
                      </CardContent>
                      <CardActions>
                        <Button variant="soft" size="sm">
                          {lovesIncrease.replace("Infinity", "∞")} from{" "}
                          {(parseInt(params.year) - 1).toString()}
                        </Button>
                        {/* <Button variant="solid" size="sm">
          See breakdown
        </Button> */}
                      </CardActions>
                    </Card>
                  ) : null}
                  {postAverages.averageComments ? (
                    <Card
                      sx={{ height: "160px", width: "280px", margin: "6px" }}
                      variant="solid"
                      color="primary"
                      invertedColors
                    >
                      <CardContent orientation="horizontal">
                        <CardContent>
                          <Typography level="h2">
                            {Math.round(postAverages.averageComments * 100) /
                              100}
                          </Typography>
                          <Typography level="body-md">
                            average comments
                          </Typography>
                        </CardContent>
                        <CommentOutlinedIcon />
                      </CardContent>
                      <CardActions>
                        <Button variant="soft" size="sm">
                          {commentsIncrease.replace("Infinity", "∞")} from{" "}
                          {(parseInt(params.year) - 1).toString()}
                        </Button>
                        {/* <Button variant="solid" size="sm">
          See breakdown
        </Button> */}
                      </CardActions>
                    </Card>
                  ) : null}
                  {postAverages.averageReposts ? (
                    <Card
                      sx={{ height: "160px", width: "280px", margin: "6px" }}
                      variant="solid"
                      color="primary"
                      invertedColors
                    >
                      <CardContent orientation="horizontal">
                        <CardContent>
                          <Typography level="h2">
                            {Math.round(postAverages.averageReposts * 100) /
                              100}
                          </Typography>
                          <Typography level="body-md">
                            average reposts
                          </Typography>
                        </CardContent>
                        <RecyclingOutlinedIcon />
                      </CardContent>
                      <CardActions>
                        <Button variant="soft" size="sm">
                          {repostsIncrease.replace("Infinity", "∞")} from{" "}
                          {(parseInt(params.year) - 1).toString()}
                        </Button>
                        {/* <Button variant="solid" size="sm">
          See breakdown
        </Button> */}
                      </CardActions>
                    </Card>
                  ) : null}
                  {blankRepostPercent ? (
                    <Card
                      sx={{ height: "160px", width: "280px", margin: "6px" }}
                      variant="soft"
                      color="primary"
                      invertedColors
                    >
                      <CardContent orientation="horizontal">
                        <CardContent>
                          <Typography level="h2">
                            {blankRepostPercent}
                          </Typography>
                          <Typography level="body-md">
                            of your reposts were blank
                          </Typography>
                        </CardContent>
                        <CircularProgress
                          size="lg"
                          determinate
                          value={parseInt(
                            blankRepostPercent
                              .replace("%", "")
                              .replace("Infinity", "0")
                          )}
                        >
                          <ForumOutlinedIcon />
                        </CircularProgress>
                      </CardContent>
                    </Card>
                  ) : null}
                  {mediaPercent ? (
                    <Card
                      sx={{ height: "160px", width: "280px", margin: "6px" }}
                      variant="soft"
                      color="primary"
                      invertedColors
                    >
                      <CardContent orientation="horizontal">
                        <CardContent>
                          <Typography level="h2">{mediaPercent}</Typography>
                          <Typography level="body-md">
                            of your posts had images
                          </Typography>
                        </CardContent>
                        <CircularProgress
                          size="lg"
                          determinate
                          value={parseInt(
                            mediaPercent
                              .replace("%", "")
                              .replace("Infinity", "0")
                          )}
                        >
                          <ForumOutlinedIcon />
                        </CircularProgress>
                      </CardContent>
                    </Card>
                  ) : null}
                </Stack>
                <Typography
                  level="h2"
                  sx={{ mb: "24px", mt: "18px", centerSelf: "center" }}
                >
                  Some of your posts got a lot of love...
                </Typography>
                <Stack
                  direction="row"
                  justifyContent="left"
                  spacing={3}
                  sx={{ width: "100%", pl: "12px" }}
                  flexWrap={{
                    xs: "wrap",
                    sm: "wrap",
                    md: "wrap",
                  }}
                >
                  <Stack
                    spacing={1}
                    sx={{ width: "45%", minWidth: "360px" }}
                    flexWrap={{
                      xs: "wrap",
                      sm: "wrap",
                    }}
                  >
                    <Typography
                      level="h3"
                      fontWeight="bold"
                      sx={{ marginBottom: "12px !important" }}
                    >
                      Most-Loved Posts:
                    </Typography>

                    {topPosts.map((data: any) => {
                      return (
                        <Post key={data["_id"]} data={data} wrapped={true} />
                      );
                    })}
                  </Stack>
                  <Stack
                    spacing={1}
                    sx={{
                      width: "45%",
                      minWidth: "360px",
                      mt: { xs: "12px !important", sm: "0px !important" },
                      marginLeft: {
                        xs: "0px !important",
                        sm: "24px !important",
                      },
                    }}
                    flexWrap={{
                      xs: "wrap",
                      sm: "wrap",
                    }}
                  >
                    <Typography
                      level="h3"
                      fontWeight="bold"
                      sx={{ marginBottom: "12px !important" }}
                    >
                      Most-Reposted Posts:
                    </Typography>

                    {topReposted.map((data: any) => {
                      return <Post key={data["_id"]} data={data} />;
                    })}
                  </Stack>
                </Stack>
                <Typography
                  level="h2"
                  sx={{ mb: "24px", centerSelf: "center", mt: "18px" }}
                >
                  ...and some got less
                </Typography>
                {/* Split View */}
                <Stack
                  direction="row"
                  justifyContent="center"
                  spacing={3}
                  sx={{ width: "100%" }}
                  flexWrap={{
                    xs: "wrap",
                    sm: "wrap",
                    md: "wrap",
                  }}
                >
                  <Stack
                    spacing={1}
                    flexWrap={{
                      xs: "wrap",
                      sm: "wrap",
                    }}
                  >
                    <Typography
                      level="h3"
                      fontWeight="bold"
                      sx={{ marginBottom: "12px !important" }}
                    >
                      Least-Loved Posts:
                    </Typography>
                    <Stack
                      spacing={{ xs: 0, sm: 3 }}
                      flexWrap="wrap"
                      direction="row"
                    >
                      {worstPosts.map((data: any) => {
                        return (
                          <div
                            key={data["_id"]}
                            style={{ maxWidth: "420px", flexShrink: "5" }}
                          >
                            <Post data={data} />
                          </div>
                        );
                      })}
                    </Stack>
                  </Stack>
                </Stack>

                <Typography
                  level="h2"
                  sx={{ mb: "24px", mt: "48px", centerSelf: "center" }}
                >
                  Your posts were very interesting...
                </Typography>
                <Stack direction="row" flexWrap="wrap" spacing={4}>
                  <Stack
                    spacing={1}
                    sx={{ width: "45%", minWidth: "360px" }}
                    flexWrap={{
                      xs: "wrap",
                      sm: "wrap",
                    }}
                  >
                    <Typography
                      level="h3"
                      fontWeight="bold"
                      sx={{ marginBottom: "12px !important" }}
                    >
                      Most-Used Words:
                    </Typography>
                    <Stack
                      direction="column"
                      alignItems="left"
                      flexWrap="wrap"
                      sx={{
                        maxHeight: {
                          xl: "540px",
                          lg: "760px",
                          md: "760px",
                          sm: "660px",
                        },
                        width: "100%",
                      }}
                      useFlexGap
                    >
                      {/* <Stack spacing={1} sx={{ width: "45%", minWidth: "360px", maxHeight: "200px" }} flexWrap={{
                  xs: "wrap",
                  sm: "wrap",
                  md: "wrap",
                  lg: "wrap",
                  xl: "wrap"
                }}> */}
                      {/* <List aria-labelledby="decorated-list-demo"> */}
                      {topWords.map((data: any, index: any) => {
                        return (
                          <ListItem
                            sx={{ py: "8px", my: "8px" }}
                            key={data["_id"]}
                          >
                            <ListItemDecorator
                              sx={{ fontWeight: "bold", mr: "4px" }}
                            >
                              {(index == 0
                                ? "🥇"
                                : index == 1
                                ? "🥈"
                                : index == 2
                                ? "🥉"
                                : "🏆") +
                                " #" +
                                (index + 1).toString() +
                                " - "}
                            </ListItemDecorator>{" "}
                            {data["_id"]} ({data["count"]})
                          </ListItem>
                        );
                      })}
                      {/* </List> */}
                      {/* </Stack> */}
                    </Stack>
                  </Stack>
                  <Stack
                    spacing={1}
                    sx={{ width: "50%", minWidth: "360px" }}
                    flexWrap={{
                      xs: "wrap",
                      sm: "wrap",
                    }}
                  >
                    <Typography
                      level="h3"
                      fontWeight="bold"
                      sx={{ marginBottom: "12px !important" }}
                    >
                      Most-Loved Images:
                    </Typography>
                    <Stack
                      direction="row"
                      flexWrap="wrap"
                      sx={{ width: "100%" }}
                      spacing={2}
                      useFlexGap
                    >
                      {topImages.map((data: any, index: any) => {
                        return (
                          <div style={{}} key={data["_id"]}>
                            <AspectRatio sx={{ width: "275px" }}>
                              {parse(data.imgTag)}
                            </AspectRatio>
                            <Stack
                              sx={{ mt: "8px" }}
                              direction="row"
                              spacing={2}
                            >
                              <Typography fontWeight="bold">
                                {index == 0
                                  ? "🥇"
                                  : index == 1
                                  ? "🥈"
                                  : index == 2
                                  ? "🥉"
                                  : "🏆"}{" "}
                                #{index + 1} - {data.loves} loves
                              </Typography>
                              <Button>Open on wasteof</Button>
                            </Stack>
                          </div>
                        );
                      })}
                    </Stack>
                  </Stack>
                </Stack>
                <Typography
                  level="h2"
                  sx={{ mb: "24px", mt: "12px", centerSelf: "center" }}
                >
                  Your posts throughout the year:
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
                  {/* <Cal /> */}
                  <HeatMap
                    value={datesPosted}
                    width={720}
                    panelColors={{
                      // 0: '#f4decd',
                      2: "#93abe4",
                      4: "#6184d4",
                      10: "#3a63c2",
                      20: "#0034ad",
                      30: "#000",
                    }}
                    weekLabels={["", "Mon", "", "Wed", "", "Fri", ""]}
                    monthLabels={[
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ]}
                    startDate={new Date("2023/01/02")}
                    endDate={new Date("2023/12/31")}
                    rectRender={(props, data) => {
                      // if (!data.count) return <rect {...props} />;
                      if (selected !== "") {
                        props.opacity = data.date === selected ? 1 : 0.45;
                      }

                      return (
                        <Tooltip
                          placement="top"
                          title={`${data.count || 0} post${
                            (data.count || 0) > 1 ? "s" : ""
                          } on ${data.date || 0}`}
                          arrow={true}
                        >
                          <rect
                            {...props}
                            onClick={() => {
                              setSelected(
                                data.date === selected ? "" : data.date
                              );
                            }}
                          />
                        </Tooltip>
                      );
                    }}
                  />
                  {daysPercent ? (
                    <Card
                      sx={{ height: "160px", width: "280px", margin: "6px" }}
                      variant="soft"
                      color="primary"
                      invertedColors
                    >
                      <CardContent orientation="horizontal">
                        <CardContent>
                          <Typography level="h2">{daysPercent}</Typography>
                          <Typography level="body-md">days posted</Typography>
                        </CardContent>
                        <CircularProgress
                          size="lg"
                          determinate
                          value={parseInt(
                            daysPercent
                              .replace("%", "")
                              .replace("Infinity", "0")
                          )}
                        >
                          <ForumOutlinedIcon />
                        </CircularProgress>
                      </CardContent>
                      <CardActions>
                        <Button variant="soft" size="sm">
                          {daysPercentIncrease.replace("Infinity", "∞")} from{" "}
                          {(parseInt(params.year) - 1).toString()}
                        </Button>
                      </CardActions>
                    </Card>
                  ) : null}
                </Stack>
                {/* <Demo /> */}
                {/* <CalendarHeatmap
  startDate={new Date('2023-01-01')}
  endDate={new Date('2023-12-31')}
  tooltipDataAttrs={(value: any) => { return { 'data-tooltip': 'Tooltip: ' + value } }}
  showWeekdayLabels={true}
  values={[
    { date: '2023-01-01', count: 12 },
    { date: '2023-01-22', count: 122 },
    { date: '2023-01-30', count: 38 },
    // ...and so on
  ]}
/> */}
                {/* <PostList
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
              selectedMedia={neededMedia}
              tab={tab}
              setTab={setTab}
              loaded={loaded}
              user={params.username}
            /> */}
              </Box>
            </Stack>
          </Box>
        </Box>
      </CssVarsProvider>
    </>
  );
}
