import * as React from "react";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import Chip from "@mui/joy/Chip";
import IconButton from "@mui/joy/IconButton";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import SupportIcon from "@mui/icons-material/Support";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Link from "@mui/joy/Link";
import ColorSchemeToggle from "./ColorSchemeToggle";
import { closeSidebar } from "../utils";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import ShuffleIcon from "@mui/icons-material/Shuffle";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import SearchComponent from "./SearchComponent";
import RedeemIcon from '@mui/icons-material/Redeem';
function Toggler({
  defaultExpanded = false,
  renderToggle,
  children,
}: {
  defaultExpanded?: boolean;
  children: React.ReactNode;
  renderToggle: (params: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultExpanded);
  return (
    <React.Fragment>
      {renderToggle({ open, setOpen })}
      <Box
        sx={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "0.2s ease",
          "& > *": {
            overflow: "hidden",
          },
        }}
      >
        {children}
      </Box>
    </React.Fragment>
  );
}

export default function Sidebar(props: { user: string; page: string }) {
  return (
    <>
    <Box
        className="Sidebar-overlay"
        sx={{
          position: "fixed",
          zIndex: 9999,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: "var(--SideNavigation-slideIn)",
          backgroundColor: "var(--joy-palette-background-backdrop)",
          transition: "opacity 0.4s",
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
            lg: "translateX(-100%)",
          },
        }}
        onClick={() => closeSidebar()}
      />
    <Sheet
      className="Sidebar"
      sx={{
        position: {
          xs: "fixed",
          md: "sticky",
        },
        transform: {
          xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
          md: "none",
        },
        transition: "transform 0.4s, width 0.4s",
        zIndex: 10000,
        height: "100dvh",
        width: "var(--Sidebar-width)",
        maxWidth: "370px",
        top: 0,
        p: 1.5,
        py: 3,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <IconButton variant="soft" color="primary" size="sm">
          <LocalAtmIcon />
        </IconButton>
        <Typography level="title-lg">wasteof.money Post Explorer</Typography>
        <ColorSchemeToggle sx={{ ml: "auto" }} />
      </Box>

      <Box
        sx={{
          minHeight: 0,
          overflow: "hidden auto",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            "--List-nestedInsetStart": "30px",
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
          }}
        >
          <SearchComponent advanced={true} />
          <ListItem>
            <ListItemButton
              component="a"
              href={props.page == "user" ? "../" :props.page == "wrapped" ? "../../" : "../"}
              selected={props.page == "home"}
            >
              <HomeRoundedIcon sx={{ marginRight: "8px" }} />
              <ListItemContent>
                <Typography level="title-sm">Home</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem nested>
            <Toggler
              renderToggle={({ open, setOpen }) => (
                <ListItemButton
                  onClick={() => setOpen(!open)}
                  href={props.page == "user" ? "../posts" : props.page == "wrapped" ? "../../posts" : "posts"}
                  component="a"
                  selected={props.page == "posts"}
                >
                  <PostAddOutlinedIcon sx={{ marginRight: "8px" }} />
                  <ListItemContent>
                    <Typography level="title-sm">All Posts</Typography>
                  </ListItemContent>
                  <Link href="#">
                    <KeyboardArrowDownIcon
                      sx={{ transform: open ? "rotate(180deg)" : "none" }}
                    />
                  </Link>
                </ListItemButton>
              )}
            >
              <List sx={{ gap: 0.5 }}>
                <ListItem sx={{ mt: 0.5 }}>
                  <ListItemButton disabled role="menuitem" component="a">
                    <ShuffleIcon sx={{ marginRight: "8px" }} />
                    <ListItemContent>
                      <Typography level="title-sm">
                        Random Posts{" "}
                        <Chip
                          color="primary"
                          variant="solid"
                          sx={{ marginLeft: "8px" }}
                        >
                          Soon!
                        </Chip>
                      </Typography>
                    </ListItemContent>
                  </ListItemButton>
                </ListItem>
              </List>
            </Toggler>
          </ListItem>

          <ListItem>
            <ListItemButton
              selected={props.page == "users"}
              role="menuitem"
              component="a"
              href={props.page == "user" ? "../users" : props.page == "wrapped" ? "../../users" : "users"}
            >
              <GroupOutlinedIcon sx={{ marginRight: "8px" }} />
              <ListItemContent>
                <Typography level="title-sm">Find Users</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          {props.page == "user" ? (
            <ListItem nested>
              <Toggler
                defaultExpanded
                renderToggle={({ open, setOpen }) => (
                  <ListItemButton onClick={() => setOpen(!open)}>
                    <Image
                      unoptimized
                      src={`https://api.wasteof.money/users/${props.user}/picture`}
                      loading="lazy"
                      alt=""
                      width="24"
                      height="24"
                      style={{
                        marginRight: "8px",
                        borderRadius: "50%",
                      }}
                    />
                    <ListItemContent>
                      <Typography level="title-sm">
                        {"@" + props.user + "'s"} profile
                      </Typography>
                    </ListItemContent>
                    <KeyboardArrowDownIcon
                      sx={{ transform: open ? "rotate(180deg)" : "none" }}
                    />
                  </ListItemButton>
                )}
              >
                <List sx={{ gap: 0.5 }}>
                  <ListItem sx={{ mt: 0.5 }}>
                    <ListItemButton selected>Posts</ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>Media</ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>Statistics</ListItemButton>
                  </ListItem>
                </List>
              </Toggler>
            </ListItem>
          ) : null}
          <ListItem>
            <ListItemButton
              component="a"
              href={props.page == "search" ? "../finduser" : props.page == "wrapped" ? "../../finduser" : "../finduser"}
              selected={props.page == "search"}
            >
              <SearchIcon sx={{ marginRight: "8px" }} />
              <ListItemContent>
                <Typography level="title-sm">Specific User</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              component="a"
              href={props.page == "wrapped" ? "../wrapped" : props.page == "wrapped" ? "../../wrapped" : "../wrapped"}
              selected={props.page == "wrapped"}
            >
              <RedeemIcon sx={{ marginRight: "8px" }} />
              <ListItemContent>
                <Typography level="title-sm">wasteof Wrapped<Chip sx={{marginLeft: '8px'}} color="primary" variant="solid">New!</Chip></Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              component="a"
              href={props.page == "user" ? "../contact" : props.page == "wrapped" ? "../../contact" : "../contact"}
              selected={props.page == "contact"}
            >
              <SupportIcon sx={{ marginRight: "8px" }} />
              <ListItemContent>
                <Typography level="title-sm">
                  Contact, Credits, and License
                </Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
        </List>
        <Card
          invertedColors
          variant="soft"
          color="primary"
          size="sm"
          sx={{ boxShadow: "none" }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography level="title-sm">Note:</Typography>
          </Stack>
          <Typography level="body-xs">
            Post Explorer Data may be outdated or inaccurate. Deleted or
            admin-removed posts may be shown, contact us to report them/request deletions. 
          </Typography>
        </Card>
      </Box>
    </Sheet>
    </>
  );
}
