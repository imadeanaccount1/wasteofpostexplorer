/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import ArrowForward from '@mui/icons-material/ArrowForward';
import TwoSidedLayout from './TwoSidedLayout';

export default function HeroLeft01() {
  return (
    <TwoSidedLayout>
      <Typography color="primary" fontSize="lg" fontWeight="lg">
        Advanced Analytics, Sorting, and Searching
      </Typography>
      <Typography
        level="h1"
        fontWeight="xl"
        fontSize="clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)"
      >
        Explore wasteof.money like never before
      </Typography>
      <Typography fontSize="lg" textColor="text.secondary" lineHeight="lg">
        Search, filter, sort, and aggregate archived wasteof.money users and posts.
      </Typography>

    </TwoSidedLayout>
  );
}
