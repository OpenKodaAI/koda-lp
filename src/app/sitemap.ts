import type { MetadataRoute } from "next";
import { flattenNav } from "@/lib/docs/nav";

const SITE_URL = "https://koda.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const landing: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/#features`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/#integrations`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/#foundations`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const docs: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/docs`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...flattenNav().map((item) => ({
      url: `${SITE_URL}/docs/${item.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  return [...landing, ...docs];
}
