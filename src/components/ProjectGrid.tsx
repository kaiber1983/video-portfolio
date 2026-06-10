import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/data";
import ProjectCard from "./ProjectCard";
import FadeIn from "./FadeIn";

/** 精选作品的宽幅横幅卡片 */
function HeroBanner({ project, index }: { project: Project; index: number }) {
  const tags = project.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <Link
      href={`/project/${project.id}`}
      className="group block rounded-2xl overflow-hidden border border-white/[0.04] bg-[#0c0c0e] transition-all duration-500 hover:border-white/[0.1] hover:shadow-[0_20px_60px_-16px_rgba(212,139,166,0.12)]"
    >
      <div className="flex flex-col lg:flex-row">
        {/* 图片区 */}
        <div className="lg:w-[55%] aspect-[16/10] lg:aspect-auto lg:min-h-[360px] relative overflow-hidden bg-[#0a0a0b]">
          {/* 序号 */}
          <span className="absolute top-5 left-5 z-10 text-6xl font-display text-white/10 select-none">
            {String(index + 1).padStart(2, "0")}
          </span>

          {/* 精选标记 */}
          <span className="absolute top-5 right-5 z-10 px-3 py-1 rounded-md text-[10px] font-medium tracking-[0.2em] uppercase bg-accent/20 text-accent-purple/90 backdrop-blur-sm border border-accent/10">
            精选
          </span>

          {/* 悬停遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[1]" />

          <Image
            src={project.thumbnail}
            alt={project.title}
            width={1200}
            height={675}
            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.03]"
          />

          {/* 光泽扫过 */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-[2]">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(236,168,214,0.04) 45%, rgba(212,139,166,0.06) 50%, rgba(236,168,214,0.04) 55%, transparent 60%)",
                transform: "translateX(-100%)",
                transition: "transform 0.8s ease-out",
              }}
            />
          </div>
        </div>

        {/* 文字区 */}
        <div className="lg:w-[45%] flex flex-col justify-center p-8 lg:p-10 space-y-5">
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-[0.2em] uppercase text-accent-purple/50 font-display">
              Featured Work
            </span>
            <span className="flex-1 h-[1px] bg-accent-purple/10" />
          </div>

          <h3 className="text-2xl lg:text-3xl font-display text-ink group-hover:text-accent-purple/90 transition-colors duration-300 tracking-wide leading-tight">
            {project.title}
          </h3>

          {project.description && (
            <p className="text-sm text-ink-muted/70 leading-relaxed line-clamp-3 font-light">
              {project.description}
            </p>
          )}

          {/* 底部信息行 */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-3 py-1 rounded-md bg-white/[0.03] text-ink-dim/60 tracking-wide border border-white/[0.04]"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="text-[11px] text-ink-dim/40 self-center">
                  +{tags.length - 3}
                </span>
              )}
            </div>

            <span className="text-[10px] tracking-[0.2em] uppercase text-accent-purple/40 font-display flex items-center gap-1 group-hover:text-accent-purple/60 transition-colors">
              浏览作品
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              >
                <path
                  d="M1 6H11M11 6L7 2M11 6L7 10"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ProjectGrid({
  projects,
  stagger,
}: {
  projects: Project[];
  stagger?: boolean;
}) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-32">
        <p className="text-2xl font-display text-ink-muted/60 mb-3">
          暂无作品
        </p>
        <p className="text-sm text-ink-dim/50">换个标签筛选试试</p>
      </div>
    );
  }

  const featured = projects.filter((p) => p.featured);
  const regular = projects.filter((p) => !p.featured);

  return (
    <div className="space-y-20">
      {/* 精选作品 - 大幅横幅 */}
      {featured.length > 0 && (
        <div className="space-y-12">
          {featured.map((project, i) => (
            <FadeIn key={project.id} delay={i * 150}>
              <HeroBanner project={project} index={i} />
            </FadeIn>
          ))}
        </div>
      )}

      {/* 全部作品 - 双列宽敞布局 */}
      {regular.length > 0 && (
        <>
          {featured.length > 0 && (
            <FadeIn>
              <div className="flex items-center gap-4 mb-10">
                <span className="w-8 h-[1px] bg-accent-purple/15" />
                <span className="text-[10px] tracking-[0.25em] uppercase text-accent-purple/50 font-display">
                  更多作品
                </span>
                <span className="flex-1 h-[1px] bg-accent-purple/8" />
              </div>
            </FadeIn>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {regular.map((project, i) =>
              stagger ? (
                <FadeIn key={project.id} delay={i * 80}>
                  <ProjectCard project={project} />
                </FadeIn>
              ) : (
                <ProjectCard key={project.id} project={project} />
              )
            )}
          </div>
        </>
      )}

      {/* 没有精选也没有普通作品时，全部放在网格里 */}
      {regular.length === 0 && featured.length === 0 && (
        <div className="text-center py-32">
          <p className="text-2xl font-display text-ink-muted/60 mb-3">
            暂无作品
          </p>
          <p className="text-sm text-ink-dim/50">换个标签筛选试试</p>
        </div>
      )}
    </div>
  );
}
