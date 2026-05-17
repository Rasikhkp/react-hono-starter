import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import type { FilterableColumn } from "@/shared/types/dataTable";

type Props = {
  col: FilterableColumn;
  value: (string | number) | (string | number)[];
  onValueChange: (value: (string | number) | (string | number)[]) => void;
};

export function FilterField({ col, value, onValueChange }: Props) {
  switch (col.type) {
    case "select":
      return (
        <Select
          value={String(value)}
          onValueChange={(value) => value && onValueChange(value)}
        >
          <SelectTrigger id={`filter-${col.id}`}>
            <SelectValue placeholder={`All ${col.label}`} />
          </SelectTrigger>

          <SelectContent>
            {col.options.map((opt) => (
              <SelectItem key={opt.value} value={String(opt.value)}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "checkbox":
      return (
        <div className="flex flex-col gap-2">
          {col.options.map((opt) => (
            <div key={opt.value} className="flex items-center gap-2">
              <Checkbox
                id={`filter-${col.id}-${opt.value}`}
                checked={
                  Array.isArray(value) ? value.includes(opt.value) : false
                }
                onCheckedChange={(checked) => {
                  const current = Array.isArray(value) ? value : [];

                  onValueChange(
                    checked
                      ? [...current, opt.value]
                      : current.filter((v) => v !== opt.value),
                  );
                }}
              />

              <Label
                htmlFor={`filter-${col.id}-${opt.value}`}
                className="font-normal"
              >
                {opt.label}
              </Label>
            </div>
          ))}
        </div>
      );

    case "radio":
      return (
        <RadioGroup
          value={String(value)}
          onValueChange={onValueChange}
          className="flex flex-col gap-2"
        >
          {col.options.map((opt) => (
            <div key={opt.value} className="flex items-center gap-2">
              <RadioGroupItem
                id={`filter-${col.id}-${opt.value}`}
                value={String(opt.value)}
              />

              <Label
                htmlFor={`filter-${col.id}-${opt.value}`}
                className="font-normal"
              >
                {opt.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );
  }
}
