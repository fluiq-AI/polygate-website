"use client";

/**
 * A two-language code block for the docs.
 *
 * The landing page hand-writes its syntax colouring as JSX, which is fine for
 * three hero snippets and untenable for the ~80 examples across the docs. This
 * takes plain strings and tokenizes them, so a new provider page is data rather
 * than markup.
 *
 * The Python/TypeScript choice is shared across every block on a page via a
 * context, because a reader who picks TypeScript once should not have to pick
 * it again in every section.
 */

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type Lang = "python" | "typescript";

const LangContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
} | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("python");
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

function useLang() {
  const context = useContext(LangContext);
  if (!context) {
    // A block used outside a provider still renders, defaulting to Python,
    // rather than crashing the page over a presentation detail.
    return { lang: "python" as Lang, setLang: () => {} };
  }
  return context;
}

const COLORS = {
  keyword: "text-[#6FA8FF]",
  string: "text-[#8FD4A8]",
  comment: "text-[#6B6B66]",
  number: "text-[#D8A65D]",
  plain: "text-[#E8E8E3]",
};

const KEYWORDS = new Set([
  "import", "from", "const", "await", "async", "function", "return", "for",
  "in", "if", "else", "def", "class", "new", "let", "var", "export", "with",
  "as", "try", "except", "raise", "throw", "print", "console",
]);

/**
 * A deliberately small tokenizer: strings, comments, numbers, keywords.
 *
 * Not a parser. Highlighting code samples is a legibility aid, and the failure
 * mode of getting it slightly wrong is a mis-coloured word — so the simplest
 * thing that reads well beats a dependency an order of magnitude larger than
 * the library being documented.
 */
function highlight(line: string, lang: Lang): ReactNode[] {
  const out: ReactNode[] = [];
  const commentToken = lang === "python" ? "#" : "//";

  let rest = line;
  let key = 0;

  // A comment swallows the remainder of the line, so find it first — but not
  // when it sits inside a string, which is why the scan is character-wise.
  let commentAt = -1;
  let quote: string | null = null;
  for (let i = 0; i < rest.length; i += 1) {
    const char = rest[i];
    if (quote) {
      if (char === quote && rest[i - 1] !== "\\") quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (rest.startsWith(commentToken, i)) {
      commentAt = i;
      break;
    }
  }

  let comment = "";
  if (commentAt >= 0) {
    comment = rest.slice(commentAt);
    rest = rest.slice(0, commentAt);
  }

  const pattern = /("[^"]*"|'[^']*'|`[^`]*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(rest)) !== null) {
    if (match.index > last) {
      out.push(<span key={key++}>{rest.slice(last, match.index)}</span>);
    }
    const [text, str, num, word] = match;
    if (str) {
      out.push(<span key={key++} className={COLORS.string}>{text}</span>);
    } else if (num) {
      out.push(<span key={key++} className={COLORS.number}>{text}</span>);
    } else if (word && KEYWORDS.has(word)) {
      out.push(<span key={key++} className={COLORS.keyword}>{text}</span>);
    } else {
      out.push(<span key={key++}>{text}</span>);
    }
    last = match.index + text.length;
  }
  if (last < rest.length) {
    out.push(<span key={key++}>{rest.slice(last)}</span>);
  }
  if (comment) {
    out.push(<span key={key++} className={COLORS.comment}>{comment}</span>);
  }
  return out;
}

function Pane({ code, lang }: { code: string; lang: Lang }) {
  return (
    <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[12.5px] leading-[1.7]">
      <code className={COLORS.plain}>
        {code.split("\n").map((line, index) => (
          <div key={index}>{line ? highlight(line, lang) : " "}</div>
        ))}
      </code>
    </pre>
  );
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }}
      className="rounded-md px-2 py-1 text-[11px] text-[#9A9A92] transition-colors hover:text-white"
      aria-label="Copy code"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

/**
 * One example in both languages, with a switcher.
 *
 * `python` and `typescript` are both required: an example that exists in only
 * one language is a gap in the docs, and making it structurally impossible is
 * cheaper than noticing later.
 */
export default function DocsCode({
  python,
  typescript,
  title,
}: {
  python: string;
  typescript: string;
  title?: string;
}) {
  const { lang, setLang } = useLang();
  const code = lang === "python" ? python : typescript;

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#141414]">
      <div className="flex items-center justify-between border-b border-[#2A2A2A] px-3 py-1.5">
        <div className="flex items-center gap-1">
          {(["python", "typescript"] as Lang[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setLang(option)}
              className={`rounded-md px-2.5 py-1 text-[11.5px] transition-colors ${
                lang === option
                  ? "bg-[#2A2A2A] text-white"
                  : "text-[#9A9A92] hover:text-white"
              }`}
            >
              {option === "python" ? "Python" : "TypeScript"}
            </button>
          ))}
          {title ? (
            <span className="ml-2 text-[11.5px] text-[#6B6B66]">{title}</span>
          ) : null}
        </div>
        <CopyButton code={code} />
      </div>
      <Pane code={code} lang={lang} />
    </div>
  );
}

/** A single-language block, for shell commands and JSON. */
export function PlainCode({ code }: { code: string }) {
  return (
    <div className="my-4 overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#141414]">
      <div className="flex items-center justify-end border-b border-[#2A2A2A] px-3 py-1.5">
        <CopyButton code={code} />
      </div>
      <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[12.5px] leading-[1.7] text-[#E8E8E3]">
        <code>{code}</code>
      </pre>
    </div>
  );
}
