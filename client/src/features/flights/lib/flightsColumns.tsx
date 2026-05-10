import type { ColumnDef } from "@tanstack/react-table";
import { PlaneTakeoffIcon } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { cn } from "@/shared/lib/utils";
import type { Flight } from "../types";
import { getFlightStatusColor } from "./getFlightStatusColor";

export const flightsColumns: ColumnDef<Flight>[] = [
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
    accessorKey: "flightCode",
    header: "Flight",
    size: 80,
    cell: ({ row }) => (
      <div className="font-medium font-mono text-muted-foreground">
        {row.getValue("flightCode")}
      </div>
    ),
  },
  {
    accessorKey: "departureTime",
    header: "Time",
    size: 220,
    cell: ({ row }) => {
      const isCancelled = row.original.status === "Cancelled";
      const isDelayed = row.original.status === "Delayed";

      return (
        <div
          className={cn(
            "flex items-center gap-1.5 font-normal tabular-nums",
            isCancelled && "text-muted-foreground line-through opacity-50",
          )}
        >
          <div className={isDelayed ? "text-warning-foreground" : undefined}>
            {row.original.departureTime}
          </div>

          <div
            aria-hidden="true"
            className="flex items-center gap-0.5 opacity-50 before:size-1.5 before:rounded-full before:border before:border-muted-foreground after:h-px after:w-3 after:border-muted-foreground after:border-t after:border-dashed"
          />

          <div
            className={cn(
              "text-muted-foreground",
              isCancelled && "line-through",
            )}
          >
            {row.original.duration}
          </div>

          <div
            aria-hidden="true"
            className="flex items-center gap-0.5 opacity-50 before:order-1 before:size-1.5 before:rounded-full before:border before:border-muted-foreground after:h-px after:w-3 after:border-muted-foreground after:border-t after:border-dashed"
          />

          <div>{row.original.arrivalTime}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "destination",
    header: "Destination",
    size: 180,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("destination")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    cell: ({ row }) => {
      const status = row.getValue("status") as Flight["status"];

      return (
        <Badge variant="outline">
          <span
            aria-hidden="true"
            className={cn(
              "size-1.5 rounded-full",
              getFlightStatusColor(status),
            )}
          />
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "terminal",
    header: "Terminal",
    size: 90,
    cell: ({ row }) => (
      <Badge className="font-normal tabular-nums" size="lg" variant="outline">
        <PlaneTakeoffIcon />
        <span>{row.getValue("terminal")}</span>
      </Badge>
    ),
  },
  {
    accessorKey: "gate",
    header: "Gate",
    size: 80,
  },
];
