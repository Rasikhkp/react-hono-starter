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

type DraftFilters = Record<string, string | string[]>;

function getInitialDraft(
  filterableColumns: FilterableColumn[],
  table: Table<unknown>,
): DraftFilters {
  const draft: DraftFilters = {};
  for (const col of filterableColumns) {
    const active = table.getColumn(col.id)?.getFilterValue();
    draft[col.id] =
      col.type === "checkbox"
        ? Array.isArray(active)
          ? active
          : []
        : typeof active === "string"
          ? active
          : "";
  }
  return draft;
}

export function DataTableFilterDialog<TData>({
  table,
  filterableColumns,
}: Props<TData>) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DraftFilters>({});

  console.log("draft", draft);

  useEffect(() => {
    if (!open) return;
    setDraft(getInitialDraft(filterableColumns, table as Table<unknown>));
  }, [open, filterableColumns, table]);

  const activeFilterCount = filterableColumns.filter((col) => {
    const val = table.getColumn(col.id)?.getFilterValue();
    return Array.isArray(val) ? val.length > 0 : !!val;
  }).length;

  function setStringValue(id: string, value: string) {
    setDraft((prev) => ({ ...prev, [id]: value }));
  }

  function toggleCheckboxValue(id: string, value: string, checked: boolean) {
    setDraft((prev) => {
      const current = (prev[id] as string[]) ?? [];
      return {
        ...prev,
        [id]: checked
          ? [...current, value]
          : current.filter((v) => v !== value),
      };
    });
  }

  function handleApply() {
    for (const col of filterableColumns) {
      const value = draft[col.id];
      if (col.type === "checkbox") {
        const arr = value as string[];
        table
          .getColumn(col.id)
          ?.setFilterValue(arr.length > 0 ? arr : undefined);
      } else {
        table.getColumn(col.id)?.setFilterValue((value as string) || undefined);
      }
    }
    table.setPageIndex(0);
    setOpen(false);
  }

  function handleClear() {
    setDraft(
      filterableColumns.reduce<DraftFilters>((acc, col) => {
        acc[col.id] = col.type === "checkbox" ? [] : "";
        return acc;
      }, {}),
    );
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
                value={draft[col.id] ?? (col.type === "checkbox" ? [] : "")}
                onStringChange={(v) => setStringValue(col.id, v)}
                onCheckboxChange={(v, checked) =>
                  toggleCheckboxValue(col.id, v, checked)
                }
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
