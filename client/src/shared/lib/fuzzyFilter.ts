import { rankItem } from "@tanstack/match-sorter-utils";
import type { FilterFn, RowData, TableFeatures } from "@tanstack/react-table";

export const fuzzyFilter: FilterFn<TableFeatures, RowData> = (
  row,
  columnId,
  value,
  addMeta,
) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta?.({ itemRank });

  return itemRank.passed;
};
