"use client";

import { useRef, useState } from "react";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react/dist/ssr";

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
      className="group inline-flex items-center gap-2.5 rounded-lg border border-zinc-300 bg-zinc-50 px-3.5 py-2 font-mono text-[13px] text-zinc-700 transition-colors hover:border-zinc-400 active:scale-[0.98] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-500"
    >
      <span aria-hidden className="select-none text-zinc-400 dark:text-zinc-500">
        $
      </span>
      {command}
      {copied ? (
        <CheckIcon size={14} weight="bold" className="text-emerald-600 dark:text-emerald-400" />
      ) : (
        <CopyIcon
          size={14}
          className="text-zinc-400 transition-colors group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300"
        />
      )}
    </button>
  );
}
