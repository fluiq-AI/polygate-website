import Link from "next/link";
import type { ReactNode } from "react";
import { GROUPS, PROVIDERS } from "@/lib/providers";
import { LangProvider } from "@/components/DocsCode";

/**
 * The frame every docs page sits in: header, sidebar, content column.
 *
 * The sidebar is generated from the provider registry, so a provider added to
 * `lib/providers.ts` gets a page, a nav entry and a sitemap entry without
 * anyone remembering to add three things.
 */

const muted = "text-[#6B6B66] dark:text-[#9A9A92]";
const border = "border-[#E5E1D6] dark:border-[#2A2A2A]";

const GUIDES = [
  { href: "/docs", label: "Overview" },
  { href: "/docs/batching", label: "Batching & concurrency" },
];

export function DocsShell({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <header className={`flex h-16 items-center justify-between border-b ${border}`}>
          <Link href="/" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="polygate logo" className="size-7 rounded-lg" />
            <span className="text-[15px] font-semibold tracking-tight">polygate</span>
          </Link>
          <nav className={`flex items-center gap-5 text-[13px] ${muted}`}>
            <Link href="/docs" className="transition-colors hover:text-[#0a0a0a] dark:hover:text-white">
              Docs
            </Link>
            <a
              href="https://github.com/SaurabhKumbhar24/polygate"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#0a0a0a] dark:hover:text-white"
            >
              GitHub
            </a>
          </nav>
        </header>

        <div className="flex gap-10">
          <aside className="hidden w-56 shrink-0 py-8 lg:block">
            <nav className="sticky top-8 space-y-6 text-[13px]">
              <div>
                <p className={`mb-2 text-[11px] font-medium uppercase tracking-wide ${muted}`}>
                  Guides
                </p>
                <ul className="space-y-1.5">
                  {GUIDES.map((guide) => (
                    <li key={guide.href}>
                      <Link
                        href={guide.href}
                        className={`transition-colors hover:text-[#0a0a0a] dark:hover:text-white ${muted}`}
                      >
                        {guide.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {GROUPS.map((group) => (
                <div key={group.kind}>
                  <p className={`mb-2 text-[11px] font-medium uppercase tracking-wide ${muted}`}>
                    {group.title}
                  </p>
                  <ul className="space-y-1.5">
                    {PROVIDERS.filter((p) => p.kind === group.kind).map((provider) => (
                      <li key={provider.id}>
                        <Link
                          href={`/docs/${provider.id}`}
                          className={`transition-colors hover:text-[#0a0a0a] dark:hover:text-white ${muted}`}
                        >
                          {provider.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          <main className="min-w-0 flex-1 py-8 pb-24">{children}</main>
        </div>
      </div>
    </LangProvider>
  );
}

/** Body copy with `code`, **bold** and [links](/docs/x) rendered. */
export function Prose({ children }: { children: string }) {
  return <p className="my-3 text-[14px] leading-[1.75]">{inline(children)}</p>;
}

/**
 * A deliberately tiny inline-markdown renderer.
 *
 * The notes in the provider registry are written as prose with backticks and
 * the occasional link, because that is how they read best in the source file
 * too. Pulling in a markdown library to render three constructs would be more
 * dependency than the site has anywhere else.
 */
export function inline(text: string): ReactNode[] {
  const pattern = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g;
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) out.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith("`")) {
      out.push(
        <code
          key={key++}
          className="rounded bg-[#F0EDE4] px-1 py-0.5 font-mono text-[12.5px] dark:bg-[#1F1F1F]"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("**")) {
      out.push(
        <strong key={key++} className="font-semibold">
          {token.slice(2, -2)}
        </strong>
      );
    } else {
      const label = token.slice(1, token.indexOf("]"));
      const href = token.slice(token.indexOf("(") + 1, -1);
      out.push(
        <Link
          key={key++}
          href={href}
          className="text-[#1860D3] underline-offset-2 hover:underline dark:text-[#6FA8FF]"
        >
          {label}
        </Link>
      );
    }
    last = match.index + token.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-10 mb-3 text-[19px] font-semibold tracking-tight">{children}</h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="mt-7 mb-2 text-[15px] font-semibold">{children}</h3>;
}

export function Note({ children }: { children: string }) {
  return (
    <li className="my-2 text-[14px] leading-[1.75]">{inline(children)}</li>
  );
}
