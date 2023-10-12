import Input from "@mui/joy/Input";

export default function DateInput(props: any) {
  return (
    <Input
      type="date"
      placeholder="Jan 6 - Jan 13"
      value={props.value}
      size="md"
      onChange={(event: any) => {
        const filters: any = [...props.filters];
        filters[props.filterIndex].value = event.target.value;
        // console.log(filters, props.filterIndex, props.setFilters);
        props.setFilters(filters);
        // console.log(props.filters);
      }}
    />
  );
}
