import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import Stack from "@mui/joy/Stack";
import React from "react";
import Autocomplete from "@mui/joy/Autocomplete";
import AutocompleteOption from "@mui/joy/AutocompleteOption";
import AutocompleteListbox from "@mui/joy/AutocompleteListbox";
import CircularProgress from "@mui/joy/CircularProgress";
import { Typography } from "@mui/joy";
import { useRouter } from "next/navigation";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
function sleep(duration: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

export default function SearchComponent(props: any) {
  const router = useRouter();
  const [results, setResults] = React.useState<any>([]);
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [year, setYear] = React.useState("2023");

  const Listbox = React.forwardRef<HTMLUListElement, any>((props2, ref) => (
    <AutocompleteListbox
      ref={ref}
      {...props2}
      variant="plain"
      size="sm"
      sx={{
        // '--List-padding': '0px',
        // '--List-radius': '0px',
        // '--ListItem-paddingX': '8px',
        // '--ListItem-paddingY': '8px',
        position: "absolute",
        top: props.advanced ? "32px" : "42px",
        minWidth: "100%",
        display: open ? "block" : "none",
      }}
    />
  ));
  Listbox.displayName = "Listbox";
  const loading = open && results.length === 0;
  React.useEffect(() => {
    if (!open) {
      setResults([]);
    }
  }, [open]);
  return (
    <Stack
      sx={{ width: "100%", position: "relative" }}
      direction="row"
      spacing={1}
      alignItems="center"
    >
      <Autocomplete
        onChange={(event, newValue, reason) => {
          console.log("CHANGED!!!");

          if (
            event.type === "keydown" &&
            (event as React.KeyboardEvent).key === "Backspace" &&
            reason === "removeOption"
          ) {
            return;
          }
          if (reason != "selectOption") return;
          if (newValue.type == "user") {
            router.push(`/${props.wrapped ? 'wrapped' : 'users'}/${newValue.name}/${props.wrapped ? year : ''}`);
          } else {
            router.push(
              `/posts?filters=[{"field":"name", "operation":"==", "value":"${newValue.name}"}]`
            );
          }

          setSearch(newValue!);
        }}
        sx={{ width: "100%" }}
        forcePopupIcon={false}
        slots={{ listbox: Listbox }}
        size={props.advanced ? "sm" : "lg"}
        placeholder={props.advanced ? "Search..." : "Search by username"}
        type="search"
        endDecorator={
          loading ? (
            <CircularProgress
              size="sm"
              sx={{ bgcolor: "background.surface" }}
            />
          ) : null
        }
        open={open}
        onOpen={async () => {
          if (!props.advanced) {
            setOpen(true);

            const value = search;

            await sleep(500); // For demo purposes.
            console.log(value, search);
            if (value == search) {
              console.log("still the same!");
              setResults([]);
              fetch(
                "../api/autocompleteUsers?advanced=" +
                  props.advanced +
                  "&search=" +
                  search
              )
                .then((data) => data.json())
                .then((res) => {
                  // wait 1 second
                  const userslist = [...res.users];
                  const val = userslist.reduce((list: any, elem, i) => {
                    const it = { ...elem };
                    it.type = "user";
                    list.push(it);
                    if (props.advanced) {
                      const it2 = { ...elem };
                      it2.type = "posted by";
                      list.push(it2);
                    }

                    return list;
                  }, []);
                  setResults(val);

                  console.log(res);
                });
            }
          }
        }}
        onClose={() => {
          setOpen(false);
        }}
        inputValue={search}
        startDecorator={<SearchIcon />}
        onInputChange={async (event, value) => {
          console.log("HELLO");
          setOpen(true);

          setSearch(value);

          await sleep(500); // For demo purposes.
          console.log(value, search);
          if (value == search) {
            console.log("still the same!");
          }
          setResults([]);
          fetch(
            "../api/autocompleteUsers?advanced=" +
              props.advanced +
              "&search=" +
              value
          )
            .then((data) => data.json())
            .then((res) => {
              // wait 1 second
              // .map((option: any) => {
              //     const object = option
              //     object.type = "user"
              //     return object
              // })
              const userslist = [...res.users];
              const val = userslist.reduce((list: any, elem, i) => {
                const it = { ...elem };
                it.type = "user";
                list.push(it);
                if (props.advanced) {
                  const it2 = { ...elem };
                  it2.type = "posted by";
                  list.push(it2);
                }

                return list;
              }, []);
              setResults(val);
              console.log(res);
            });
        }}
        options={results}
        getOptionLabel={(option: any) => option.name}
        loading={loading}
        renderOption={(props2, option: any, { selected }) => (
          <AutocompleteOption {...props2}>
            {props.advanced ? (
              <Typography sx={{ marginRight: "8px" }} level="title-sm">
                {option.type}:
              </Typography>
            ) : null}
            <Image
              unoptimized
              style={{ marginRight: "8px", borderRadius: "100%" }}
              alt={option.name + "'s profile picture"}
              src={
                "https://api.wasteof.money/users/" + option.name + "/picture"
              }
              width={18}
              height={18}
            />
            <Typography level="title-sm">{option.name}</Typography>
          </AutocompleteOption>
        )}
        // disableClearable
      />
      { props.wrapped ?
      <Select sx={{ width: "20%" }} size="lg" value={year} onChange={(event: any, newValue: any) => {
        setYear(newValue)
      }}>
        <Option value="2023">2023</Option>
        <Option value="2022">2022</Option>
      </Select>
      : null }
    </Stack>
  );
}
