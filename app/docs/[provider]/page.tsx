import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DocsCode from "@/components/DocsCode";
import { DocsShell, H2, Note, Prose, inline } from "@/components/DocsShell";
import { PROVIDERS, chatExample, providerById } from "@/lib/providers";

/**
 * One page per provider.
 *
 * Generated from the registry rather than hand-written, so all 26 pages carry
 * the same sections in the same order — the thing a reader is really buying
 * from per-provider docs is knowing where to look without re-learning the
 * layout each time.
 */

export function generateStaticParams() {
  return PROVIDERS.map((provider) => ({ provider: provider.id }));
}

// Next 15 hands params in as a promise, even for a statically generated route.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ provider: string }>;
}): Promise<Metadata> {
  const { provider: id } = await params;
  const provider = providerById(id);
  if (!provider) return {};
  return {
    title: `${provider.name}`,
    description: `Call ${provider.name} with polygate — ${provider.tagline} Aliases, environment variables, models and examples in Python and TypeScript.`,
    alternates: { canonical: `/docs/${provider.id}` },
  };
}

const border = "border-[#E5E1D6] dark:border-[#2A2A2A]";
const muted = "text-[#6B6B66] dark:text-[#9A9A92]";

export default async function ProviderPage({
  params,
}: {
  params: Promise<{ provider: string }>;
}) {
  const { provider: id } = await params;
  const provider = providerById(id);
  if (!provider) notFound();

  const example = chatExample(provider);
  const envRows = [
    { name: provider.env, description: "your API key" },
    ...(provider.extraEnv ?? []),
  ];

  return (
    <DocsShell>
      <article className="max-w-2xl">
        <p className={`text-[12px] uppercase tracking-wide ${muted}`}>
          {provider.kind === "cloud"
            ? "Cloud"
            : provider.kind === "gateway"
              ? "Gateway"
              : provider.kind === "self-hosted"
                ? "Self-hosted"
                : "Provider"}
        </p>
        <h1 className="mt-1 text-[28px] font-semibold tracking-tight">
          {provider.name}
        </h1>
        <p className={`mt-2 text-[15px] ${muted}`}>{provider.tagline}</p>

        <H2>Quick start</H2>
        <DocsCode python={example.python} typescript={example.typescript} />

        <H2>Names</H2>
        <Prose>
          {`Any of these work as \`provider\`. They all reach the same adapter, so pick whichever reads best in your code.`}
        </Prose>
        <div className="my-3 flex flex-wrap gap-1.5">
          {provider.aliases.map((alias) => (
            <code
              key={alias}
              className={`rounded-md border px-2 py-1 font-mono text-[12px] ${border}`}
            >
              {alias}
            </code>
          ))}
        </div>

        <H2>Configuration</H2>
        <div className={`my-3 overflow-hidden rounded-xl border ${border}`}>
          <table className="w-full text-left text-[13px]">
            <thead className={`${muted} border-b ${border}`}>
              <tr>
                <th className="px-4 py-2 font-medium">Variable</th>
                <th className="px-4 py-2 font-medium">Holds</th>
              </tr>
            </thead>
            <tbody>
              {envRows.map((row) => (
                <tr key={row.name} className={`border-t ${border}`}>
                  <td className="px-4 py-2 font-mono text-[12.5px]">{row.name}</td>
                  <td className={`px-4 py-2 ${muted}`}>{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Prose>
          {`Any of these may hold a comma-separated list. polygate rotates across them, parks a rate-limited one for its \`Retry-After\`, and drops one the provider rejects — so a key pool is configuration, not code.`}
        </Prose>

        {provider.endpoint ? (
          <>
            <H2>Endpoint</H2>
            <p className="my-3 font-mono text-[13px]">{provider.endpoint}</p>
            <Prose>
              {`Pass \`base_url\` to point the same wire format somewhere else — a proxy, a regional endpoint, or a gateway in front of it.`}
            </Prose>
          </>
        ) : provider.endpointRequired ? (
          <>
            <H2>Endpoint</H2>
            <Prose>
              {`There is no fixed host: the URL contains your own account, workspace or project, so \`base_url\` is required. Omit it and polygate raises \`MissingEndpointError\` naming the variable to set, rather than letting the request fail somewhere less informative.`}
            </Prose>
          </>
        ) : null}

        <H2>Models</H2>
        <Prose>
          {provider.kind === "gateway"
            ? "Addressed `vendor/model`. These are examples — the gateway's own catalogue is the authority."
            : "Examples that work today. Model names change; the provider's own list is the authority."}
        </Prose>
        <div className="my-3 flex flex-wrap gap-1.5">
          {provider.models.map((model) => (
            <code
              key={model}
              className={`rounded-md border px-2 py-1 font-mono text-[12px] ${border}`}
            >
              {model}
            </code>
          ))}
        </div>

        {provider.notes?.length ? (
          <>
            <H2>Things worth knowing</H2>
            <ul className="my-3 list-disc space-y-1 pl-5">
              {provider.notes.map((note, index) => (
                <Note key={index}>{note}</Note>
              ))}
            </ul>
          </>
        ) : null}

        {provider.extraExample ? (
          <>
            <H2>{provider.extraExample.title}</H2>
            <DocsCode
              python={provider.extraExample.python}
              typescript={provider.extraExample.typescript}
            />
          </>
        ) : null}

        <H2>Batch</H2>
        <Prose>
          {provider.batch
            ? `${provider.name} has an offline batch tier at roughly half price. See [Batching & concurrency](/docs/batching).`
            : `${provider.name} has no offline batch API. To run many requests at once, use \`map_chat\` — full price, but it works everywhere and returns in seconds. See [Batching & concurrency](/docs/batching).`}
        </Prose>

        <div className={`mt-12 border-t pt-6 text-[13px] ${border} ${muted}`}>
          {inline(
            "Something wrong or missing here? [Open an issue](https://github.com/SaurabhKumbhar24/polygate/issues)."
          )}
        </div>
      </article>
    </DocsShell>
  );
}
