import type { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, ShieldCheck, ShieldX, XCircle } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { UserActions } from "../components/UserActions";
import type { User } from "../types";

export const userColumns: ColumnDef<User>[] = [
  {
    id: "select",
    size: 28,
    enableSorting: false,
    header: ({ table }) => {
      const isAllSelected = table.getIsAllPageRowsSelected();
      const isSomeSelected = table.getIsSomePageRowsSelected();

      return (
        <Checkbox
          aria-label="Select all rows"
          checked={isAllSelected}
          indeterminate={isSomeSelected && !isAllSelected}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      );
    },
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    filterFn: "fuzzy",
  },
  {
    id: "email",
    accessorKey: "email",
    size: 200,
    header: "Email",
    filterFn: "fuzzy",
  },
  {
    id: "isActive",
    enableSorting: false,
    accessorKey: "isActive",
    header: "Active",
    filterFn: (row, columnId, filterValue: number[]) => {
      return filterValue.some((v) => v === row.getValue(columnId));
    },
    size: 100,
    cell: ({ getValue }) => {
      const active = getValue<boolean>();

      return active ? (
        <Badge className="gap-1 px-2 py-1">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Active
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className="gap-1 px-2 py-1 text-muted-foreground"
        >
          <XCircle className="h-3.5 w-3.5" />
          Inactive
        </Badge>
      );
    },
  },
  {
    id: "isEmailVerified",
    accessorKey: "isEmailVerified",
    enableSorting: false,
    header: "Email Verified",
    size: 100,
    filterFn: (row, columnId, filterValue: number[]) => {
      return filterValue.some((v) => v === row.getValue(columnId));
    },
    cell: ({ getValue }) => {
      const verified = getValue<boolean>();

      return verified ? (
        <Badge className="gap-1 px-2 py-1">
          <ShieldCheck className="h-3.5 w-3.5" />
          Verified
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className="gap-1 px-2 py-1 text-muted-foreground"
        >
          <ShieldX className="h-3.5 w-3.5" />
          Unverified
        </Badge>
      );
    },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "",
    size: 40,
    cell: ({ row }) => <UserActions user={row.original} />,
  },
];
