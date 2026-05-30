import { flexRender, type Row } from "@tanstack/react-table";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { TableBody, TableCell, TableRow } from "@/shared/components/ui/table";

type Props<TData> = {
  rows: Row<TData>[];
  columnCount: number;
  isLoading: boolean;
  isError: boolean;
};

const SKELETON_ROW_COUNT = 8;

function getSkeletonWidth(cellIndex: number): string {
  const widths = ["30%", "50%", "20%", "40%", "25%", "35%", "15%", "45%"];
  return widths[cellIndex % widths.length];
}

export function DataTableBody<TData>({
  rows,
  columnCount,
  isError,
  isLoading,
}: Props<TData>) {
  if (isLoading) {
    return (
      <TableBody>
        {Array.from({ length: SKELETON_ROW_COUNT }).map((_, rowIdx) => (
          <TableRow key={`skeleton-${rowIdx}`}>
            {Array.from({ length: columnCount }).map((_, cellIdx) => (
              <TableCell key={`skeleton-cell-${cellIdx}`}>
                <Skeleton
                  className="h-4"
                  style={{ width: getSkeletonWidth(cellIdx) }}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    );
  }

  if (isError) {
    return (
      <TableBody>
        <TableRow>
          <TableCell className="h-24 text-center" colSpan={columnCount}>
            An error occurred while loading data.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  if (!rows.length) {
    return (
      <TableBody>
        <TableRow>
          <TableCell className="h-24 text-center" colSpan={columnCount}>
            No results.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {rows.map((row) => (
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() ? "selected" : undefined}
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
