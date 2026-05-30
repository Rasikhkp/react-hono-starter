import type { Table } from "@tanstack/react-table";
import { Button } from "@/shared/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";

type Props<TData> = {
  table: Table<TData>;
};

export function DataTableTopPagination<TData>({ table }: Props<TData>) {
  const { pageIndex } = table.getState().pagination;
  const totalRows = table.getRowCount();
  const pageCount = table.getPageCount();

  if (totalRows === 0 && !table.options.manualPagination) return null;

  return (
    <div className="flex items-center justify-between border-b px-3 py-1.5">
      <span className="text-muted-foreground text-xs">
        Page{" "}
        <strong className="font-medium text-foreground">{pageIndex + 1}</strong>{" "}
        of <strong className="font-medium text-foreground">{pageCount}</strong>
      </span>

      <Pagination className="w-fit flex-1 justify-end">
        <PaginationContent className="gap-0">
          <PaginationItem>
            <PaginationPrevious
              render={
                <Button
                  disabled={!table.getCanPreviousPage()}
                  onClick={() => table.previousPage()}
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs"
                />
              }
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              render={
                <Button
                  disabled={!table.getCanNextPage()}
                  onClick={() => table.nextPage()}
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs"
                />
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
