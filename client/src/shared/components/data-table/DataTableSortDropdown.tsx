import type { RowData } from "@tanstack/react-table";
import { ArrowDownUp } from "lucide-react";
import type { SortableColumn, Table } from "@/shared/types/dataTable";
import { Button } from "../ui/button";
import {
  Menu,
  MenuCheckboxItem,
  MenuGroup,
  MenuPopup,
  MenuTrigger,
} from "../ui/menu";

type Props<TData extends RowData> = {
  table: Table<TData>;
  sortableColumns: SortableColumn[];
};

export function DataTableSortDropdown<TData extends RowData>({
  table,
  sortableColumns,
}: Props<TData>) {
  const sorting = table.state.sorting;

  return (
    <Menu>
      <MenuTrigger render={<Button variant="outline" size="sm" />}>
        <ArrowDownUp />
      </MenuTrigger>

      <MenuPopup>
        <MenuGroup>
          {sortableColumns.map((s) => {
            const checked = sorting.some(
              (sort) => sort.id === s.id && sort.desc === s.desc,
            );

            return (
              <MenuCheckboxItem
                checked={checked}
                key={s.label}
                onClick={() => table.setSorting([{ id: s.id, desc: s.desc }])}
              >
                {s.label}
              </MenuCheckboxItem>
            );
          })}
        </MenuGroup>
      </MenuPopup>
    </Menu>
  );
}
