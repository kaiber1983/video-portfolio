"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Hero3D from "@/components/Hero3D";
import TagFilter from "@/components/TagFilter";
import ProjectGrid from "@/components/ProjectGrid";
import FadeIn from "@/components/FadeIn";
import { getAllProjects, getAllTags } from "@/data/projects";

/** 读取 URL 参数并筛选作品的内部组件 */
function HomeContent() {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag") || "";

  const allProjects = getAllProjects();
  const allTags = getAllTags();

  // 根据标签筛选作品
  const filteredProjects = activeTag
    ? allProjects.filter((p) =>
        p.tags.split(",").some((t) => t.trim() === activeTag)
      )
    : allProjects;

  return (
    <main>
      {/* 全屏 3D Hero */}
      <Hero3D />

      {/* 作品区域 */}
      <section className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <FadeIn>
            <div className="flex items-center gap-4 mb-10">
              <span className="w-8 h-[1px] bg-accent-purple/30" />
              <span className="text-[10px] tracking-[0.25em] uppercase text-accent-purple/70 font-display">
                全部作品
              </span>
              <span className="w-8 h-[1px] bg-accent-purple/30" />
            </div>

            <TagFilter tags={allTags} />
          </FadeIn>

          <FadeIn delay={100}>
            <ProjectGrid projects={filteredProjects} stagger />
          </FadeIn>
        </div>
      </section>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
