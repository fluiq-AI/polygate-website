"use client";

import { useState } from "react";

type Lang = "python" | "typescript";

function Kw({ children }: { children: React.ReactNode }) {
  return <span className="text-sky-300">{children}</span>;
}
function Str({ children }: { children: React.ReactNode }) {
  return <span className="text-emerald-300">{children}</span>;
}
function Cmt({ children }: { children: React.ReactNode }) {
  return <span className="text-zinc-500">{children}</span>;
}
function Fn({ children }: { children: React.ReactNode }) {
  return <span className="text-zinc-100">{children}</span>;
}

const pythonSnippet = (
  <>
    <div>
      <Kw>from</Kw> polygate <Kw>import</Kw> chat
    </div>
    <div>&nbsp;</div>
    <div>
      response = <Fn>chat</Fn>(
    </div>
    <div>
      {"    "}provider=<Str>&quot;anthropic&quot;</Str>,{"  "}
      <Cmt># or &quot;openai&quot;, &quot;gemini&quot;, &quot;moonshot&quot;</Cmt>
    </div>
    <div>
      {"    "}model=<Str>&quot;claude-sonnet-4-6&quot;</Str>,
    </div>
    <div>
      {"    "}messages=[{"{"}
      <Str>&quot;role&quot;</Str>: <Str>&quot;user&quot;</Str>,{" "}
      <Str>&quot;content&quot;</Str>: <Str>&quot;Say hi in one word.&quot;</Str>
      {"}"}],
    </div>
    <div>)</div>
    <div>&nbsp;</div>
    <div>
      <Fn>print</Fn>(response.content){"   "}
      <Cmt># &quot;Hi!&quot;</Cmt>
    </div>
    <div>
      <Fn>print</Fn>(response.usage){"     "}
      <Cmt># Usage(prompt_tokens=..., ...)</Cmt>
    </div>
  </>
);

const typescriptSnippet = (
  <>
    <div>
      <Kw>import</Kw> {"{ chat }"} <Kw>from</Kw> <Str>&quot;polygate&quot;</Str>;
    </div>
    <div>&nbsp;</div>
    <div>
      <Kw>const</Kw> response = <Kw>await</Kw> <Fn>chat</Fn>({"{"}
    </div>
    <div>
      {"  "}provider: <Str>&quot;openai&quot;</Str>,{" "}
      <Cmt>{'// or "anthropic", "gemini", "moonshot"'}</Cmt>
    </div>
    <div>
      {"  "}model: <Str>&quot;gpt-4o&quot;</Str>,
    </div>
    <div>
      {"  "}messages: [{"{"} role: <Str>&quot;user&quot;</Str>, content:{" "}
      <Str>&quot;Say hi in one word.&quot;</Str> {"}"}],
    </div>
    <div>{"});"}</div>
    <div>&nbsp;</div>
    <div>
      console.<Fn>log</Fn>(response.content); <Cmt>{'// "Hi!"'}</Cmt>
    </div>
    <div>
      console.<Fn>log</Fn>(response.usage.total_tokens);
    </div>
  </>
);

export default function CodeTabs() {
  const [lang, setLang] = useState<Lang>("python");

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-lg shadow-zinc-950/40">
      <div className="flex items-center gap-1 border-b border-zinc-800 px-3 py-2">
        {(["python", "typescript"] as const).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={lang === l}
            className={`rounded-lg px-3 py-1.5 font-mono text-xs transition-colors ${
              lang === l
                ? "bg-zinc-800 text-zinc-100"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {l === "python" ? "Python" : "TypeScript"}
          </button>
        ))}
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-6 text-zinc-300">
        <code>{lang === "python" ? pythonSnippet : typescriptSnippet}</code>
      </pre>
    </div>
  );
}
