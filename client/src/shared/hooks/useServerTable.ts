import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import { fuzzyFilter } from "../lib/fuzzyFilter";
import type { UseServerTableOptions } from "../types/dataTable";

export function useServerTable<TData>({
  data,
  columns,
  pageCount,
  totalRowCount,
  state,
  onPaginationChange,
  onSortingChange,
  onGlobalFilterChange,
  onColumnFiltersChange,
}: UseServerTableOptions<TData>) {
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable<TData>({
    data,
    columns,
    pageCount,
    rowCount: totalRowCount,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    enableSortingRemoval: false,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    onPaginationChange: (updater) => {
      onPaginationChange(updater);
    },
    onSortingChange: (updater) => {
      onSortingChange(updater);
    },
    onGlobalFilterChange: (updater) => {
      onGlobalFilterChange(updater);
    },
    onColumnFiltersChange: onColumnFiltersChange
      ? (updater) => {
          onColumnFiltersChange(updater);
        }
      : undefined,
    state: {
      pagination: state.pagination,
      sorting: state.sorting,
      globalFilter: state.globalFilter,
      columnFilters: state.columnFilters,
      rowSelection,
    },
  });

  return table;
}
