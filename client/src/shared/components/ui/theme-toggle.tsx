import { useAtom } from "jotai";
import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { themeAtom } from "@/shared/atoms/themeAtom";
import { Button } from "@/shared/components/ui/button";

export function ThemeToggle() {
  const [theme, setTheme] = useAtom(themeAtom);

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");

      const root = window.document.documentElement;
      root.className = "";
      root.classList.add("dark");
    } else {
      setTheme("light");

      const root = window.document.documentElement;
      root.className = "";
      root.classList.add("light");
    }
  };

  useEffect(() => {
    const theme = localStorage.getItem("theme") || "";

    const root = window.document.documentElement;
    root.className = "";

    if (theme === '"light"') {
      root.classList.add("light");
    }

    if (theme === '"dark"') {
      root.classList.add("dark");
    }
  }, []);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={cycleTheme}
      className="rounded-full"
      title={`Current theme: ${theme}. Click to cycle.`}
    >
      {theme === "light" && <Sun />}
      {theme === "dark" && <Moon />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
