import { NumberInput } from "./filterInputs/index";
import { DateInput } from "./filterInputs/index";

export const filters = {
  filters: {
    fields: [
      {
        id: "loves",
        name: "Love Count",
        operations: [">", "<", "==", "!=", ">=", "<="],
        valueType: "int",
        dbCollections: ['posts'],
        queryType: "find",
        fieldPath: {
          "posts": "loves"
        }
      },
    ],
    operations: [
      {
        id: "==",
        name: "Equal To",
      },
      {
        id: ">",
        name: "Greater Than",
      },
      {
        id: "<",
        name: "Less Than",
      },
      {
        id: ">=",
        name: "Greater Than",
      },
      {
        id: "<=",
        name: "Less Than",
      },
    ],
    valueInputs: [
      { id: "int", name: "Number", component: NumberInput },
      { id: "int", name: "Date", component: DateInput },
    ],
  },
};
