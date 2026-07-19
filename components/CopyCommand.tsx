"use client";

import { useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";

export default function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable (permissions, http): silently ignore
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy command: ${command}`}
      className="group inline-flex items-center gap-2.5 rounded-lg border border-[#E5E1D6] bg-white px-3.5 py-2 font-mono text-[13px] text-[#0a0a0a] transition-colors hover:bg-[#F2F0E9] active:scale-[0.98] dark:border-[#2A2A2A] dark:bg-[#111111] dark:text-[#FAF9F6] dark:hover:bg-[#1A1A1A]"
    >
      <span aria-hidden className="select-none text-[#9A9A92]">
        $
      </span>
      {command}
      {copied ? (
        <HugeiconsIcon
          icon={Tick02Icon}
          size={14}
          className="text-[#1860D3] dark:text-[#6FA8FF]"
        />
      ) : (
        <HugeiconsIcon
          icon={Copy01Icon}
          size={14}
          className="text-[#9A9A92] transition-colors group-hover:text-[#0a0a0a] dark:group-hover:text-[#FAF9F6]"
        />
      )}
    </button>
  );
}
