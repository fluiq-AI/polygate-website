import {
  ArrowUpRightIcon,
  GithubLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import CodeTabs from "@/components/CodeTabs";
import CopyCommand from "@/components/CopyCommand";

const GITHUB_URL = "https://github.com/SaurabhKumbhar24/polygate";
const PYPI_URL = "https://pypi.org/project/polygate/";
const NPM_URL = "https://www.npmjs.com/package/polygate";

const providers = [
  {
    name: "Anthropic",
    detail: "Claude models",
    aliases: ["anthropic", "claude"],
    env: "ANTHROPIC_API_KEY",
  },
  {
    name: "OpenAI",
    detail: "GPT models",
    aliases: ["openai", "gpt"],
    env: "OPENAI_API_KEY",
  },
  {
    name: "Google Gemini",
    detail: "Gemini models",
    aliases: ["gemini", "google"],
    env: "GEMINI_API_KEY",
  },
  {
    name: "Moonshot",
    detail: "Kimi models",
    aliases: ["moonshot", "kimi"],
    env: "MOONSHOT_API_KEY",
  },
];

const responseFields = [
  { field: "content", desc: "the assistant's reply text" },
  { field: "role", desc: 'always "assistant"' },
  { field: "model", desc: "the model that was actually used" },
  { field: "provider", desc: "which provider served the request" },
  { field: "usage", desc: "prompt, completion, and total token counts" },
  { field: "raw", desc: "the untouched original provider response" },
];

function ExternalLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      {/* Nav */}
      <header className="flex h-16 items-center justify-between">
        <span className="font-mono text-[15px] font-semibold tracking-tight">
          polygate
        </span>
        <nav className="flex items-center gap-5 text-sm text-zinc-500 dark:text-zinc-400">
          <ExternalLink
            href={PYPI_URL}
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            PyPI
          </ExternalLink>
          <ExternalLink
            href={NPM_URL}
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            npm
          </ExternalLink>
          <ExternalLink
            href={GITHUB_URL}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <GithubLogoIcon size={16} />
            GitHub
          </ExternalLink>
        </nav>
      </header>

      {/* Hero: asymmetric split, text left / code right */}
      <section className="grid items-center gap-10 pt-14 pb-20 sm:pt-20 lg:grid-cols-[5fr_6fr] lg:gap-14">
        <div>
          <h1 className="text-4xl font-semibold tracking-tighter text-balance md:text-5xl">
            One function.
            <br />
            Any LLM provider.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            A tiny, dependency-light client that gives Anthropic, OpenAI,
            Gemini, and Moonshot one consistent request and response shape.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ExternalLink
              href={GITHUB_URL}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 active:scale-[0.98] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              <GithubLogoIcon size={16} weight="fill" />
              GitHub
            </ExternalLink>
            <CopyCommand command="pip install polygate" />
            <CopyCommand command="npm install polygate" />
          </div>
        </div>
        <CodeTabs />
      </section>

      {/* Providers */}
      <section className="border-t border-zinc-200 py-20 dark:border-zinc-800">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Swap providers by changing one string
        </h2>
        <p className="mt-3 max-w-[60ch] text-zinc-600 dark:text-zinc-400">
          Every adapter translates the same message list into whatever shape
          the provider actually expects. API keys come from the argument or
          fall back to the environment.
        </p>
        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2 dark:border-zinc-800 dark:bg-zinc-800">
          {providers.map((p) => (
            <div
              key={p.name}
              className="bg-white p-6 transition-colors hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900/60"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-medium">{p.name}</h3>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {p.detail}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.aliases.map((a) => (
                  <code
                    key={a}
                    className="rounded-lg bg-zinc-100 px-2 py-1 font-mono text-xs text-emerald-700 dark:bg-zinc-900 dark:text-emerald-400"
                  >
                    &quot;{a}&quot;
                  </code>
                ))}
              </div>
              <p className="mt-4 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                {p.env}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
          Adding a provider is one adapter file and one registry line.{" "}
          <ExternalLink
            href={`${GITHUB_URL}/blob/main/CONTRIBUTING.md`}
            className="inline-flex items-center gap-0.5 font-medium text-emerald-700 transition-colors hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            Contribute one
            <ArrowUpRightIcon size={14} />
          </ExternalLink>
        </p>
      </section>

      {/* Unified response */}
      <section className="grid gap-10 border-t border-zinc-200 py-20 lg:grid-cols-2 lg:gap-16 dark:border-zinc-800">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Every call returns the same shape
          </h2>
          <p className="mt-3 max-w-[55ch] text-zinc-600 dark:text-zinc-400">
            No more learning four response formats. Anything a provider
            returns that polygate does not normalize is still there, untouched,
            under <code className="font-mono text-sm">raw</code>.
          </p>
          <p className="mt-3 max-w-[55ch] text-zinc-600 dark:text-zinc-400">
            Extra keyword arguments pass straight through to the provider, so
            provider-specific options like tools, top_p, or stop sequences
            keep working without polygate needing to know about them.
          </p>
        </div>
        <dl className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {responseFields.map((f) => (
            <div
              key={f.field}
              className="flex items-baseline gap-4 px-5 py-3.5"
            >
              <dt className="w-24 shrink-0 font-mono text-sm text-emerald-700 dark:text-emerald-400">
                {f.field}
              </dt>
              <dd className="text-sm text-zinc-600 dark:text-zinc-400">
                {f.desc}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Scope */}
      <section className="border-t border-zinc-200 py-20 dark:border-zinc-800">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Small on purpose
        </h2>
        <p className="mt-3 max-w-[65ch] text-zinc-600 dark:text-zinc-400">
          polygate is not trying to out-feature LiteLLM, Portkey, or Helicone.
          It is the smallest layer that normalizes requests and responses
          across providers, with each adapter readable in under 100 lines.
          Retries, caching, and routing are yours to build on top, with
          whatever opinions your project actually needs.
        </p>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <div className="rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900/60">
            <h3 className="text-sm font-medium">What it does</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-zinc-600 dark:text-zinc-400">
              <li>One chat function across all providers</li>
              <li>One message format, one response shape</li>
              <li>API keys from arguments or environment</li>
              <li>Passthrough for provider-specific options</li>
            </ul>
          </div>
          <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <h3 className="text-sm font-medium">
              What it leaves to you
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-zinc-600 dark:text-zinc-400">
              <li>Retries and backoff</li>
              <li>Caching and cost tracking</li>
              <li>Routing and fallback logic</li>
              <li>Framework integrations</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col gap-4 border-t border-zinc-200 py-10 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:text-zinc-400">
        <p>
          MIT licensed. Built by the team behind{" "}
          <ExternalLink
            href="https://getfluiq.com"
            className="font-medium text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
          >
            FluiqAI
          </ExternalLink>
          .
        </p>
        <nav className="flex items-center gap-5">
          <ExternalLink
            href={PYPI_URL}
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            PyPI
          </ExternalLink>
          <ExternalLink
            href={NPM_URL}
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            npm
          </ExternalLink>
          <ExternalLink
            href={GITHUB_URL}
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            GitHub
          </ExternalLink>
        </nav>
      </footer>
    </div>
  );
}
