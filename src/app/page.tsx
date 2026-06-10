"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Hero3D from "@/components/Hero3D";
import TagFilter from "@/components/TagFilter";
import ProjectGrid from "@/components/ProjectGrid";
import FadeIn from "@/components/FadeIn";
import type { Project } from "@/lib/data";

/** 读取 URL 参数并筛选作品的内部组件 */
function HomeContent() {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag") || "";
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  // 计算所有不重复标签
  const allTags = Array.from(
    new Set(projects.flatMap((p) => p.tags.split(",").map((t) => t.trim()).filter(Boolean)))
  );

  // 根据标签筛选
  const filteredProjects = activeTag
    ? projects.filter((p) =>
        p.tags.split(",").some((t) => t.trim() === activeTag)
      )
    : projects;

  return (
    <main>
      <Hero3D />

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

            {!loading && <TagFilter tags={allTags} />}
          </FadeIn>

          <FadeIn delay={100}>
            {error ? (
              <div className="text-center py-20">
                <p className="text-lg text-ink-muted mb-2">加载失败</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-sm text-accent-blue hover:text-accent-indigo transition-colors"
                >
                  点击重试
                </button>
              </div>
            ) : loading ? (
              <div className="text-center py-20">
                <div className="w-8 h-8 border-2 border-accent-purple/30 border-t-accent-purple rounded-full animate-spin mx-auto" />
                <p className="text-sm text-ink-muted mt-4">加载中...</p>
              </div>
            ) : (
              <ProjectGrid projects={filteredProjects} stagger />
            )}
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
