import Input from "@mui/joy/Input";

export default function NumberInput(props: any) {
  return (
    <Input
      value={props.value}
      size="md"
      type="text"
      sx={{ width: "100px" }}
      onChange={(event: any) => {
        const filters: any = [...props.filters];
        filters[props.filterIndex].value = event.target.value;
        props.setFilters(filters);
      }}
    />
  );
}
