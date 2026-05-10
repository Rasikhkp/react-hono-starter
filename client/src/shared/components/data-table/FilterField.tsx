import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
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
  value: string | string[];
  onStringChange: (value: string) => void;
  onCheckboxChange: (value: string, checked: boolean) => void;
};

export function FilterField({
  col,
  value,
  onStringChange,
  onCheckboxChange,
}: Props) {
  switch (col.type) {
    case "text":
      return (
        <Input
          id={`filter-${col.id}`}
          placeholder={`Search ${col.label.toLowerCase()}...`}
          value={value as string}
          onChange={(e) => onStringChange(e.target.value)}
        />
      );

    case "select":
      return (
        <Select
          value={value as string}
          onValueChange={(v) => v && onStringChange(v)}
        >
          <SelectTrigger id={`filter-${col.id}`}>
            <SelectValue placeholder={`All ${col.label}`} />
          </SelectTrigger>
          <SelectContent>
            {col.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
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
                checked={(value as string[]).includes(opt.value)}
                onCheckedChange={(checked) =>
                  onCheckboxChange(opt.value, !!checked)
                }
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
          value={value as string}
          onValueChange={onStringChange}
          className="flex flex-col gap-2"
        >
          {col.options.map((opt) => (
            <div key={opt.value} className="flex items-center gap-2">
              <RadioGroupItem
                id={`filter-${col.id}-${opt.value}`}
                value={opt.value}
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
