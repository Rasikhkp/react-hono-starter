import { Check, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/shared/components/ui/input";

function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

type DebounceInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onDebouncedChange?: (value: string) => void;
  debounceMs?: number;
  showStatus?: boolean;
  unstyled?: boolean;
};

export function DebounceInput({
  value: controlledValue,
  defaultValue = "",
  onChange,
  onDebouncedChange,
  debounceMs = 500,
  showStatus = true,
  className = "",
  unstyled = false,
  ...rest
}: DebounceInputProps) {
  const isControlled = controlledValue !== undefined;

  const [internalValue, setInternalValue] = useState<string>(
    isControlled ? controlledValue : defaultValue,
  );

  const rawValue = isControlled ? controlledValue : internalValue;

  useEffect(() => {
    if (isControlled) setInternalValue(controlledValue);
  }, [controlledValue, isControlled]);

  const debouncedValue = useDebounce(rawValue, debounceMs);

  const prevDebouncedRef = useRef(debouncedValue);

  const [isTyping, setIsTyping] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;

      if (!isControlled) setInternalValue(next);

      setIsTyping(true);
      setShowCheck(false);

      onChange?.(next);
    },
    [isControlled, onChange],
  );

  useEffect(() => {
    if (debouncedValue !== prevDebouncedRef.current) {
      prevDebouncedRef.current = debouncedValue;

      setIsTyping(false);

      onDebouncedChange?.(debouncedValue);

      // show checkmark briefly
      setShowCheck(true);
      const t = setTimeout(() => setShowCheck(false), 1200);

      return () => clearTimeout(t);
    }
  }, [debouncedValue, onDebouncedChange]);

  return (
    <div className="relative w-full">
      <Input
        value={rawValue}
        onChange={handleChange}
        className={className}
        unstyled={unstyled}
        {...rest}
      />

      {showStatus && rawValue.length > 0 && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          {isTyping && !showCheck && (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-500" />
          )}

          {showCheck && (
            <Check className="h-4 w-4 text-emerald-500 animate-in fade-in zoom-in duration-200" />
          )}
        </div>
      )}
    </div>
  );
}
