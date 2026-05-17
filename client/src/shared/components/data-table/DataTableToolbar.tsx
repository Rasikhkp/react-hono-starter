import type { Table } from "@tanstack/react-table";
import { DownloadIcon, SearchIcon, Trash } from "lucide-react";
import { useCallback } from "react";
import { Button } from "@/shared/components/ui/button";
import type {
  FilterableColumn,
  SortableColumn,
} from "@/shared/types/dataTable";
import { DebounceInput } from "../ui/debounce-input";
import { InputGroup, InputGroupAddon } from "../ui/input-group";
import { DataTableFilterDialog } from "./DataTableFilterDialog";
import { DataTableSortDropdown } from "./DataTableSortDropdown";

type Props<TData> = {
  table: Table<TData>;
  searchPlaceholder?: string;
  filterableColumns?: FilterableColumn[];
  sortableColumns?: SortableColumn[];
  onExport?: (data: TData[]) => void;
  onDeleteMany?: (data: unknown[]) => void;
};

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Search...",
  filterableColumns,
  sortableColumns,
  onExport,
  onDeleteMany,
}: Props<TData>) {
  const handleSearch = (value: string) => {
    table.setGlobalFilter(value);
    table.setPageIndex(0);
  };

  const handleDeleteMany = useCallback(() => {
    const users = table.getSelectedRowModel().rows.map((r) => r.original);

    onDeleteMany?.(users);

    table.resetRowSelection();
  }, [table]);

  const isSelected =
    table.getIsSomePageRowsSelected() || table.getIsAllPageRowsSelected();

  return (
    <div className="flex items-center justify-between gap-2 border-b p-2">
      <InputGroup className="max-w-80">
        <DebounceInput
          unstyled={true}
          placeholder={searchPlaceholder}
          debounceMs={300}
          onDebouncedChange={handleSearch}
        />
        <InputGroupAddon>
          <SearchIcon aria-hidden="true" />
        </InputGroupAddon>
      </InputGroup>

      {/* Right side: filter + export */}
      <div className="flex items-center gap-2">
        {isSelected && (
          <Button
            variant="destructive-outline"
            size="sm"
            className="relative text-destructive"
            onClick={handleDeleteMany}
          >
            <div className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {table.getSelectedRowModel().rows.length}
            </div>
            <Trash />
          </Button>
        )}

        {sortableColumns?.length ? (
          <DataTableSortDropdown
            table={table}
            sortableColumns={sortableColumns}
          />
        ) : null}

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
