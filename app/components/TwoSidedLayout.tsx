"use client";

import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Container from "@mui/joy/Container";
import { typographyClasses } from "@mui/joy/Typography";

export default function TwoSidedLayout({
  children,
  reversed,
  align,
}: React.PropsWithChildren<{ reversed?: boolean }> & {
  align: string;
}) {
  return (
    <Container
      sx={{
        position: "relative",
        display: "flex",
        alignSelf: align,
        flexDirection: reversed ? "column-reverse" : "column",
        alignItems: align,
        py: 10,
        gap: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: align,
          gap: "1rem",
          textAlign: align,
          flexShrink: 999,
          [`& .${typographyClasses.root}`]: {
            textWrap: "balance",
          },
        }}
      >
        {children}
      </Box>
    </Container>
  );
}
