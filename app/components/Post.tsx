import React from "react";
import Card from "@mui/joy/Card";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import CardActions from "@mui/joy/CardActions";
import CardOverflow from "@mui/joy/CardOverflow";
import Divider from "@mui/joy/Divider";
import AspectRatio from "@mui/joy/AspectRatio";
import Image from "next/image";
import Link from "@mui/joy/Link";
import Button from "@mui/joy/Button";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LoopIcon from "@mui/icons-material/Loop";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import QueryBuilderOutlinedIcon from "@mui/icons-material/QueryBuilderOutlined";
import styles from "./post.module.css";
import formatTime from "../utils/formatTime";

export default function Post(props: {
  data: any;
  level?: number;
  wrapped?: boolean;
  showChildren?: boolean;
}) {
  var parse = require("html-react-parser");
  const [showChildren, setShowChildren] = React.useState(
    props.showChildren || false
  );

  return (
    <Card sx={{ maxWidth: "100%" }}>
      <Box sx={{ mb: 1 }}>
        <Stack direction="row" spacing={2} sx={{ my: 1 }}>
          <Stack direction="column" spacing={1}>
            <AspectRatio
              ratio="1"
              maxHeight={48}
              sx={{ flex: 1, minWidth: 48, borderRadius: "100%" }}
            >
              <Link color="primary" href={"./users/" + props.data.poster.name}>
                <Image
                  unoptimized
                  src={`https://api.wasteof.money/users/${props.data.poster.name}/picture`}
                  loading="lazy"
                  alt=""
                  width="48"
                  height="48"
                />
              </Link>
            </AspectRatio>
          </Stack>
          <Stack direction="column" spacing={0}>
            <Link color="primary" href={"./users/" + props.data.poster.name}>
              <Typography level="title-md">
                @{props.data.poster.name}
              </Typography>
            </Link>
            <Typography level="body-sm">{props.data.poster.id}</Typography>
          </Stack>
        </Stack>
      </Box>
      <Divider />
      <div style={{ width: "100%" }} className={styles.postContent}>
        {parse(props.data.content)}
      </div>
      {props.data.repost ? (
        (props.level || 0) < 1 || showChildren ? (
          <>
            {((showChildren && props.level) || 0) > 0 ? (
              <Button
                onClick={() => {
                  setShowChildren(false);
                }}
              >
                Hide nested reposts
              </Button>
            ) : null}
            <Post
              showChildren={showChildren}
              data={props.data.repost}
              wrapped={props.wrapped || false}
              level={(props.level || 0) + 1}
            />
          </>
        ) : (
          <Card>
            More nested reposts are hidden{" "}
            <Button
              onClick={() => {
                setShowChildren(true);
              }}
            >
              Show all nested reposts
            </Button>
          </Card>
        )
      ) : null}
      {/* {JSON.stringify(props.data)} */}
      <CardOverflow sx={{ borderTop: "1px solid", borderColor: "divider" }}>
        <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
          <Stack
            sx={{ flexWrap: "wrap", rowGap: "12px" }}
            spacing={3}
            direction="row"
          >
            <Typography
              startDecorator={<FavoriteBorderIcon />}
              sx={{
                textDecoration: "none",
              }}
              component="a"
              href={"https://wasteof.money/posts/" + props.data["_id"]}
            >
              {props.data.loves}
            </Typography>
            {/* <Link underline="hover" fontSize="lg" color="neutral" href={"https://beta.wasteof.money/posts/" + props.data["_id"] + "/reposts"}> */}

            <Typography
              startDecorator={<LoopIcon />}
              // display={{
              //   xs: "none",
              //   md: "flex",
              // }}
              sx={{
                textDecoration: "none",
              }}
              component="a"
              href={
                "https://beta.wasteof.money/posts/" +
                props.data["_id"] +
                "/reposts"
              }
            >
              {props.data.reposts}
            </Typography>
            {/* </Link> */}
            <Typography
              startDecorator={<ChatBubbleOutlineOutlinedIcon />}
              // display={{
              //   xs: "none",
              //   md: "flex",
              // }}
              sx={{
                textDecoration: "none",
              }}
              component="a"
              href={"https://wasteof.money/posts/" + props.data["_id"]}
            >
              {props.data.comments}
            </Typography>
            <Typography
              startDecorator={<EditNoteOutlinedIcon />}
              // display={{
              //   xs: "none",
              //   md: "flex",
              // }}
              sx={{
                textDecoration: "none",
              }}
              component="a"
              href={"https://wasteof.money/posts/" + props.data["_id"]}
            >
              {props.data.revisions.length}
            </Typography>
            <Typography
              startDecorator={<QueryBuilderOutlinedIcon />}
              // display={{
              //   xs: "none",
              //   md: "flex",
              // }}
              sx={{
                textDecoration: "none",
              }}
              component="a"
              href={"https://wasteof.money/posts/" + props.data["_id"]}
            >
              {/* {props.data.time} */}
              {formatTime(props.data.time)}
            </Typography>
            <Link href={"https://wasteof.money/posts/" + props.data["_id"]}>
              <Button onClick={() => {
                          if (window != undefined) {
                            // @ts-ignore
                            window!.umami.track('open_post', {id: props.data["_id"]})
                          }
              }}>Open Post on wasteof</Button>
            </Link>
          </Stack>
        </CardActions>
      </CardOverflow>
    </Card>
  );
}
