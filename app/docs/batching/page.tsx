import type { Metadata } from "next";
import Link from "next/link";
import DocsCode from "@/components/DocsCode";
import { DocsShell, H2, H3, Prose } from "@/components/DocsShell";
import { BATCH_PROVIDERS } from "@/lib/providers";

export const metadata: Metadata = {
  title: "Batching & concurrency",
  description:
    "Run thousands of LLM requests with polygate: offline batch jobs at half price on OpenAI, Anthropic and Groq, or bounded concurrent dispatch that keeps a continuous-batching server fed.",
  alternates: { canonical: "/docs/batching" },
};

const border = "border-[#E5E1D6] dark:border-[#2A2A2A]";
const muted = "text-[#6B6B66] dark:text-[#9A9A92]";

const concurrentExample = {
  python: `import polygate

questions = ["Summarize this...", "Classify this...", ...]   # 10,000 of them

results = polygate.map_prompts(
    "openai", "gpt-4o-mini", questions,
    concurrency=16,
    on_progress=lambda p: print(f"{p.done}/{p.total} at {p.concurrency} in flight"),
)

# Same order as the input, one entry per prompt.
for item in results:
    if item.ok:
        print(item.index, item.response.content)
    else:
        print(item.index, "failed:", item.error)`,
  typescript: `import { mapPrompts } from "polygate";

const questions = ["Summarize this...", "Classify this...", /* ... */];

const results = await mapPrompts("openai", "gpt-4o-mini", questions, {
  concurrency: 16,
  onProgress: (p) => console.log(\`\${p.done}/\${p.total} at \${p.concurrency} in flight\`),
});

// Same order as the input, one entry per prompt.
for (const item of results) {
  if (item.response) console.log(item.index, item.response.content);
  else console.log(item.index, "failed:", item.error);
}`,
};

const conversationsExample = {
  python: `# Full conversations rather than bare prompts.
results = polygate.map_chat(
    "anthropic", "claude-haiku-4-5",
    [
        [{"role": "system", "content": "Reply in one word."},
         {"role": "user", "content": text}]
        for text in documents
    ],
    concurrency=8,
)

texts = polygate.concurrent.contents(results, default="<failed>")`,
  typescript: `// Full conversations rather than bare prompts.
import { mapChat, contents } from "polygate";

const results = await mapChat(
  "anthropic", "claude-haiku-4-5",
  documents.map((text) => [
    { role: "system", content: "Reply in one word." },
    { role: "user", content: text },
  ]),
  { concurrency: 8 },
);

const texts = contents(results, "<failed>");`,
};

const batchExample = {
  python: `from polygate import BatchRequest, batch

requests = [
    BatchRequest(
        custom_id=f"doc-{i}",
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": text}],
    )
    for i, text in enumerate(documents)
]

# Returns immediately with a job id you can poll.
job = batch.submit("openai", requests)
print(job.id, job.status)     # batch_abc123 pending`,
  typescript: `import { batch } from "polygate";

const requests = documents.map((text, i) => ({
  customId: \`doc-\${i}\`,
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: text }],
}));

// Returns immediately with a job id you can poll.
const job = await batch.submit("openai", requests);
console.log(job.id, job.status);   // batch_abc123 pending`,
};

const pollExample = {
  python: `job = batch.status("openai", "batch_abc123")
print(job.status, f"{job.progress:.0%}", job.completed, job.failed)

if job.done:
    for result in batch.results("openai", job.id):
        if result.ok:
            print(result.custom_id, result.response.content)
        else:
            print(result.custom_id, "failed:", result.error)`,
  typescript: `const job = await batch.status("openai", "batch_abc123");
console.log(job.status, batch.progress(job), job.completed, job.failed);

if (batch.isDone(job)) {
  for (const result of await batch.results("openai", job.id)) {
    if (result.response) console.log(result.customId, result.response.content);
    else console.log(result.customId, "failed:", result.error);
  }
}`,
};

const runExample = {
  python: `# Submit, poll, and return the results. Blocks for as long as the provider
# takes — which can be hours.
results = batch.run(
    "anthropic", requests,
    poll_seconds=60,
    on_progress=lambda job: print(job.status, f"{job.progress:.0%}"),
)`,
  typescript: `// Submit, poll, and return the results. Blocks for as long as the provider
// takes — which can be hours.
const results = await batch.run("anthropic", requests, {
  pollSeconds: 60,
  onProgress: (job) => console.log(job.status, batch.progress(job)),
});`,
};

export default function BatchingPage() {
  return (
    <DocsShell>
      <article className="max-w-2xl">
        <p className={`text-[12px] uppercase tracking-wide ${muted}`}>Guide</p>
        <h1 className="mt-1 text-[28px] font-semibold tracking-tight">
          Batching &amp; concurrency
        </h1>
        <p className={`mt-2 text-[15px] ${muted}`}>
          Two ways to run thousands of requests, and they are not the same thing.
        </p>

        <H2>Which one you want</H2>
        <div className={`my-4 overflow-hidden rounded-xl border ${border}`}>
          <table className="w-full text-left text-[13px]">
            <thead className={`border-b ${border} ${muted}`}>
              <tr>
                <th className="px-4 py-2 font-medium"></th>
                <th className="px-4 py-2 font-medium">Batch job</th>
                <th className="px-4 py-2 font-medium">Concurrent</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Price", "~50% off", "Full price"],
                ["Latency", "Minutes to 24 hours", "Seconds"],
                ["Providers", `${BATCH_PROVIDERS.length} of them`, "All of them"],
                ["Survives a restart", "Yes — the job id is durable", "No"],
                ["Good for", "Evals, backfills, sweeps", "Anything you are waiting on"],
              ].map(([label, a, b], index) => (
                <tr key={label} className={index ? `border-t ${border}` : ""}>
                  <td className={`px-4 py-2 ${muted}`}>{label}</td>
                  <td className="px-4 py-2">{a}</td>
                  <td className="px-4 py-2">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <H2>What continuous batching actually is</H2>
        <Prose>
          {`Worth clearing up, because it is the most commonly confused term here. **Continuous batching is a server-side technique.** vLLM, TGI and every hosted provider run an iteration-level scheduler that slots new sequences into a forward pass as older ones finish, so the GPU never idles waiting for the slowest generation in a fixed batch.`}
        </Prose>
        <Prose>
          {`No client library can perform it. What a client controls is whether the scheduler has anything to schedule — and a loop that awaits each request before sending the next leaves a continuous-batching server running a batch size of one. Same GPU, a fraction of the throughput, and you are billed per token either way.`}
        </Prose>
        <Prose>
          {`Keeping N requests outstanding is the entire client-side contribution. That is what \`map_chat\` does.`}
        </Prose>

        <H2>Concurrent dispatch</H2>
        <DocsCode
          python={concurrentExample.python}
          typescript={concurrentExample.typescript}
        />

        <H3>Three things it gets right</H3>
        <Prose>
          {`**Results stay in input order.** Completion order is not submission order, so placing results by arrival attaches every answer to the wrong question — silently, with no error and plausible-looking output.`}
        </Prose>
        <Prose>
          {`**One failure does not kill the run.** A single 400 in item 4,000 of 10,000 must not discard 3,999 answers you have already paid for. Errors are captured per item; pass \`raise_on_error=True\` when a partial result is useless to you.`}
        </Prose>
        <Prose>
          {`**Concurrency is bounded, and adapts.** Fanning out over ten thousand prompts opens ten thousand sockets and earns an immediate 429. The limiter halves on a rate limit and recovers by one — additive-increase, multiplicative-decrease, the same shape as TCP congestion control and for the same reason: the right level is unknown, differs per key, and changes with load.`}
        </Prose>

        <H3>Full conversations</H3>
        <DocsCode
          python={conversationsExample.python}
          typescript={conversationsExample.typescript}
        />

        <H2>Offline batch jobs</H2>
        <Prose>
          {`Several providers run a second, asynchronous tier: hand over a whole job, they process it within a window, and it costs roughly half. Currently supported:`}
        </Prose>
        <div className="my-3 flex flex-wrap gap-1.5">
          {BATCH_PROVIDERS.map((provider) => (
            <Link
              key={provider.id}
              href={`/docs/${provider.id}`}
              className={`rounded-md border px-2.5 py-1 text-[12.5px] transition-colors hover:border-[#1860D3] dark:hover:border-[#6FA8FF] ${border}`}
            >
              {provider.name}
            </Link>
          ))}
        </div>
        <Prose>
          {`Under the hood these could hardly be less alike — OpenAI wants a JSONL file uploaded and referenced by id, Anthropic takes the requests inline; their status vocabularies and result envelopes differ too. polygate normalizes all of it.`}
        </Prose>

        <H3>Submit</H3>
        <DocsCode python={batchExample.python} typescript={batchExample.typescript} />
        <Prose>
          {`\`custom_id\` is required rather than generated, because results come back unordered and often partially — matching by position would quietly mis-assign every answer in a job where one request failed. Duplicates are rejected up front, since a provider keys results by that id and the clash would otherwise surface hours later at retrieval.`}
        </Prose>

        <H3>Poll and collect</H3>
        <DocsCode python={pollExample.python} typescript={pollExample.typescript} />
        <Prose>
          {`Statuses normalize to \`pending\`, \`running\`, \`completed\`, \`failed\`, \`cancelled\` and \`expired\`. Successes and failures both come back — on OpenAI they live in two different files, and reading only the output file silently loses every failed request.`}
        </Prose>

        <H3>Or just wait</H3>
        <DocsCode python={runExample.python} typescript={runExample.typescript} />
        <Prose>
          {`Convenient, and occasionally the wrong tool: prefer \`submit\` plus your own polling for anything that must survive the process being restarted. The batch id is durable; a stack frame is not. A \`timeout_seconds\` gives up *watching* — it does not cancel the job, which keeps running and can be collected later.`}
        </Prose>

        <H2>Providers without a batch tier</H2>
        <Prose>
          {`Calling \`batch.submit\` on one raises \`BatchNotSupportedError\` naming the alternative. polygate deliberately does not assume every OpenAI-compatible host implements the batch route as well as the chat route — most do not, and a request to a missing \`/batches\` returns a 404 that reads like an outage rather than an unsupported feature.`}
        </Prose>
      </article>
    </DocsShell>
  );
}
