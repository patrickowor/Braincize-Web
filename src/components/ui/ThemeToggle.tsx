"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";
import { useTheme } from "@/providers/ThemeProvider";

/** Light/dark switch. Both icons are in the DOM and CSS picks one, so it is correct before hydration. */
export function ThemeToggle({ className }: { className?: string }) {
  const { toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark theme"
      title="Toggle theme"
      className={cn(
        "flex size-[2.5rem] shrink-0 cursor-pointer items-center justify-center text-ink transition-colors hover:bg-ink/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        className,
      )}
    >
      <Moon className="size-[1.25rem] dark:hidden" aria-hidden />
      <Sun className="hidden size-[1.25rem] dark:block" aria-hidden />
    </button>
  );
}
