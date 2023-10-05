/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import Card, { CardProps } from '@mui/joy/Card';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import AspectRatio from '@mui/joy/AspectRatio';

export default function DropZone({
  icon,
  sx,
  ...props
}: CardProps & {
  icon?: React.ReactElement;
}) {
  return (
    <Card
      variant="soft"
      {...props}
      sx={[
        {
          borderRadius: 'sm',
          borderStyle: 'dashed',
          borderColor: 'neutral.500',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          alignItems: 'center',
          px: 3,
          flexGrow: 1,
          boxShadow: 'none',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <AspectRatio
        ratio="1"
        variant="solid"
        color="primary"
        sx={{
          minWidth: 32,
          borderRadius: '50%',
          '--Icon-fontSize': '16px',
        }}
      >
        <div>{icon ?? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-compass"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>}</div>
      </AspectRatio>

<Typography level="body-lg" textAlign="center">
No Posts Found
</Typography>
      <Typography level="body-sm" textAlign="center">
          
        We could not find any posts for this user. This may be because the database only includes data created before October 2, 2023.
      </Typography>
    </Card>
  );
}
