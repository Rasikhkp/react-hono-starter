import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  Table,
} from "@tanstack/react-table";

export type { ColumnDef, SortingState, ColumnFiltersState, Table };

export type DataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  searchColumn?: string;
  searchPlaceholder?: string;
  filterableColumns?: FilterableColumn[];
  onExport?: (data: TData[]) => void;
  defaultPageSize?: number;
  defaultSort?: SortingState;
};

export type UseDataTableOptions<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  defaultPageSize?: number;
  defaultSort?: SortingState;
};

export type FilterableColumnBase = {
  id: string;
  label: string;
};

export type TextFilterableColumn = FilterableColumnBase & {
  type: "text";
};

export type SelectFilterableColumn = FilterableColumnBase & {
  type: "select";
  options: { label: string; value: string }[];
};

export type CheckboxFilterableColumn = FilterableColumnBase & {
  type: "checkbox";
  options: { label: string; value: string }[];
};

export type RadioFilterableColumn = FilterableColumnBase & {
  type: "radio";
  options: { label: string; value: string }[];
};

export type FilterableColumn =
  | TextFilterableColumn
  | SelectFilterableColumn
  | CheckboxFilterableColumn
  | RadioFilterableColumn;
