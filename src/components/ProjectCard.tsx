import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/data";

export default function ProjectCard({ project }: { project: Project }) {
  const shortDesc =
    project.description.length > 100
      ? project.description.slice(0, 100) + "..."
      : project.description;

  const tags = project.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <Link
      href={`/project/${project.id}`}
      className="group block rounded-2xl overflow-hidden border border-white/[0.04] bg-[#0c0c0e] transition-all duration-500 hover:border-white/[0.1] hover:shadow-[0_20px_60px_-16px_rgba(212,139,166,0.12)]"
    >
      {/* 缩略图 */}
      <div className="aspect-[16/10] overflow-hidden relative bg-[#0a0a0b]">
        {/* 精选角标 */}
        {project.featured && (
          <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-md text-[10px] font-medium tracking-[0.2em] uppercase bg-accent/20 text-accent-purple/90 backdrop-blur-sm border border-accent/10">
            精选
          </span>
        )}

        {/* 平台角标 */}
        <span className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-md text-[10px] font-medium tracking-wider uppercase bg-black/40 text-white/60 backdrop-blur-sm border border-white/[0.06]">
          {project.platform === "youtube" ? "YouTube" : "Bilibili"}
        </span>

        {/* 悬停渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[1]" />

        <Image
          src={project.thumbnail}
          alt={project.title}
          width={960}
          height={600}
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.04]"
        />

        {/* 光泽扫过效果 */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-[2]">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, rgba(236,168,214,0.06) 45%, rgba(212,139,166,0.08) 50%, rgba(236,168,214,0.06) 55%, transparent 60%)",
              transform: "translateX(-100%)",
              transition: "transform 0.8s ease-out",
            }}
          />
        </div>
      </div>

      {/* 内容区 */}
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-display text-ink group-hover:text-accent-purple/90 transition-colors duration-300 tracking-wide leading-snug">
          {project.title}
        </h3>

        {project.description && (
          <p className="text-sm text-ink-muted/70 leading-relaxed line-clamp-2 font-light">
            {shortDesc}
          </p>
        )}

        {/* 标签 */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-3 py-1 rounded-md bg-white/[0.03] text-ink-dim/60 tracking-wide border border-white/[0.04]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
