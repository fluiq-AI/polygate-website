"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Moon02Icon, Sun01Icon } from "@hugeicons/core-free-icons";

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // localStorage unavailable: theme just won't persist
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex size-8 items-center justify-center rounded-lg border border-[#E5E1D6] text-[#6B6B66] transition-colors hover:bg-[#F2F0E9] hover:text-[#0a0a0a] dark:border-[#2A2A2A] dark:text-[#9A9A92] dark:hover:bg-[#1A1A1A] dark:hover:text-[#FAF9F6]"
    >
      {/* Render both icons and swap via CSS so SSR markup is theme-independent */}
      <HugeiconsIcon icon={Sun01Icon} size={15} className="hidden dark:block" />
      <HugeiconsIcon icon={Moon02Icon} size={15} className="block dark:hidden" />
    </button>
  );
}
