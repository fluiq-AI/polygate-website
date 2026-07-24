import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon, GithubIcon } from "@hugeicons/core-free-icons";
import CodeTabs, {
  reliabilityPython,
  reliabilityTypescript,
} from "@/components/CodeTabs";
import CopyCommand from "@/components/CopyCommand";
import ThemeToggle from "@/components/ThemeToggle";

const GITHUB_URL = "https://github.com/SaurabhKumbhar24/polygate";
const PYPI_URL = "https://pypi.org/project/polygate/";
const NPM_URL = "https://www.npmjs.com/package/polygate";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "polygate",
  description:
    "A tiny, dependency-light open-source client that gives Anthropic, OpenAI, Google Gemini, and Moonshot one consistent request and response shape.",
  url: "https://polygate.getfluiq.com",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  softwareVersion: "0.1.0",
  license: "https://opensource.org/licenses/MIT",
  programmingLanguage: ["Python", "TypeScript"],
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: {
    "@type": "Person",
    name: "Saurabh Kumbhar",
    url: "https://github.com/SaurabhKumbhar24",
  },
  sameAs: [GITHUB_URL, PYPI_URL, NPM_URL],
};

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

const mutedText = "text-[#6B6B66] dark:text-[#9A9A92]";
const borderCls = "border-[#E5E1D6] dark:border-[#2A2A2A]";
const hoverFg = "hover:text-[#0a0a0a] dark:hover:text-[#FAF9F6]";
const accentText = "text-[#1860D3] dark:text-[#6FA8FF]";

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Nav */}
      <header className="flex h-16 items-center justify-between">
        <span className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="polygate logo" className="size-7 rounded-lg" />
          <span className="text-[15px] font-semibold tracking-tight">
            polygate
          </span>
        </span>
        <nav
          className={`flex items-center gap-5 text-[13px] ${mutedText}`}
        >
          <ExternalLink href={PYPI_URL} className={`transition-colors ${hoverFg}`}>
            PyPI
          </ExternalLink>
          <ExternalLink href={NPM_URL} className={`transition-colors ${hoverFg}`}>
            npm
          </ExternalLink>
          <ExternalLink
            href={GITHUB_URL}
            className={`inline-flex items-center gap-1.5 transition-colors ${hoverFg}`}
          >
            <HugeiconsIcon icon={GithubIcon} size={16} />
            GitHub
          </ExternalLink>
          <ThemeToggle />
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
          <p className={`mt-5 max-w-md text-base leading-relaxed ${mutedText}`}>
            A tiny, dependency-light client that gives Anthropic, OpenAI,
            Gemini, and Moonshot one consistent request and response shape.
          </p>
          <ExternalLink
              href={GITHUB_URL}
              className="inline-flex mt-8 items-center gap-2 rounded-lg bg-[#0a0a0a] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1a1a1a] active:scale-[0.98] dark:bg-[#FAF9F6] dark:text-[#0A0A0A] dark:hover:bg-[#F2F0E9]"
            >
              <HugeiconsIcon icon={GithubIcon} size={16} />
              GitHub
          </ExternalLink>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <CopyCommand command="pip install polygate" />
            <CopyCommand command="npm install polygate" />
          </div>
        </div>
        <CodeTabs />
      </section>

      {/* Providers */}
      <section className={`border-t py-20 ${borderCls}`}>
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Swap providers by changing one string
        </h2>
        <p className={`mt-3 max-w-[60ch] ${mutedText}`}>
          Every adapter translates the same message list into whatever shape
          the provider actually expects. API keys come from the argument or
          fall back to the environment.
        </p>
        <div
          className={`mt-10 grid gap-px overflow-hidden rounded-2xl border bg-[#E5E1D6] sm:grid-cols-2 dark:bg-[#2A2A2A] ${borderCls}`}
        >
          {providers.map((p) => (
            <div
              key={p.name}
              className="bg-white p-6 transition-colors hover:bg-[#F2F0E9] dark:bg-[#111111] dark:hover:bg-[#1A1A1A]"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-medium">{p.name}</h3>
                <span className={`text-sm ${mutedText}`}>{p.detail}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.aliases.map((a) => (
                  <code
                    key={a}
                    className={`rounded-lg bg-[#F2F0E9] px-2 py-1 font-mono text-xs dark:bg-[#0A0A0A] ${accentText}`}
                  >
                    &quot;{a}&quot;
                  </code>
                ))}
              </div>
              <p className={`mt-4 font-mono text-xs ${mutedText}`}>{p.env}</p>
            </div>
          ))}
        </div>
        <p className={`mt-6 text-sm ${mutedText}`}>
          Adding a provider is one adapter file and one registry line.{" "}
          <ExternalLink
            href={`${GITHUB_URL}/blob/main/CONTRIBUTING.md`}
            className={`inline-flex items-center gap-0.5 font-medium transition-opacity hover:opacity-80 ${accentText}`}
          >
            Contribute one
            <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} />
          </ExternalLink>
        </p>
      </section>

      {/* Unified response */}
      <section
        className={`grid gap-10 border-t py-20 lg:grid-cols-2 lg:gap-16 ${borderCls}`}
      >
        <div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Every call returns the same shape
          </h2>
          <p className={`mt-3 max-w-[55ch] ${mutedText}`}>
            No more learning four response formats. Anything a provider
            returns that polygate does not normalize is still there, untouched,
            under <code className="font-mono text-sm">raw</code>.
          </p>
          <p className={`mt-3 max-w-[55ch] ${mutedText}`}>
            Extra keyword arguments pass straight through to the provider, so
            provider-specific options like tools, top_p, or stop sequences
            keep working without polygate needing to know about them.
          </p>
        </div>
        <dl
          className={`divide-y divide-[#E5E1D6] rounded-2xl border dark:divide-[#2A2A2A] ${borderCls}`}
        >
          {responseFields.map((f) => (
            <div key={f.field} className="flex items-baseline gap-4 px-5 py-3.5">
              <dt className={`w-24 shrink-0 font-mono text-sm ${accentText}`}>
                {f.field}
              </dt>
              <dd className={`text-sm ${mutedText}`}>{f.desc}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Reliability */}
      <section className={`grid gap-10 border-t py-20 lg:grid-cols-2 lg:gap-16 ${borderCls}`}>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Rotate keys, ride out rate limits
          </h2>
          <p className={`mt-3 max-w-[55ch] ${mutedText}`}>
            A rate limit is per key, not per host. Sleeping through a 429 while
            another key sits idle wastes the whole backoff window, so polygate
            rotates first and only backs off once it runs out of keys.
          </p>
          <p className={`mt-3 max-w-[55ch] ${mutedText}`}>
            A key the provider rejects outright is dropped for the rest of the
            process rather than retried forever. Deterministic failures are
            never retried at all: a 400, 404, or 422 cannot succeed on a second
            attempt, so sending it again just bills you twice.
          </p>
          <p className={`mt-3 max-w-[55ch] ${mutedText}`}>
            Both features are off unless you ask for them. A single{" "}
            <code className="font-mono text-sm">api_key</code> with no{" "}
            <code className="font-mono text-sm">retry</code> behaves exactly as
            it always has.
          </p>
        </div>
        <CodeTabs python={reliabilityPython} typescript={reliabilityTypescript} />
      </section>

      {/* Scope */}
      <section className={`border-t py-20 ${borderCls}`}>
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Small on purpose
        </h2>
        <p className={`mt-3 max-w-[65ch] ${mutedText}`}>
          polygate is not trying to out-feature LiteLLM, Portkey, or Helicone.
          It is the smallest layer that normalizes requests and responses
          across providers, with each adapter readable in under 100 lines.
          Key rotation and backoff are opt-in and off by default; caching and
          routing are still yours to build on top, with whatever opinions your
          project actually needs.
        </p>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <div className="rounded-2xl bg-[#F2F0E9] p-6 dark:bg-[#111111]">
            <h3 className="text-sm font-medium">What it does</h3>
            <ul className={`mt-4 space-y-2.5 text-sm ${mutedText}`}>
              <li>One chat function across all providers</li>
              <li>One message format, one response shape</li>
              <li>API keys from arguments or environment</li>
              <li>Passthrough for provider-specific options</li>
            </ul>
          </div>
          <div className={`rounded-2xl border p-6 ${borderCls}`}>
            <h3 className="text-sm font-medium">What it leaves to you</h3>
            <ul className={`mt-4 space-y-2.5 text-sm ${mutedText}`}>
              <li>Retries and backoff</li>
              <li>Caching and cost tracking</li>
              <li>Routing and fallback logic</li>
              <li>Framework integrations</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`flex flex-col gap-4 border-t py-10 text-[13px] sm:flex-row sm:items-center sm:justify-between ${borderCls} ${mutedText}`}
      >
        <p>
          MIT licensed. Built by the team behind{" "}
          <ExternalLink
            href="https://getfluiq.com"
            className={`font-medium text-[#0a0a0a] transition-opacity hover:opacity-80 dark:text-[#FAF9F6]`}
          >
            FluiqAI
          </ExternalLink>
          .
        </p>
        <nav className="flex items-center gap-5">
          <ExternalLink href={PYPI_URL} className={`transition-colors ${hoverFg}`}>
            PyPI
          </ExternalLink>
          <ExternalLink href={NPM_URL} className={`transition-colors ${hoverFg}`}>
            npm
          </ExternalLink>
          <ExternalLink href={GITHUB_URL} className={`transition-colors ${hoverFg}`}>
            GitHub
          </ExternalLink>
        </nav>
      </footer>
    </div>
  );
}
