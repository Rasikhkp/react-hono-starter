import {
  type ColumnFiltersState,
  type PaginationState,
  type RowData,
  type SortingState,
  useTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { tableFeatureSet } from "../lib/tableFeatures";
import type { UseDataTableOptions } from "../types/dataTable";

export function useDataTable<TData extends RowData>({
  data,
  columns,
  defaultPageSize = 10,
  defaultSort = [],
}: UseDataTableOptions<TData>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });
  const [sorting, setSorting] = useState<SortingState>(defaultSort);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  return useTable({
    features: tableFeatureSet,
    data,
    columns,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    enableSortingRemoval: false,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      columnFilters,
      globalFilter,
      pagination,
      sorting,
      rowSelection,
    },
  });
}
