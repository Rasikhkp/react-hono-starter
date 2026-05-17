import type { FilterableColumn } from "@/shared/types/dataTable";

export const filterableUserColumn: FilterableColumn[] = [
  {
    id: "isActive",
    label: "Is active",
    type: "checkbox",
    multiple: true,
    options: [
      {
        label: "Active",
        value: 1,
      },
      {
        label: "Inactive",
        value: 0,
      },
    ],
  },
  {
    id: "isEmailVerified",
    label: "Is email verified",
    type: "checkbox",
    multiple: true,
    options: [
      {
        label: "Verified",
        value: 1,
      },
      {
        label: "Unverified",
        value: 0,
      },
    ],
  },
];
