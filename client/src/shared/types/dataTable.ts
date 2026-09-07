import type {
  ColumnFiltersState,
  PaginationState,
  ReactTable,
  RowData,
  SortingState,
  ColumnDef as TanstackColumnDef,
} from "@tanstack/react-table";
import type { AppTableFeatures } from "../lib/tableFeatures";

export type ColumnDef<TData extends RowData> = TanstackColumnDef<
  AppTableFeatures,
  TData
>;
export type Table<TData extends RowData> = ReactTable<AppTableFeatures, TData>;

export type { ColumnFiltersState, PaginationState, SortingState };

export type DataTableProps<TData extends RowData> = {
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

export type UseDataTableOptions<TData extends RowData> = {
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

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export type UseServerTableOptions<TData extends RowData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  pageCount: number;
  totalRowCount: number;
  state: {
    pagination: PaginationState;
    sorting: SortingState;
    globalFilter: string;
    columnFilters?: ColumnFiltersState;
  };
  onPaginationChange: (updater: unknown) => void;
  onSortingChange: (updater: unknown) => void;
  onGlobalFilterChange: (updater: unknown) => void;
  onColumnFiltersChange?: (updater: unknown) => void;
};

export type ServerDataTableProps<TData extends RowData> = {
  data: TData[];
  isLoading: boolean;
  isError: boolean;
  columns: ColumnDef<TData>[];
  pageCount: number;
  totalRowCount: number;
  state: UseServerTableOptions<TData>["state"];
  onPaginationChange: UseServerTableOptions<TData>["onPaginationChange"];
  onSortingChange: UseServerTableOptions<TData>["onSortingChange"];
  onGlobalFilterChange: UseServerTableOptions<TData>["onGlobalFilterChange"];
  onColumnFiltersChange?: UseServerTableOptions<TData>["onColumnFiltersChange"];
  searchPlaceholder?: string;
  filterableColumns?: FilterableColumn[];
  sortableColumns?: SortableColumn[];
  onExport?: (data: TData[]) => void;
  onDeleteMany?: (data: unknown[]) => void;
};
