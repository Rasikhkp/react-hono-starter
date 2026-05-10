import type { Table } from "@tanstack/react-table";
import { Button } from "@/shared/components/ui/button";
import { CardFrameFooter } from "@/shared/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;

type Props<TData> = {
  table: Table<TData>;
};

export function DataTableFooter<TData>({ table }: Props<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getRowCount();
  const rangeStart = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const rangeEnd = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <CardFrameFooter className="p-2">
      <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <p className="text-muted-foreground text-sm">Rows per page</p>
          <Select
            items={PAGE_SIZE_OPTIONS.map((size) => ({
              label: String(size),
              value: size,
            }))}
            onValueChange={(value) => {
              table.setPageSize(value as number);
              table.setPageIndex(0);
            }}
            value={pageSize}
          >
            <SelectTrigger
              aria-label="Select page size"
              className="w-fit min-w-none"
              size="sm"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectPopup>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
        </div>

        <div className="text-muted-foreground text-sm flex-1 text-center">
          Showing{" "}
          <strong className="font-medium text-foreground">
            {rangeStart} – {rangeEnd}
          </strong>{" "}
          of{" "}
          <strong className="font-medium text-foreground">{totalRows}</strong>{" "}
          results
        </div>

        <Pagination className="justify-end w-fit">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                render={
                  <Button
                    disabled={!table.getCanPreviousPage()}
                    onClick={() => table.previousPage()}
                    size="sm"
                    variant="ghost"
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
                  />
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </CardFrameFooter>
  );
}
