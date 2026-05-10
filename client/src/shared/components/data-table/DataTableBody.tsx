import { flexRender, type Row } from "@tanstack/react-table";
import { TableBody, TableCell, TableRow } from "@/shared/components/ui/table";

type Props<TData> = {
  rows: Row<TData>[];
  columnCount: number;
};

export function DataTableBody<TData>({ rows, columnCount }: Props<TData>) {
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
