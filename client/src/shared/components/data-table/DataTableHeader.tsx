import { flexRender, type HeaderGroup } from "@tanstack/react-table";
import { TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";

type Props<TData> = {
  headerGroups: HeaderGroup<TData>[];
};

export function DataTableHeader<TData>({ headerGroups }: Props<TData>) {
  return (
    <TableHeader>
      {headerGroups.map((headerGroup) => (
        <TableRow className="hover:bg-transparent" key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const columnSize = header.column.getSize();
            return (
              <TableHead
                key={header.id}
                style={columnSize ? { width: `${columnSize}px` } : undefined}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}
