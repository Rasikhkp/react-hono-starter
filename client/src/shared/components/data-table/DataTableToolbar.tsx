import type { Table } from "@tanstack/react-table";
import { DownloadIcon, SearchIcon } from "lucide-react";
import { type ChangeEvent, useCallback } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import type { FilterableColumn } from "@/shared/types/dataTable";
import { DataTableFilterDialog } from "./DataTableFilterDialog";

type Props<TData> = {
  table: Table<TData>;
  searchColumn?: string;
  searchPlaceholder?: string;
  filterableColumns?: FilterableColumn[];
  onExport?: (data: TData[]) => void;
};

export function DataTableToolbar<TData>({
  table,
  searchColumn,
  searchPlaceholder = "Search...",
  filterableColumns,
  onExport,
}: Props<TData>) {
  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!searchColumn) return;
      table.getColumn(searchColumn)?.setFilterValue(e.target.value);
      table.setPageIndex(0);
    },
    [table, searchColumn],
  );

  const searchValue = searchColumn
    ? ((table.getColumn(searchColumn)?.getFilterValue() as string) ?? "")
    : "";

  const hasToolbar = searchColumn || filterableColumns?.length || onExport;
  if (!hasToolbar) return null;

  return (
    <div className="flex items-center justify-between gap-2 border-b p-2">
      {/* Left side: search */}
      {searchColumn && (
        <div className="relative w-60 shrink">
          <SearchIcon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={handleSearch}
            className="pl-8 text-sm bg-background"
          />
        </div>
      )}

      {/* Right side: filter + export */}
      <div className="flex items-center gap-2">
        {filterableColumns?.length ? (
          <DataTableFilterDialog
            table={table}
            filterableColumns={filterableColumns}
          />
        ) : null}

        {onExport && (
          <Button
            variant="outline"
            size="sm"
            className="z-10"
            onClick={() =>
              onExport(table.getFilteredRowModel().rows.map((r) => r.original))
            }
          >
            <DownloadIcon className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
