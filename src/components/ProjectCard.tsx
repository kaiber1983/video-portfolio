import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/data";

export default function ProjectCard({ project }: { project: Project }) {
  const shortDesc =
    project.description.length > 80
      ? project.description.slice(0, 80) + "..."
      : project.description;

  return (
    <Link
      href={`/project/${project.id}`}
      className="group block rounded-xl overflow-hidden border border-white/[0.06] bg-surface-card transition-all duration-500 hover:shadow-[0_8px_30px_-8px_rgba(99,102,241,0.15)] hover:border-accent-indigo/20 card-border"
    >
      {/* 缩略图 */}
      <div className="aspect-video overflow-hidden bg-surface-muted relative glow-reveal">
        {project.featured && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded text-[10px] font-medium tracking-[0.15em] uppercase border border-accent-indigo/30 bg-accent-dim text-accent-indigo shadow-lg backdrop-blur-sm">
            精选
          </span>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent z-[1] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <Image
          src={project.thumbnail}
          alt={project.title}
          width={800}
          height={450}
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.03]"
        />

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-indigo/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s] ease-in-out" />
        </div>
      </div>

      {/* 信息区 */}
      <div className="p-5 space-y-3">
        <h3 className="font-display text-lg text-ink group-hover:text-accent-indigo transition-colors duration-300 tracking-wide">
          {project.title}
        </h3>

        <p className="text-sm text-ink-muted leading-relaxed line-clamp-2 font-light">
          {shortDesc}
        </p>

        {/* 标签 */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.tags.split(",").map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full border border-white/[0.08] bg-surface-muted text-ink-dim tracking-wider uppercase"
            >
              {tag.trim()}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
