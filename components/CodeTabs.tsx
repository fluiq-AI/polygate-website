"use client";

import { useState } from "react";

type Lang = "python" | "typescript";

function Kw({ children }: { children: React.ReactNode }) {
  return <span className="text-[#6FA8FF]">{children}</span>;
}
function Str({ children }: { children: React.ReactNode }) {
  return <span className="text-[#8FD4A8]">{children}</span>;
}
function Cmt({ children }: { children: React.ReactNode }) {
  return <span className="text-[#6B6B66]">{children}</span>;
}
function Fn({ children }: { children: React.ReactNode }) {
  return <span className="text-[#FAF9F6]">{children}</span>;
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

export const reliabilityPython = (
  <>
    <div>
      <Kw>from</Kw> polygate <Kw>import</Kw> chat, Retry
    </div>
    <div>&nbsp;</div>
    <div>
      response = <Fn>chat</Fn>(
    </div>
    <div>
      {"    "}provider=<Str>&quot;anthropic&quot;</Str>,
    </div>
    <div>
      {"    "}model=<Str>&quot;claude-sonnet-4-6&quot;</Str>,
    </div>
    <div>
      {"    "}messages=[{"{"}
      <Str>&quot;role&quot;</Str>: <Str>&quot;user&quot;</Str>,{" "}
      <Str>&quot;content&quot;</Str>: <Str>&quot;Say hi.&quot;</Str>
      {"}"}],
    </div>
    <div>&nbsp;</div>
    <div>
      {"    "}<Cmt># One key, a list, or a reusable KeyPool.</Cmt>
    </div>
    <div>
      {"    "}api_key=[<Str>&quot;sk-1&quot;</Str>, <Str>&quot;sk-2&quot;</Str>,{" "}
      <Str>&quot;sk-3&quot;</Str>],
    </div>
    <div>&nbsp;</div>
    <div>
      {"    "}<Cmt># Omit retry= for the old behavior: one request, no retries.</Cmt>
    </div>
    <div>
      {"    "}retry=<Fn>Retry</Fn>(max_attempts=<Str>4</Str>),
    </div>
    <div>)</div>
  </>
);

export const reliabilityTypescript = (
  <>
    <div>
      <Kw>import</Kw> {"{ chat }"} <Kw>from</Kw> <Str>&quot;polygate&quot;</Str>;
    </div>
    <div>&nbsp;</div>
    <div>
      <Kw>const</Kw> response = <Kw>await</Kw> <Fn>chat</Fn>({"{"}
    </div>
    <div>
      {"  "}provider: <Str>&quot;anthropic&quot;</Str>,
    </div>
    <div>
      {"  "}model: <Str>&quot;claude-sonnet-4-6&quot;</Str>,
    </div>
    <div>
      {"  "}messages: [{"{"} role: <Str>&quot;user&quot;</Str>, content:{" "}
      <Str>&quot;Say hi.&quot;</Str> {"}"}],
    </div>
    <div>&nbsp;</div>
    <div>
      {"  "}<Cmt>{'// One key, a list, or a reusable KeyPool.'}</Cmt>
    </div>
    <div>
      {"  "}apiKey: [<Str>&quot;sk-1&quot;</Str>, <Str>&quot;sk-2&quot;</Str>,{" "}
      <Str>&quot;sk-3&quot;</Str>],
    </div>
    <div>&nbsp;</div>
    <div>
      {"  "}<Cmt>{'// Omit retry for the old behavior: one request, no retries.'}</Cmt>
    </div>
    <div>
      {"  "}retry: {"{"} maxAttempts: <Str>4</Str> {"}"},
    </div>
    <div>{"});"}</div>
  </>
);

export default function CodeTabs({
  python = pythonSnippet,
  typescript = typescriptSnippet,
}: {
  python?: React.ReactNode;
  typescript?: React.ReactNode;
} = {}) {
  const [lang, setLang] = useState<Lang>("python");

  return (
    <div
      className="overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#111111]"
      style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center gap-1 border-b border-[#2A2A2A] px-3 py-2">
        {(["python", "typescript"] as const).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={lang === l}
            className={`rounded-lg px-3 py-1.5 font-mono text-xs transition-colors ${
              lang === l
                ? "bg-[#1A1A1A] text-[#FAF9F6]"
                : "text-[#9A9A92] hover:text-[#FAF9F6]"
            }`}
          >
            {l === "python" ? "Python" : "TypeScript"}
          </button>
        ))}
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-6 text-[#D6D3CB]">
        <code>{lang === "python" ? python : typescript}</code>
      </pre>
    </div>
  );
}
