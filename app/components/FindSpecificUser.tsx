import React from "react";
import Box from "@mui/joy/Box";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import Typography from "@mui/joy/Typography";
import SearchIcon from '@mui/icons-material/Search';
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";

import {useRouter} from "next/navigation";

export default function FindSpecificUser(props: {}) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
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
            Find Specific User
          </Link>
        </Breadcrumbs>
        <Typography
          level="h2"
          sx={{
            mt: 1,
            mb: 2,
          }}
        >
         Find Specific User
        </Typography>
      </Box>
      </Box>
      <Box sx={{ marginLeft: '50px', marginRight: '50px' }}>
        <Typography fontSize='md' sx={{marginTop:'40px', marginBottom: '16px'}}>
        Find a specific user by their username. (Autocomplete coming soon!)
        </Typography>
      <Stack direction="row" spacing={1} alignItems="center">
      <Input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
          size="lg"
          placeholder="Search Username"
          startDecorator={<SearchIcon />}
          sx={{ flexGrow: 1 }}
        />
        <Button size="lg"
        onClick={(e) => {
          router.push(`/users/${search}`)
        }}>
          Go to User Profile
        </Button>
        </Stack>
        </Box>
      </Box>

)
}