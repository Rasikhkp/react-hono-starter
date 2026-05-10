import { useNavigate } from "@tanstack/react-router";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CornerDownLeftIcon,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandDialogPopup,
  CommandDialogTrigger,
  CommandEmpty,
  CommandFooter,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
} from "@/shared/components/ui/command";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { Kbd, KbdGroup } from "./ui/cossui/kbd";

const items = [
  { value: "/admin", label: "Home" },
  { value: "/admin/users", label: "User" },
  { value: "/admin/permissions", label: "Permission" },
];

export function SearchCommand() {
  const isMobile = useMediaQuery("max-md");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandDialogTrigger
        render={
          <Button
            variant="outline"
            size={isMobile ? "icon" : "default"}
            className="rounded-full sm:w-52 sm:justify-between"
          >
            <div className="flex items-center gap-2">
              <Search />
              <span className="text-muted-foreground hidden sm:block">
                Search here...
              </span>
            </div>
            <div className="gap-1 items-center hidden sm:flex">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </div>
          </Button>
        }
      />

      <CommandDialogPopup>
        <Command items={items}>
          <CommandInput placeholder="Search..." />
          <CommandPanel>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandList>
              {(item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onClick={() => {
                    setOpen(false);
                    navigate({ to: item.value });
                  }}
                >
                  {item.label}
                </CommandItem>
              )}
            </CommandList>
          </CommandPanel>
          <CommandFooter>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <KbdGroup>
                  <Kbd>
                    <ArrowUpIcon />
                  </Kbd>
                  <Kbd>
                    <ArrowDownIcon />
                  </Kbd>
                </KbdGroup>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-2">
                <Kbd>
                  <CornerDownLeftIcon />
                </Kbd>
                <span>Open</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Kbd>Esc</Kbd>
              <span>Close</span>
            </div>
          </CommandFooter>
        </Command>
      </CommandDialogPopup>
    </CommandDialog>
  );
}
