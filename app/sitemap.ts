import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/aero";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/cessna-402`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
