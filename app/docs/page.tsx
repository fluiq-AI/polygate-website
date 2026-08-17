import type { Metadata } from "next";
import Link from "next/link";
import DocsCode, { PlainCode } from "@/components/DocsCode";
import { DocsShell, H2, H3, Prose } from "@/components/DocsShell";
import { GROUPS, PROVIDERS, providersOfKind } from "@/lib/providers";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "polygate documentation: one function for 26 LLM providers, clouds and gateways. Install, call, retry, pool keys, batch and run concurrently — in Python and TypeScript.",
  alternates: { canonical: "/docs" },
};

const border = "border-[#E5E1D6] dark:border-[#2A2A2A]";
const muted = "text-[#6B6B66] dark:text-[#9A9A92]";

const install = `# Python
pip install polygate

# TypeScript
npm install polygate`;

const firstCall = {
  python: `import polygate

response = polygate.chat(
    provider="anthropic",
    model="claude-sonnet-4-5",
    messages=[{"role": "user", "content": "Say hi in one word."}],
)

print(response.content)    # "Hi!"
print(response.provider)   # "anthropic"
print(response.usage)      # Usage(prompt_tokens=12, completion_tokens=3, ...)`,
  typescript: `import { chat } from "polygate";

const response = await chat({
  provider: "anthropic",
  model: "claude-sonnet-4-5",
  messages: [{ role: "user", content: "Say hi in one word." }],
});

console.log(response.content);  // "Hi!"
console.log(response.provider); // "anthropic"
console.log(response.usage);    // { promptTokens: 12, completionTokens: 3, ... }`,
};

const switching = {
  python: `# The only thing that changes is the provider and the model.
for provider, model in [
    ("openai", "gpt-4o"),
    ("anthropic", "claude-sonnet-4-5"),
    ("groq", "llama-3.3-70b-versatile"),
    ("bedrock", "anthropic.claude-3-5-sonnet-20241022-v2:0"),
]:
    response = polygate.chat(
        provider=provider, model=model,
        messages=[{"role": "user", "content": "Say hi."}],
    )
    print(provider, response.content)`,
  typescript: `// The only thing that changes is the provider and the model.
const targets = [
  ["openai", "gpt-4o"],
  ["anthropic", "claude-sonnet-4-5"],
  ["groq", "llama-3.3-70b-versatile"],
  ["bedrock", "anthropic.claude-3-5-sonnet-20241022-v2:0"],
];

for (const [provider, model] of targets) {
  const response = await chat({
    provider, model,
    messages: [{ role: "user", content: "Say hi." }],
  });
  console.log(provider, response.content);
}`,
};

const retries = {
  python: `from polygate import chat, Retry

response = chat(
    provider="openai",
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}],
    # Omitted entirely means one request, one response, errors raised straight
    # through. Retry() opts into backoff on 429/5xx while still failing fast on
    # deterministic errors like a 400.
    retry=Retry(max_attempts=4),
)`,
  typescript: `import { chat } from "polygate";

const response = await chat({
  provider: "openai",
  model: "gpt-4o",
  messages: [{ role: "user", content: "Hello" }],
  // Omitted entirely means one request, one response, errors thrown straight
  // through. Passing a policy opts into backoff on 429/5xx while still failing
  // fast on deterministic errors like a 400.
  retry: { maxAttempts: 4 },
});`,
};

const pooling = {
  python: `# One key, a list of keys, or a comma-separated environment variable —
# all three are the same thing to polygate.
response = polygate.chat(
    provider="openai",
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}],
    api_key=["sk-one", "sk-two", "sk-three"],
)

# Requests rotate round-robin. A key the provider rejects (401/403) is dropped
# for the rest of the process; a rate-limited one (429) is parked for its
# Retry-After and traffic moves on immediately — which recovers faster than
# waiting out a backoff.`,
  typescript: `// One key, an array of keys, or a comma-separated environment variable —
// all three are the same thing to polygate.
const response = await chat({
  provider: "openai",
  model: "gpt-4o",
  messages: [{ role: "user", content: "Hello" }],
  apiKey: ["sk-one", "sk-two", "sk-three"],
});

// Requests rotate round-robin. A key the provider rejects (401/403) is dropped
// for the rest of the process; a rate-limited one (429) is parked for its
// Retry-After and traffic moves on immediately.`,
};

const errors = {
  python: `from polygate.exceptions import (
    MissingAPIKeyError,     # no key passed and none in the environment
    MissingEndpointError,   # a cloud provider called without its endpoint
    ProviderAPIError,       # the provider returned a non-2xx
    UnsupportedProviderError,
)

try:
    polygate.chat(provider="openai", model="gpt-4o", messages=[...])
except ProviderAPIError as error:
    print(error.provider, error.status_code, error.message)`,
  typescript: `import {
  MissingAPIKeyError,     // no key passed and none in the environment
  MissingEndpointError,   // a cloud provider called without its endpoint
  ProviderAPIError,       // the provider returned a non-2xx
  UnsupportedProviderError,
} from "polygate";

try {
  await chat({ provider: "openai", model: "gpt-4o", messages: [] });
} catch (error) {
  if (error instanceof ProviderAPIError) {
    console.log(error.provider, error.statusCode, error.message);
  }
}`,
};

const responseFields = [
  { field: "content", desc: "the assistant's reply text" },
  { field: "role", desc: 'always "assistant"' },
  { field: "model", desc: "the model that actually served the request" },
  { field: "provider", desc: "which provider served it" },
  { field: "usage", desc: "prompt, completion and total token counts" },
  { field: "raw", desc: "the untouched original provider response" },
];

export default function DocsIndex() {
  return (
    <DocsShell>
      <article className="max-w-2xl">
        <h1 className="text-[28px] font-semibold tracking-tight">Documentation</h1>
        <p className={`mt-2 text-[15px] ${muted}`}>
          One function, {PROVIDERS.length} providers, clouds and gateways — and
          anything you host yourself.
        </p>

        <H2>Install</H2>
        <PlainCode code={install} />
        <Prose>
          {`Python needs \`requests\`. TypeScript needs nothing — it uses the built-in \`fetch\`. That is the whole dependency list, which is the point: a client that unifies providers should not weigh more than the providers.`}
        </Prose>

        <H2>Your first call</H2>
        <DocsCode python={firstCall.python} typescript={firstCall.typescript} />
        <Prose>
          {`The key comes from \`ANTHROPIC_API_KEY\` here. Every provider has a standard variable — see its page — or pass \`api_key\` directly.`}
        </Prose>

        <H2>The response</H2>
        <Prose>
          {`Every provider returns the same shape, whatever it actually sent back. \`raw\` is the escape hatch: anything polygate does not normalize is still there, untouched.`}
        </Prose>
        <div className={`my-3 overflow-hidden rounded-xl border ${border}`}>
          <table className="w-full text-left text-[13px]">
            <tbody>
              {responseFields.map((row, index) => (
                <tr key={row.field} className={index ? `border-t ${border}` : ""}>
                  <td className="px-4 py-2 font-mono text-[12.5px]">{row.field}</td>
                  <td className={`px-4 py-2 ${muted}`}>{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <H2>Switching providers</H2>
        <Prose>
          {`This is the whole premise. Nothing about the call changes except the two strings naming where it goes.`}
        </Prose>
        <DocsCode python={switching.python} typescript={switching.typescript} />

        <H2>Retries</H2>
        <Prose>
          {`Retries are opt-in. A library that silently retries turns one request into several and one bill into several, so the default is exactly one attempt.`}
        </Prose>
        <DocsCode python={retries.python} typescript={retries.typescript} />

        <H2>Key pools</H2>
        <DocsCode python={pooling.python} typescript={pooling.typescript} />

        <H2>Errors</H2>
        <DocsCode python={errors.python} typescript={errors.typescript} />

        <H2>Many requests at once</H2>
        <Prose>
          {`Two different tools, often confused: an offline **batch** job at roughly half price, and **concurrent** dispatch when you want the answers now. See [Batching & concurrency](/docs/batching).`}
        </Prose>

        <H2>Providers</H2>
        {GROUPS.map((group) => (
          <section key={group.kind}>
            <H3>{group.title}</H3>
            <p className={`mb-3 text-[13.5px] leading-[1.7] ${muted}`}>{group.blurb}</p>
            <div className="mb-6 grid gap-2 sm:grid-cols-2">
              {providersOfKind(group.kind).map((provider) => (
                <Link
                  key={provider.id}
                  href={`/docs/${provider.id}`}
                  className={`rounded-xl border px-3.5 py-3 transition-colors hover:border-[#1860D3] dark:hover:border-[#6FA8FF] ${border}`}
                >
                  <p className="text-[13.5px] font-medium">{provider.name}</p>
                  <p className={`mt-0.5 text-[12.5px] leading-snug ${muted}`}>
                    {provider.tagline}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </article>
    </DocsShell>
  );
}
