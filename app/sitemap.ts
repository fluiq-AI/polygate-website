import type { MetadataRoute } from "next";
import { PROVIDERS } from "@/lib/providers";

/**
 * `force-static` because the site is exported, not served. A sitemap that
 * reached for request headers would break the build rather than the page.
 *
 * Provider pages come from the same registry the pages themselves use, so a
 * provider added there is indexed without anyone remembering this file.
 */
export const dynamic = "force-static";

const SITE = "https://polygate.getfluiq.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: SITE,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE}/docs`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE}/docs/batching`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...PROVIDERS.map((provider) => ({
      url: `${SITE}/docs/${provider.id}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
