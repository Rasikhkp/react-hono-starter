import type { FilterableColumn } from "@/shared/types/dataTable";

export const filterableFlightsColumns: FilterableColumn[] = [
  {
    id: "status",
    label: "Status",
    type: "checkbox", // changed: multi-select via checkboxes
    options: [
      { label: "On Time", value: "On Time" },
      { label: "Delayed", value: "Delayed" },
      { label: "Cancelled", value: "Cancelled" },
      { label: "Boarding", value: "Boarding" },
    ],
  },
  {
    id: "terminal",
    label: "Terminal",
    type: "radio", // changed: single-select via radio
    options: [
      { label: "Terminal 1", value: "1" },
      { label: "Terminal 2", value: "2" },
      { label: "Terminal 3", value: "3" },
    ],
  },
];
