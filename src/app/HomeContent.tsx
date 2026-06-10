"use client";

import { useSearchParams } from "next/navigation";
import TagFilter from "@/components/TagFilter";
import ProjectGrid from "@/components/ProjectGrid";
import FadeIn from "@/components/FadeIn";
import type { Project } from "@/lib/data";

interface Props {
  projects: Project[];
  error: boolean;
}

export default function HomeContent({ projects, error }: Props) {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag") || "";

  const allTags = Array.from(
    new Set(
      projects.flatMap((p) =>
        p.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      )
    )
  );

  const filteredProjects = activeTag
    ? projects.filter((p) =>
        p.tags.split(",").some((t) => t.trim() === activeTag)
      )
    : projects;

  return (
    <>
      <FadeIn>
        <TagFilter tags={allTags} />
      </FadeIn>

      <FadeIn delay={100}>
        {error ? (
          <div className="text-center py-20">
            <p className="text-lg text-white mb-2">加载失败</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-white hover:text-white transition-colors"
            >
              点击重试
            </button>
          </div>
        ) : (
          <ProjectGrid projects={filteredProjects} stagger />
        )}
      </FadeIn>
    </>
  );
}
