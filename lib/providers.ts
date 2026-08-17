/**
 * Every provider polygate speaks to, and everything the docs need to say about
 * it.
 *
 * One file rather than one per page, because the same facts appear in four
 * places — the landing grid, the docs index, the provider page, and the
 * sitemap — and four copies drift. A provider added here appears everywhere.
 *
 * Kept in step with `sdk/python/polygate/providers/__init__.py`. If the two
 * disagree, the SDK is right and this is stale.
 */

export type ProviderKind = "direct" | "cloud" | "gateway" | "self-hosted";

export interface ProviderDoc {
  /** URL slug and canonical provider name passed to `chat()`. */
  id: string;
  name: string;
  kind: ProviderKind;
  /** One line, used as the page subtitle and the card description. */
  tagline: string;
  aliases: string[];
  env: string;
  /** Extra environment variables this provider needs, with what they hold. */
  extraEnv?: { name: string; description: string }[];
  /** Model ids that actually work, for copy-paste. */
  models: string[];
  /** The endpoint, when there is a fixed one. */
  endpoint?: string;
  /** Whether an endpoint must be supplied before the provider can be called. */
  endpointRequired?: boolean;
  /** Does this provider have an offline batch tier? */
  batch?: boolean;
  /**
   * Things that will otherwise cost someone an afternoon. Kept short and
   * specific — a note that says "configure your API key" helps nobody.
   */
  notes?: string[];
  /** Extra example beyond the standard chat call, when the provider needs one. */
  extraExample?: { title: string; python: string; typescript: string };
}

const DIRECT: ProviderDoc[] = [
  {
    id: "openai",
    name: "OpenAI",
    kind: "direct",
    tagline: "GPT and o-series models.",
    aliases: ["openai", "gpt"],
    env: "OPENAI_API_KEY",
    endpoint: "https://api.openai.com/v1",
    models: ["gpt-4o", "gpt-4o-mini", "o3-mini"],
    batch: true,
  },
  {
    id: "anthropic",
    name: "Anthropic",
    kind: "direct",
    tagline: "Claude models.",
    aliases: ["anthropic", "claude"],
    env: "ANTHROPIC_API_KEY",
    endpoint: "https://api.anthropic.com/v1/messages",
    models: ["claude-sonnet-4-5", "claude-opus-4-5", "claude-haiku-4-5"],
    batch: true,
    notes: [
      "Anthropic takes the system prompt as its own top-level field. polygate moves any `system` message out of the list for you, so the same message array works here as everywhere else.",
      "`max_tokens` is required by the Messages API. polygate supplies a default when you omit it.",
    ],
  },
  {
    id: "gemini",
    name: "Google Gemini",
    kind: "direct",
    tagline: "Gemini models, via the Developer API.",
    aliases: ["gemini", "google"],
    env: "GEMINI_API_KEY",
    endpoint: "https://generativelanguage.googleapis.com/v1beta",
    models: ["gemini-2.0-flash", "gemini-2.5-pro"],
    notes: [
      "This is the Gemini Developer API, which takes a plain API key. Gemini through Google Cloud is a different product with different auth — see [Vertex AI](/docs/vertex).",
    ],
  },
  {
    id: "mistral",
    name: "Mistral",
    kind: "direct",
    tagline: "Mistral and Codestral models.",
    aliases: ["mistral"],
    env: "MISTRAL_API_KEY",
    endpoint: "https://api.mistral.ai/v1",
    models: ["mistral-large-latest", "mistral-small-latest"],
  },
  {
    id: "groq",
    name: "Groq",
    kind: "direct",
    tagline: "Open models on LPU silicon, very fast.",
    aliases: ["groq"],
    env: "GROQ_API_KEY",
    endpoint: "https://api.groq.com/openai/v1",
    models: ["llama-3.3-70b-versatile", "openai/gpt-oss-120b"],
    batch: true,
    notes: [
      "Groq hosts other people's models, so a model id names no host. `llama-3.3-70b-versatile` is not identifiable as Groq's from the name alone — always pass `provider` explicitly.",
      "Groq's batch tier accepts a 7-day completion window as well as 24 hours, and polygate asks for the longer one: under load a 24h job is likelier to expire than to finish, and an expired batch has to be resubmitted whole.",
    ],
  },
  {
    id: "together",
    name: "Together AI",
    kind: "direct",
    tagline: "A large catalogue of open models.",
    aliases: ["together", "togetherai"],
    env: "TOGETHER_API_KEY",
    endpoint: "https://api.together.xyz/v1",
    models: ["meta-llama/Llama-3.3-70B-Instruct-Turbo"],
  },
  {
    id: "fireworks",
    name: "Fireworks",
    kind: "direct",
    tagline: "Open models, tuned for throughput.",
    aliases: ["fireworks"],
    env: "FIREWORKS_API_KEY",
    endpoint: "https://api.fireworks.ai/inference/v1",
    models: ["accounts/fireworks/models/llama-v3p3-70b-instruct"],
  },
  {
    id: "perplexity",
    name: "Perplexity",
    kind: "direct",
    tagline: "Sonar models, which search the web while answering.",
    aliases: ["perplexity", "sonar", "pplx"],
    env: "PERPLEXITY_API_KEY",
    endpoint: "https://api.perplexity.ai",
    models: ["sonar", "sonar-pro", "sonar-reasoning"],
    notes: [
      "The host has no `/v1` segment — an unusual shape polygate handles for you.",
      "These models cite their sources. The citations are not part of `content`; read them from `response.raw`.",
    ],
  },
  {
    id: "xai",
    name: "xAI",
    kind: "direct",
    tagline: "Grok models.",
    aliases: ["xai", "grok"],
    env: "XAI_API_KEY",
    endpoint: "https://api.x.ai/v1",
    models: ["grok-4", "grok-3-mini"],
  },
  {
    id: "cerebras",
    name: "Cerebras",
    kind: "direct",
    tagline: "Open models on wafer-scale hardware.",
    aliases: ["cerebras"],
    env: "CEREBRAS_API_KEY",
    endpoint: "https://api.cerebras.ai/v1",
    models: ["llama-3.3-70b", "qwen-3-235b-a22b-instruct"],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    kind: "direct",
    tagline: "DeepSeek chat and reasoning models.",
    aliases: ["deepseek"],
    env: "DEEPSEEK_API_KEY",
    endpoint: "https://api.deepseek.com",
    models: ["deepseek-chat", "deepseek-reasoner"],
    notes: [
      "Reasoning models return the answer in `reasoning_content` when `content` is empty. polygate falls back to it, so `response.content` is populated either way.",
    ],
  },
  {
    id: "moonshot",
    name: "Moonshot",
    kind: "direct",
    tagline: "Kimi models.",
    aliases: ["moonshot", "kimi"],
    env: "MOONSHOT_API_KEY",
    endpoint: "https://api.moonshot.ai/v1",
    models: ["kimi-k2-0711-preview", "moonshot-v1-128k"],
  },
  {
    id: "zai",
    name: "Z.AI",
    kind: "direct",
    tagline: "GLM models, from Zhipu AI.",
    aliases: ["zai", "z.ai", "glm", "zhipu", "bigmodel"],
    env: "ZAI_API_KEY",
    endpoint: "https://api.z.ai/api/paas/v4",
    models: ["glm-4.6", "glm-4.5-air", "glm-5.2"],
    notes: [
      "The base path is `/api/paas/v4`, not the `/v1` almost everyone else uses.",
      "There are two platforms with **non-interchangeable keys**: `api.z.ai` internationally (the default) and `open.bigmodel.cn` in mainland China. Same API, different host — pass the other as `base_url`.",
    ],
    extraExample: {
      title: "The mainland endpoint",
      python: `import polygate

response = polygate.chat(
    provider="zai",
    base_url="https://open.bigmodel.cn/api/paas/v4",
    model="glm-4.6",
    messages=[{"role": "user", "content": "Hello"}],
)`,
      typescript: `import { chat } from "polygate";

const response = await chat({
  provider: "zai",
  baseUrl: "https://open.bigmodel.cn/api/paas/v4",
  model: "glm-4.6",
  messages: [{ role: "user", content: "Hello" }],
});`,
    },
  },
];

const CLOUDS: ProviderDoc[] = [
  {
    id: "bedrock",
    name: "Amazon Bedrock",
    kind: "cloud",
    tagline: "Every model AWS hosts, through one signed API.",
    aliases: ["bedrock", "aws"],
    env: "AWS_ACCESS_KEY_ID",
    extraEnv: [
      { name: "AWS_SECRET_ACCESS_KEY", description: "the other half of the credential pair" },
      { name: "AWS_SESSION_TOKEN", description: "only for temporary credentials from an assumed role" },
      { name: "AWS_REGION", description: "part of the hostname; defaults to us-east-1" },
    ],
    models: [
      "anthropic.claude-3-5-sonnet-20241022-v2:0",
      "us.anthropic.claude-sonnet-4-20250514-v1:0",
      "amazon.nova-pro-v1:0",
      "meta.llama3-3-70b-instruct-v1:0",
    ],
    notes: [
      "polygate uses Bedrock's **Converse** API, not `InvokeModel`. Converse is AWS's own unified interface, so one message shape works across every model they host — `InvokeModel` would need a different request body per vendor, reintroducing the exact problem polygate exists to remove.",
      "Requests are signed with SigV4, implemented in about 60 lines of standard library rather than by depending on boto3. The signature is diffed against botocore in the test suite, and the TypeScript signer is pinned to the same outputs.",
      "Credentials can also be passed as a single packed string, `ACCESS_KEY:SECRET` or `ACCESS_KEY:SECRET:SESSION_TOKEN`. A list of those rotates exactly like a list of OpenAI keys.",
      "Model ids are Bedrock's own, not the vendor's. A `us.` prefix means a cross-region inference profile.",
    ],
    extraExample: {
      title: "Choosing a region",
      python: `import polygate

response = polygate.chat(
    provider="bedrock",
    model="anthropic.claude-3-5-sonnet-20241022-v2:0",
    messages=[{"role": "user", "content": "Hello"}],
    region="eu-west-1",     # or $AWS_REGION
)`,
      typescript: `import { chat } from "polygate";

const response = await chat({
  provider: "bedrock",
  model: "anthropic.claude-3-5-sonnet-20241022-v2:0",
  messages: [{ role: "user", content: "Hello" }],
  region: "eu-west-1",      // or $AWS_REGION
});`,
    },
  },
  {
    id: "azure",
    name: "Azure OpenAI",
    kind: "cloud",
    tagline: "OpenAI models on your own Azure resource.",
    aliases: ["azure", "azure_openai"],
    env: "AZURE_OPENAI_API_KEY",
    endpointRequired: true,
    extraEnv: [
      { name: "AZURE_OPENAI_ENDPOINT", description: "your resource host, e.g. https://my-resource.openai.azure.com" },
      { name: "AZURE_OPENAI_API_VERSION", description: "overrides the pinned default" },
    ],
    models: ["your-deployment-name"],
    notes: [
      "**The `model` is your deployment name**, not a vendor model id. Your deployment can be called anything, so `model: \"gpt-4o\"` only works if you named the deployment `gpt-4o`.",
      "The key goes in an `api-key` header, not as a Bearer token. Sending a Bearer token returns a 401 that is indistinguishable from a wrong key — polygate handles this for you.",
      "An `api-version` query parameter is mandatory; omitting it is a 404. polygate pins a known-good version rather than tracking latest, because Azure's versions change model behaviour and a drifting default would turn a library upgrade into a silent change in output.",
    ],
  },
  {
    id: "vertex",
    name: "Google Vertex AI",
    kind: "cloud",
    tagline: "Gemini and partner models on Google Cloud.",
    aliases: ["vertex", "vertexai"],
    env: "GOOGLE_ACCESS_TOKEN",
    endpointRequired: true,
    extraEnv: [
      { name: "VERTEX_BASE_URL", description: "the OpenAI-compatible endpoint for your project and region" },
    ],
    models: ["google/gemini-2.0-flash", "google/gemini-2.5-pro"],
    notes: [
      "**The credential is a short-lived OAuth access token, not an API key.** Vertex issues no long-lived keys. Get one with `gcloud auth print-access-token`; it expires in about an hour, so a token pasted into an environment variable will start returning 401 rather than continuing to work.",
      "Minting tokens is deliberately out of scope. Doing it properly means service-account JWT signing and a refresh cycle, which would put a crypto dependency in a package whose premise is that it has almost none.",
      "The endpoint names your region twice. `vertex.endpoint(project, region)` builds it correctly — a mismatch between the two produces a 404 that names nothing.",
    ],
    extraExample: {
      title: "Building the endpoint",
      python: `import subprocess
import polygate
from polygate.providers import vertex

token = subprocess.check_output(
    ["gcloud", "auth", "print-access-token"], text=True
).strip()

response = polygate.chat(
    provider="vertex",
    api_key=token,
    base_url=vertex.endpoint("my-project", "europe-west4"),
    model="google/gemini-2.0-flash",
    messages=[{"role": "user", "content": "Hello"}],
)`,
      typescript: `import { chat } from "polygate";
import { endpoint } from "polygate/providers/vertex";

const response = await chat({
  provider: "vertex",
  apiKey: process.env.GOOGLE_ACCESS_TOKEN,
  baseUrl: endpoint("my-project", "europe-west4"),
  model: "google/gemini-2.0-flash",
  messages: [{ role: "user", content: "Hello" }],
});`,
    },
  },
  {
    id: "databricks",
    name: "Databricks",
    kind: "cloud",
    tagline: "Model Serving endpoints on your workspace.",
    aliases: ["databricks"],
    env: "DATABRICKS_TOKEN",
    endpointRequired: true,
    extraEnv: [
      { name: "DATABRICKS_HOST", description: "your workspace URL" },
    ],
    models: ["databricks-claude-sonnet-4-5", "databricks-meta-llama-3-3-70b-instruct"],
    notes: [
      "**The `model` is your serving endpoint name**, not a vendor model id — which is why two workspaces on the same underlying model can call it different things.",
      "Databricks documents the URL three ways: the workspace root, the root plus `/serving-endpoints`, and the full per-endpoint invocation URL. polygate accepts all three, because all three are things people paste.",
    ],
  },
  {
    id: "cloudflare",
    name: "Cloudflare Workers AI",
    kind: "cloud",
    tagline: "Open models on Cloudflare's edge.",
    aliases: ["cloudflare", "workers-ai"],
    env: "CLOUDFLARE_API_TOKEN",
    endpointRequired: true,
    extraEnv: [
      { name: "CLOUDFLARE_ACCOUNT_ID", description: "expanded into the full URL for you" },
      { name: "CLOUDFLARE_BASE_URL", description: "the full URL, if you would rather give it directly" },
    ],
    models: ["@cf/meta/llama-3.1-8b-instruct", "@cf/mistral/mistral-7b-instruct-v0.1"],
    notes: [
      "Model ids carry an `@cf/` prefix naming the publisher — Cloudflare's own convention, not anything OpenAI-shaped.",
      "You can pass a bare account id as `base_url` and polygate will build the five-segment URL around it. The account id is what the dashboard shows you.",
    ],
  },
];

const GATEWAYS: ProviderDoc[] = [
  {
    id: "openrouter",
    name: "OpenRouter",
    kind: "gateway",
    tagline: "Several hundred models from every major vendor, one key.",
    aliases: ["openrouter"],
    env: "OPENROUTER_API_KEY",
    endpoint: "https://openrouter.ai/api/v1",
    models: ["anthropic/claude-sonnet-4.5", "openai/gpt-4o", "meta-llama/llama-3.3-70b-instruct"],
    notes: [
      "Models are addressed `vendor/model`. OpenRouter picks an upstream provider and fails over between them, which makes it the cheapest way to reach a model polygate has no adapter for.",
    ],
  },
  {
    id: "vercel",
    name: "Vercel AI Gateway",
    kind: "gateway",
    tagline: "A routing layer in front of every major vendor.",
    aliases: ["vercel", "ai-gateway"],
    env: "AI_GATEWAY_API_KEY",
    endpoint: "https://ai-gateway.vercel.sh/v1",
    models: ["anthropic/claude-sonnet-4.5", "openai/gpt-4o"],
    notes: [
      "The environment variable is `AI_GATEWAY_API_KEY` rather than a Vercel-branded name, matching what Vercel's own tooling sets.",
    ],
  },
  {
    id: "baseten",
    name: "Baseten",
    kind: "gateway",
    tagline: "Hosted open models, no deployment step.",
    aliases: ["baseten"],
    env: "BASETEN_API_KEY",
    endpoint: "https://inference.baseten.co/v1",
    models: ["deepseek-ai/DeepSeek-V3", "zai-org/GLM-4.6"],
    notes: [
      "Baseten also serves models you deploy yourself, each on its own URL. Reach those with `base_url`; the default here is the shared Model APIs endpoint.",
    ],
  },
  {
    id: "deepinfra",
    name: "DeepInfra",
    kind: "gateway",
    tagline: "Open models billed per token.",
    aliases: ["deepinfra"],
    env: "DEEPINFRA_API_KEY",
    endpoint: "https://api.deepinfra.com/v1/openai",
    models: ["meta-llama/Llama-3.3-70B-Instruct"],
    notes: [
      "The OpenAI-compatible surface lives under `/v1/openai`, beside DeepInfra's own native API at `/v1/inference`.",
    ],
  },
  {
    id: "sambanova",
    name: "SambaNova",
    kind: "gateway",
    tagline: "Open models on RDU silicon.",
    aliases: ["sambanova"],
    env: "SAMBANOVA_API_KEY",
    endpoint: "https://api.sambanova.ai/v1",
    models: ["Meta-Llama-3.3-70B-Instruct"],
  },
  {
    id: "nebius",
    name: "Nebius AI Studio",
    kind: "gateway",
    tagline: "Open models from a European cloud.",
    aliases: ["nebius"],
    env: "NEBIUS_API_KEY",
    endpoint: "https://api.studio.nebius.com/v1",
    models: ["meta-llama/Llama-3.3-70B-Instruct"],
    notes: [
      "The host is `api.studio.nebius.com`, not `api.nebius.com` — the latter is the cloud control plane and will not serve inference.",
    ],
  },
  {
    id: "novita",
    name: "Novita AI",
    kind: "gateway",
    tagline: "Open models at GPU-marketplace prices.",
    aliases: ["novita"],
    env: "NOVITA_API_KEY",
    endpoint: "https://api.novita.ai/v3/openai",
    models: ["meta-llama/llama-3.3-70b-instruct"],
    notes: ["The version segment is `/v3`, not the `/v1` almost everyone else uses."],
  },
  {
    id: "hyperbolic",
    name: "Hyperbolic",
    kind: "gateway",
    tagline: "Open models on spare GPU capacity.",
    aliases: ["hyperbolic"],
    env: "HYPERBOLIC_API_KEY",
    endpoint: "https://api.hyperbolic.xyz/v1",
    models: ["meta-llama/Llama-3.3-70B-Instruct"],
  },
];

const SELF_HOSTED: ProviderDoc[] = [
  {
    id: "custom",
    name: "Your own endpoint",
    kind: "self-hosted",
    tagline: "Ollama, vLLM, LM Studio, or any OpenAI-compatible host.",
    aliases: ["custom", "ollama", "local", "vllm"],
    env: "CUSTOM_API_KEY",
    endpointRequired: true,
    extraEnv: [
      { name: "POLYGATE_BASE_URL", description: "so you need not pass base_url on every call" },
    ],
    models: ["llama3.1", "whatever your server serves"],
    notes: [
      "No API key is required. Local runtimes authenticate nothing, and demanding a key would fail the most common case — a laptop running Ollama — for a reason that does not exist.",
      "Defaults to `http://localhost:11434/v1`, which is Ollama's. The `ollama`, `local` and `vllm` aliases exist because someone reaching for those names should not be told the provider is unknown.",
    ],
    extraExample: {
      title: "Pointing at a local server",
      python: `import polygate

response = polygate.chat(
    provider="ollama",
    base_url="http://localhost:11434/v1",
    model="llama3.1",
    messages=[{"role": "user", "content": "Hello"}],
)`,
      typescript: `import { chat } from "polygate";

const response = await chat({
  provider: "ollama",
  baseUrl: "http://localhost:11434/v1",
  model: "llama3.1",
  messages: [{ role: "user", content: "Hello" }],
});`,
    },
  },
];

export const PROVIDERS: ProviderDoc[] = [
  ...DIRECT,
  ...CLOUDS,
  ...GATEWAYS,
  ...SELF_HOSTED,
];

export const GROUPS: { kind: ProviderKind; title: string; blurb: string }[] = [
  {
    kind: "direct",
    title: "Providers",
    blurb: "Model vendors and inference hosts you call directly.",
  },
  {
    kind: "cloud",
    title: "Clouds",
    blurb:
      "Your own cloud account. Each needs an endpoint or region as well as a credential, because the URL contains your resource.",
  },
  {
    kind: "gateway",
    title: "Gateways",
    blurb:
      "One key, many vendors. Model ids here are usually written vendor/model.",
  },
  {
    kind: "self-hosted",
    title: "Self-hosted",
    blurb: "Anything you run that speaks the OpenAI format.",
  },
];

export function providerById(id: string): ProviderDoc | undefined {
  return PROVIDERS.find((p) => p.id === id);
}

export function providersOfKind(kind: ProviderKind): ProviderDoc[] {
  return PROVIDERS.filter((p) => p.kind === kind);
}

/** Providers with an offline batch tier, for the batching guide. */
export const BATCH_PROVIDERS = PROVIDERS.filter((p) => p.batch);

/** The standard chat example, generated so every page shows real values. */
export function chatExample(provider: ProviderDoc) {
  const model = provider.models[0];
  const needsBase = provider.endpointRequired;
  const baseLinePy = needsBase ? `\n    base_url="...",` : "";
  const baseLineTs = needsBase ? `\n  baseUrl: "...",` : "";
  return {
    python: `import polygate

response = polygate.chat(
    provider="${provider.id}",${baseLinePy}
    model="${model}",
    messages=[{"role": "user", "content": "Say hi in one word."}],
)

print(response.content)   # "Hi!"
print(response.usage)     # Usage(prompt_tokens=..., completion_tokens=...)`,
    typescript: `import { chat } from "polygate";

const response = await chat({
  provider: "${provider.id}",${baseLineTs}
  model: "${model}",
  messages: [{ role: "user", content: "Say hi in one word." }],
});

console.log(response.content); // "Hi!"
console.log(response.usage);   // { promptTokens: ..., completionTokens: ... }`,
  };
}
