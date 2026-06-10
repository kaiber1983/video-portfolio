import { prisma } from "@/lib/prisma";
import ProjectGrid from "@/components/ProjectGrid";
import TagFilter from "@/components/TagFilter";
import FadeIn from "@/components/FadeIn";
import Hero from "@/components/Hero";
import Hero3D from "@/components/Hero3D";

export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams: { tag?: string };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const activeTag = searchParams.tag || "";

  // 安全读取数据库，Vercel 上无 SQLite 时返回空数据
  async function loadProjects() {
    if (!prisma) return { tags: [] as string[], featured: [], others: [], total: 0 };
    try {
      const tagResult = await prisma.project.findMany({
        select: { tags: true },
      });
      const uniqueTags = Array.from(
        new Set(tagResult.flatMap((p) => p.tags.split(",").filter(Boolean)))
      ).sort();

      if (activeTag) {
        const filtered = await prisma.project.findMany({
          orderBy: { createdAt: "desc" },
          where: { tags: { contains: activeTag } },
        });
        return { tags: uniqueTags, featured: [], others: filtered, total: filtered.length, isFiltered: true };
      }

      const [featured, others] = await Promise.all([
        prisma.project.findMany({ where: { featured: true }, orderBy: { createdAt: "desc" } }),
        prisma.project.findMany({ where: { featured: false }, orderBy: { createdAt: "desc" } }),
      ]);
      return { tags: uniqueTags, featured, others, total: featured.length + others.length, isFiltered: false };
    } catch {
      console.warn("数据库查询失败，降级为空数据");
      return { tags: [] as string[], featured: [], others: [], total: 0, isFiltered: false };
    }
  }

  const { tags: uniqueTags, featured: featuredProjects, others: otherProjects, total: totalCount } = await loadProjects();

  // 有标签筛选时：只展示筛选结果
  if (activeTag) {
    return (
      <>
        <Hero title="筛选" subtitle={`标签: ${activeTag}`} compact />
        <div className="max-w-6xl mx-auto px-4 pb-20">
          <TagFilter tags={uniqueTags} />
          <ProjectGrid projects={otherProjects} />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Hero 区 — 3D 沉浸式 */}
      <Hero3D />

      <div className="max-w-6xl mx-auto px-4 pb-20">
        {/* 标签筛选 */}
        <FadeIn>
          <TagFilter tags={uniqueTags} />
        </FadeIn>

        {/* 精选作品 */}
        {featuredProjects.length > 0 && (
          <FadeIn delay={100}>
            <section className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-8 h-[1px] bg-accent-blue/50" />
                <h2 className="font-display text-sm tracking-[0.2em] uppercase text-accent-indigo">
                  精选作品
                </h2>
                <span className="flex-1 h-[1px] bg-gradient-to-r from-accent-indigo/20 to-transparent" />
              </div>
              <ProjectGrid projects={featuredProjects} stagger />
            </section>
          </FadeIn>
        )}

        {/* 全部作品 */}
        <FadeIn delay={200}>
          <section>
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-[1px] bg-ink-dim/30" />
              <h2 className="font-display text-sm tracking-[0.2em] uppercase text-ink-muted">
                全部作品
                <span className="text-ink-dim ml-2 font-light">({totalCount})</span>
              </h2>
              <span className="flex-1 h-[1px] bg-gradient-to-r from-ink-dim/20 to-transparent" />
            </div>
            <ProjectGrid projects={otherProjects} stagger />
          </section>
        </FadeIn>
      </div>
    </>
  );
}
