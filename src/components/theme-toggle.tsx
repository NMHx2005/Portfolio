"use client";

import { Moon, Sun } from "lucide-react";
import { headerControl } from "@/components/ui/header-control";
import { useTheme } from "@/lib/use-theme";
import { cn } from "@/lib/utils";

export function ThemeToggle({ label }: { label: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(headerControl, "w-10 touch:w-11")}
    >
      <Sun className="hidden h-[18px] w-[18px] dark:block" aria-hidden />
      <Moon className="h-[18px] w-[18px] dark:hidden" aria-hidden />
    </button>
  );
}
