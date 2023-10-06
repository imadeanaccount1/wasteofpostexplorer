/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import ArrowForward from '@mui/icons-material/ArrowForward';
import TwoSidedLayout from './TwoSidedLayout';

export default function HeroLeft01() {
  return (
    <>
    <TwoSidedLayout align="center">
      <Typography color="primary" fontSize="lg" fontWeight="lg">
        wasteof.money Post Explorer
      </Typography>
      <Typography
        level="h1"
        fontWeight="xl"
        fontSize="clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)"
      >
        Explore wasteof.money data like never before
      </Typography>
      <Typography fontSize="lg" textColor="text.secondary" lineHeight="lg">
        Search, filter, sort, and aggregate archived wasteof.money users and posts, with new queries, options, features, charts, and views being added constantly.
      </Typography>

    </TwoSidedLayout>
        <TwoSidedLayout align="left">
        <Typography color="primary" fontSize="lg" fontWeight="lg">
          Advanced Analytics, Sorting, and Searching
        </Typography>
        <Typography
          level="h1"
          fontWeight="xl"
          sx={{maxWidth: "700px"}}
          fontSize="clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)"
        >
          The perfect solution for analyzing wasteof.money data
        </Typography>
        <Typography
                  sx={{maxWidth: "800px"}}
                  fontSize="lg" textColor="text.secondary" lineHeight="lg">
          Want to analyze wasteof.money posts and user data without doing thousands of API requests? Post Explorer doesn&apos;t do a single request to the wasteof.money API.
        </Typography>
  
      </TwoSidedLayout>
      </>
  );
}
