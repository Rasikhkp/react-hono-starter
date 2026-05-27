import type { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Clock3, Mail, ShieldCheck, XCircle } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { cn } from "@/shared/lib/utils";

import { UserActions } from "../components/UserActions";
import type { User } from "../types";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getRoleVariant(role: string) {
  switch (role.toLowerCase()) {
    case "super admin":
      return "destructive";

    case "admin":
      return "default";

    case "manager":
      return "secondary";

    default:
      return "outline";
  }
}

export const userColumns: ColumnDef<User>[] = [
  {
    id: "select",
    size: 32,
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
    id: "user",
    accessorKey: "name",
    header: "User",
    size: 280,
    filterFn: "fuzzy",

    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={user.avatar ?? undefined} alt={user.name} />

            <AvatarFallback className="text-xs font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium">{user.name}</p>

              {user.isEmailVerified ? (
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
              ) : (
                ""
              )}
            </div>

            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Mail className="h-3.5 w-3.5" />
              <span className="truncate">{user.email}</span>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    id: "roles",
    accessorKey: "roles",
    enableSorting: false,
    header: "Roles",
    size: 180,

    cell: ({ row }) => {
      const roles = row.original.roles;

      if (roles.length === 0) {
        return <span className="text-muted-foreground text-sm">No role</span>;
      }

      return (
        <div className="flex flex-wrap gap-1">
          {roles.map((role) => (
            <Badge
              key={role.id}
              variant={getRoleVariant(role.name)}
              className="rounded-md"
            >
              {role.name}
            </Badge>
          ))}
        </div>
      );
    },
  },

  {
    id: "status",
    accessorKey: "isActive",
    header: "Status",
    size: 120,
    enableSorting: false,

    filterFn: (row, columnId, filterValue: boolean[]) => {
      return filterValue.includes(row.getValue(columnId));
    },

    cell: ({ row }) => {
      const active = row.original.isActive;

      return (
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-2 w-2 rounded-full",
              active ? "bg-emerald-500" : "bg-zinc-400",
            )}
          />

          <span
            className={cn(
              "text-sm font-medium",
              active ? "text-emerald-600" : "text-muted-foreground",
            )}
          >
            {active ? "Active" : "Inactive"}
          </span>
        </div>
      );
    },
  },

  {
    id: "verification",
    accessorKey: "isEmailVerified",
    header: "Verification",
    size: 140,
    enableSorting: false,

    filterFn: (row, columnId, filterValue: boolean[]) => {
      return filterValue.includes(row.getValue(columnId));
    },

    cell: ({ getValue }) => {
      const verified = getValue<boolean>();

      return verified ? (
        <Badge className="gap-1 rounded-md">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Verified
        </Badge>
      ) : (
        <Badge variant="outline" className="gap-1 rounded-md">
          <XCircle className="h-3.5 w-3.5" />
          Pending
        </Badge>
      );
    },
  },

  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Joined",
    size: 140,

    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock3 className="h-3.5 w-3.5" />

          <span>
            {row.original.createdAt &&
              formatDistanceToNow(new Date(row.original.createdAt), {
                addSuffix: true,
              })}
          </span>
        </div>
      );
    },
  },

  {
    id: "actions",
    header: "",
    size: 48,

    cell: ({ row }) => (
      <div className="flex justify-end">
        <UserActions user={row.original} />
      </div>
    ),
  },
];
