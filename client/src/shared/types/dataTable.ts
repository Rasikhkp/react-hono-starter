import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  Table,
} from "@tanstack/react-table";

export type { ColumnDef, SortingState, ColumnFiltersState, Table };

export type DataTableProps<TData> = {
  data: TData[];
  isLoading: boolean;
  isError: boolean;
  columns: ColumnDef<TData>[];
  searchPlaceholder?: string;
  filterableColumns?: FilterableColumn[];
  sortableColumns?: SortableColumn[];
  onExport?: (data: TData[]) => void;
  onDeleteMany?: (data: unknown[]) => void;
  defaultPageSize?: number;
  defaultSort?: SortingState;
};

export type UseDataTableOptions<TData> = {
  data: TData[];
  isLoading: boolean;
  isError: boolean;
  columns: ColumnDef<TData>[];
  defaultPageSize?: number;
  defaultSort?: SortingState;
};

export type SortableColumn = {
  id: string;
  label: string;
  desc: boolean;
};

type FilterOption = {
  label: string;
  value: string | number;
};

type FilterableColumnBase = {
  id: string;
  label: string;
  multiple: boolean;
};

export type SelectFilterableColumn = FilterableColumnBase & {
  type: "select";
  options: FilterOption[];
};

export type CheckboxFilterableColumn = FilterableColumnBase & {
  type: "checkbox";
  options: FilterOption[];
};

export type RadioFilterableColumn = FilterableColumnBase & {
  type: "radio";
  options: FilterOption[];
};

export type FilterableColumn =
  | SelectFilterableColumn
  | CheckboxFilterableColumn
  | RadioFilterableColumn;
