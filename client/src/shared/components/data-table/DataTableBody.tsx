import { flexRender, type Row } from "@tanstack/react-table";
import { TableBody, TableCell, TableRow } from "@/shared/components/ui/table";
import { DiagonalWave } from "../loading/DiagonalWave";

type Props<TData> = {
  rows: Row<TData>[];
  columnCount: number;
  isLoading: boolean;
  isError: boolean;
};

export function DataTableBody<TData>({
  rows,
  columnCount,
  isError,
  isLoading,
}: Props<TData>) {
  if (!rows.length && !isError && !isLoading) {
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

  if (isError) {
    return (
      <TableBody>
        <TableRow>
          <TableCell className="h-24 text-center" colSpan={columnCount}>
            No results. Error happened.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  if (isLoading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell className="h-24 text-center" colSpan={columnCount}>
            <div className="flex justify-center mb-4">
              <DiagonalWave />
            </div>
            Loading your data...
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
