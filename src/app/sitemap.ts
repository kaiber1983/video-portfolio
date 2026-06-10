import { MetadataRoute } from "next";
import { readProjects } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.SITE_URL || "https://your-site.vercel.app";

  // 静态页面
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // 作品详情页
  let projectPages: MetadataRoute.Sitemap = [];
  try {
    const projects = readProjects();
    projectPages = projects.map((project) => ({
      url: `${baseUrl}/project/${project.id}`,
      lastModified: new Date(project.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // 作品数据不可用，跳过
  }

  return [...staticPages, ...projectPages];
}
