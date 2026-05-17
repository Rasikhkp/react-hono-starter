import type { Table } from "@tanstack/react-table";
import { SlidersHorizontalIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";

import type { FilterableColumn } from "@/shared/types/dataTable";
import { FilterField } from "./FilterField";

type Props<TData> = {
  table: Table<TData>;
  filterableColumns: FilterableColumn[];
};

type DraftFilters = Record<string, (string | number) | (string | number)[]>;

function getInitialDraft(
  columns: FilterableColumn[],
  table: Table<unknown>,
): DraftFilters {
  return Object.fromEntries(
    columns.map((col) => {
      const active = table.getColumn(col.id)?.getFilterValue();

      return [
        col.id,
        col.multiple ? (Array.isArray(active) ? active : []) : (active ?? ""),
      ];
    }),
  ) as DraftFilters;
}

export function DataTableFilterDialog<TData>({
  table,
  filterableColumns,
}: Props<TData>) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DraftFilters>({});

  useEffect(() => {
    if (!open) return;

    setDraft(getInitialDraft(filterableColumns, table as Table<unknown>));
  }, [open, filterableColumns, table]);

  const activeFilterCount = filterableColumns.filter((col) => {
    const value = table.getColumn(col.id)?.getFilterValue();

    return Array.isArray(value) ? value.length > 0 : !!value;
  }).length;

  function setValue(
    id: string,
    value: (string | number) | (string | number)[],
  ) {
    setDraft((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  function handleApply() {
    for (const col of filterableColumns) {
      const value = draft[col.id];

      table
        .getColumn(col.id)
        ?.setFilterValue(
          Array.isArray(value)
            ? value.length > 0
              ? value
              : undefined
            : value || undefined,
        );
    }

    table.setPageIndex(0);
    setOpen(false);
  }

  function handleClear() {
    const cleared = Object.fromEntries(
      filterableColumns.map((col) => [col.id, col.multiple ? [] : ""]),
    );

    setDraft(cleared);

    for (const col of filterableColumns) {
      table.getColumn(col.id)?.setFilterValue(undefined);
    }

    table.setPageIndex(0);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="relative">
            <SlidersHorizontalIcon className="size-4" />

            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>
        }
      />

      <DialogPopup className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Filter</DialogTitle>

          <DialogDescription>
            Adjust filters to refine your results.
          </DialogDescription>
        </DialogHeader>

        <DialogPanel className="flex flex-col gap-5">
          {filterableColumns.map((col) => (
            <div key={col.id} className="flex flex-col gap-2">
              <Label>{col.label}</Label>

              <FilterField
                col={col}
                value={draft[col.id] ?? (col.multiple ? [] : "")}
                onValueChange={(value) => setValue(col.id, value)}
              />
            </div>
          ))}
        </DialogPanel>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" size="sm" onClick={handleClear}>
            Clear all
          </Button>

          <Button size="sm" onClick={handleApply}>
            Apply
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
