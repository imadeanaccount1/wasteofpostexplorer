"use client";

import { StyledEngineProvider } from "@mui/joy/styles";
import Hero from "../components/Hero";
import Link from '@mui/joy/Link';

import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Typography from "@mui/joy/Typography";

export default function Page({ params }: { params: { username: string } }) {
  return (
    <>
      <CssVarsProvider disableTransitionOnChange>
        <CssBaseline />
        <Box sx={{ display: "flex", minHeight: "100dvh" }}>
          <Sidebar page="contact" user={params.username} />
          <Header />
          <Box
            component="main"
            className="MainContent"
            sx={{
              paddingTop: {
                xs: '68px',
                md: '0px',
              },
              paddingLeft: "5vw",
              paddingRight: "5vw",
              // pt: {
              //   xs: "calc(12px + var(--Header-height))",
              //   md: 3,
              // },
              pb: {
                xs: 2,
                sm: 2,
                md: 3,
              },
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignSelf: "center",
              textAlign: "center",
              height: "100dvh",
              gap: 1,
              overflow: "auto",
            }}
          >
            <Typography
              fontSize="clamp(1.875rem, 1.3636rem + 2.1818vw, 2.5rem)"
              level="h2"
              fontWeight="xl"
              sx={{ margin: "0px auto", maxWidth: "900px" }}
            >
              Contact
            </Typography>
            <Typography sx={{ margin: "0px auto", maxWidth: "900px" }}>
              Need to contact us about deleting a post from our archives that
              has been deleted on wasteof because it breaks the rules or because
              you deleted your account/your own post? Contact @imadeanaccount on
              discord, send a message to @imadeanaccount on wasteof.money, or
              report a vulnerability{" "}
              <a href="https://github.com/imadeanaccount1/wasteofpostexplorer/security">
                on GitHub.
              </a>
            </Typography>
            <br />
            <Typography
              fontSize="clamp(1.875rem, 1.3636rem + 2.1818vw, 2.5rem)"
              level="h2"
              fontWeight="xl"
              sx={{ margin: "23px auto 6px auto", maxWidth: "900px" }}
            >
              Credits
            </Typography>
            <Typography sx={{ margin: "0px auto", maxWidth: "900px", textAlign: 'left' }}>
              Post Explorer Tool developed by imadeanaccount1. Data scraped and archived by wasteof scrapers:
              <ul>
                <li>8bit/yeah</li>
                <li>tnix</li>
                <li>the silly</li>
                <li>radi8</li>
                <li>lily</li>
              </ul>
              and of course, the wasteof.money social media is developed by
              jeffalo. 
            </Typography>
            <Typography
              fontSize="clamp(1.875rem, 1.3636rem + 2.1818vw, 2.5rem)"
              level="h2"
              fontWeight="xl"
              sx={{ margin: "23px auto 6px auto", maxWidth: "900px" }}
            >
              License
            </Typography>
            <Typography sx={{ margin: "0px auto", maxWidth: "900px", textAlign: 'left' }}>
              This tool is licensed under the MIT License.
            </Typography>

          </Box>
        </Box>
      </CssVarsProvider>
    </>
  );
}
