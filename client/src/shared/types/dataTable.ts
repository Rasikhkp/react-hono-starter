import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  Table,
} from "@tanstack/react-table";

export type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  PaginationState,
  Table,
};

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

// Server-side data table types
export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export type UseServerTableOptions<TData> = {
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

export type ServerDataTableProps<TData> = {
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
