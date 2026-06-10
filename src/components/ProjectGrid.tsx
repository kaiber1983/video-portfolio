import type { StaticProject } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import FadeIn from "./FadeIn";

export default function ProjectGrid({
  projects,
  stagger,
}: {
  projects: StaticProject[];
  stagger?: boolean;
}) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-20 text-[#a0a0a0]">
        <p className="text-lg">暂无作品</p>
        <p className="text-sm mt-2">换个标签试试？</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, i) =>
        stagger ? (
          <FadeIn key={project.id} delay={i * 80}>
            <ProjectCard project={project} />
          </FadeIn>
        ) : (
          <ProjectCard key={project.id} project={project} />
        )
      )}
    </div>
  );
}
