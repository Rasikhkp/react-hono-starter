import {
  flexRender,
  type HeaderGroup,
  type RowData,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import type { AppTableFeatures } from "@/shared/lib/tableFeatures";
import { cn } from "@/shared/lib/utils";

type Props<TData extends RowData> = {
  headerGroups: HeaderGroup<AppTableFeatures, TData>[];
};

export function DataTableHeader<TData extends RowData>({
  headerGroups,
}: Props<TData>) {
  return (
    <TableHeader>
      {headerGroups.map((headerGroup) => (
        <TableRow className="hover:bg-transparent" key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const columnSize = header.column.getSize();
            const canSort = header.column.getCanSort();
            const sortDirection = header.column.getIsSorted();

            return (
              <TableHead
                key={header.id}
                style={columnSize ? { width: `${columnSize}px` } : undefined}
                className={cn(canSort && "cursor-pointer select-none")}
                onClick={
                  canSort ? header.column.getToggleSortingHandler() : undefined
                }
                aria-sort={
                  sortDirection === "asc"
                    ? "ascending"
                    : sortDirection === "desc"
                      ? "descending"
                      : undefined
                }
              >
                <span className="inline-flex items-center gap-1">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                  {canSort &&
                    (sortDirection === "asc" ? (
                      <ArrowUp className="size-3.5 shrink-0" />
                    ) : sortDirection === "desc" ? (
                      <ArrowDown className="size-3.5 shrink-0" />
                    ) : (
                      <ArrowUpDown className="size-3.5 shrink-0 text-muted-foreground/40" />
                    ))}
                </span>
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}
