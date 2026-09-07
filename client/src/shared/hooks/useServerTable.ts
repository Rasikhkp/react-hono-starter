import { type RowData, useTable } from "@tanstack/react-table";
import { useState } from "react";
import { tableFeatureSet } from "../lib/tableFeatures";
import type { UseServerTableOptions } from "../types/dataTable";

export function useServerTable<TData extends RowData>({
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

  return useTable({
    features: tableFeatureSet,
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
}
