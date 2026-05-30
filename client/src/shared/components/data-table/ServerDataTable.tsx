import { CardFrame } from "@/shared/components/ui/card";
import { Table } from "@/shared/components/ui/table";
import { useServerTable } from "@/shared/hooks/useServerTable";
import type { ServerDataTableProps } from "@/shared/types/dataTable";
import { DataTableBody } from "./DataTableBody";
import { DataTableFooter } from "./DataTableFooter";
import { DataTableHeader } from "./DataTableHeader";
import { DataTableToolbar } from "./DataTableToolbar";
import { DataTableTopPagination } from "./DataTableTopPagination";

export function ServerDataTable<TData>({
  data,
  isLoading,
  isError,
  columns,
  pageCount,
  totalRowCount,
  state,
  onPaginationChange,
  onSortingChange,
  onGlobalFilterChange,
  onColumnFiltersChange,
  searchPlaceholder,
  filterableColumns,
  sortableColumns,
  onExport,
  onDeleteMany,
}: ServerDataTableProps<TData>) {
  const table = useServerTable({
    data,
    columns,
    pageCount,
    totalRowCount,
    state,
    onPaginationChange,
    onSortingChange,
    onGlobalFilterChange,
    onColumnFiltersChange,
  });

  return (
    <CardFrame className="w-full">
      <DataTableToolbar
        table={table}
        searchPlaceholder={searchPlaceholder}
        filterableColumns={filterableColumns}
        sortableColumns={sortableColumns}
        onExport={onExport}
        onDeleteMany={onDeleteMany}
      />
      <DataTableTopPagination table={table} />
      <Table variant="card" className="table-fixed">
        <DataTableHeader headerGroups={table.getHeaderGroups()} />
        <DataTableBody
          isLoading={isLoading}
          isError={isError}
          rows={table.getRowModel().rows}
          columnCount={columns.length}
        />
      </Table>
      <DataTableFooter table={table} />
    </CardFrame>
  );
}
