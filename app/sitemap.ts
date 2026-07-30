import type { MetadataRoute } from "next";
import { headers } from "next/headers"

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const host = (await headers()).get("host") ?? "getfluiq.com"
  const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https"
  const BASE = `${protocol}://${host}`

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
