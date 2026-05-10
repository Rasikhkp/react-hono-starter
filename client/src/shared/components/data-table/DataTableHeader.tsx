import { flexRender, type HeaderGroup } from "@tanstack/react-table";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
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
                {header.isPlaceholder ? null : header.column.getCanSort() ? (
                  <button
                    type="button"
                    tabIndex={0}
                    className="flex h-full cursor-pointer select-none items-center justify-between gap-2"
                    onClick={header.column.getToggleSortingHandler()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        header.column.getToggleSortingHandler()?.(e);
                      }
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {{
                      asc: (
                        <ChevronUpIcon
                          aria-hidden="true"
                          className="size-4 shrink-0 opacity-80"
                        />
                      ),
                      desc: (
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="size-4 shrink-0 opacity-80"
                        />
                      ),
                    }[header.column.getIsSorted() as string] ?? null}
                  </button>
                ) : (
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )
                )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}
