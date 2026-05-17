import { CardFrame } from "@/shared/components/ui/card";
import { Table } from "@/shared/components/ui/table";
import { useDataTable } from "@/shared/hooks/useDataTable";
import type { DataTableProps } from "@/shared/types/dataTable";
import { DataTableBody } from "./DataTableBody";
import { DataTableFooter } from "./DataTableFooter";
import { DataTableHeader } from "./DataTableHeader";
import { DataTableToolbar } from "./DataTableToolbar";

export function DataTable<TData>({
  data,
  isLoading,
  isError,
  columns,
  searchPlaceholder,
  filterableColumns,
  sortableColumns,
  onExport,
  onDeleteMany,
  defaultPageSize,
  defaultSort,
}: DataTableProps<TData>) {
  const table = useDataTable({
    data,
    isError,
    isLoading,
    columns,
    defaultPageSize,
    defaultSort,
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
