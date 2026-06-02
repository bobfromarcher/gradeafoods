import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://gradeafoods.com";
  const now = new Date();
  return ["", "/pricing", "/privacy", "/terms"].map((p) => ({
    url: base + p,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
}
