import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/data";
import ProjectCard from "./ProjectCard";
import FadeIn from "./FadeIn";

// ============ 作品副标题 ============
const SUBTITLES: Record<number, { zh: string; en: string }> = {
  3: { zh: "星际征途 — 科幻视觉史诗", en: "A Sci-Fi Vision" },
  1: { zh: "古都新韵 — 数字之眼", en: "Echoes of Chang'an" },
  6: { zh: "逆袭的星光 — 影后归来", en: "Star Reborn" },
  2: { zh: "穿越银河的温柔冒险", en: "Beyond the Stars" },
  4: { zh: "天府画卷 — 蜀地诗篇", en: "Scroll of Sichuan" },
  5: { zh: "速度与美学的极致表达", en: "Velocity Refined" },
};

// ============ 宽幅横幅卡片 ============
function HeroBanner({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const isEven = index % 2 === 0;
  const sub = SUBTITLES[project.id];
  const tags = project.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <Link
      href={`/project/${project.id}`}
      className="group block rounded-2xl overflow-hidden border border-white/[0.03] bg-[#0c0c0e] transition-all duration-500 hover:border-white/[0.08] hover:shadow-[0_20px_60px_-16px_rgba(212,139,166,0.1)]"
    >
      <div
        className={`flex flex-col ${
          isEven ? "lg:flex-row" : "lg:flex-row-reverse"
        }`}
      >
        {/* 图片区 */}
        <div className="lg:w-[55%] aspect-[16/10] lg:aspect-auto lg:min-h-[400px] relative overflow-hidden bg-[#0a0a0b]">
          {/* 序号水印 */}
          <span className="absolute top-6 left-6 z-10 text-7xl font-display text-white/[0.06] select-none pointer-events-none">
            {String(index + 1).padStart(2, "0")}
          </span>

          {/* 精选标记 */}
          <span className="absolute top-6 right-6 z-10 px-3 py-1 rounded-md text-[10px] font-medium tracking-[0.2em] uppercase bg-accent/20 text-white/90 backdrop-blur-sm border border-accent/10">
            精选
          </span>

          {/* 悬停遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[1]" />

          <Image
            src={project.thumbnail}
            alt={project.title}
            width={1400}
            height={800}
            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.03]"
            priority={index < 2}
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
        <div className="lg:w-[45%] flex flex-col justify-center p-8 lg:p-12 space-y-5">
          {/* 顶部装饰线 */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-[0.25em] uppercase text-white/40 font-display">
              Featured Work
            </span>
            <span className="flex-1 h-[1px] bg-accent-purple/[0.08]" />
          </div>

          {/* 标题 + 副标题 */}
          <div>
            <h3 className="text-2xl lg:text-3xl font-display text-ink group-hover:text-white/90 transition-colors duration-300 tracking-wide leading-tight">
              {project.title}
            </h3>

            {sub && (
              <div className="mt-3 space-y-0.5">
                <p className="text-sm text-white/60 font-light leading-relaxed">
                  {sub.zh}
                </p>
                <p className="text-[11px] tracking-[0.15em] uppercase text-white/30 font-display">
                  {sub.en}
                </p>
              </div>
            )}
          </div>

          {/* 描述 */}
          {project.description && (
            <p className="text-sm text-white/50 leading-relaxed line-clamp-3 font-light">
              {project.description}
            </p>
          )}

          {/* 底部信息行 */}
          <div className="flex items-center justify-between pt-3">
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-3 py-1 rounded-md bg-white/[0.03] text-white/50 tracking-wide border border-white/[0.04]"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="text-[11px] text-white/30 self-center">
                  +{tags.length - 3}
                </span>
              )}
            </div>

            <span className="text-[10px] tracking-[0.2em] uppercase text-white/30 font-display flex items-center gap-1.5 group-hover:text-white/60 transition-colors shrink-0">
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

// ============ 作品展示网格 ============
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
        <p className="text-2xl font-display text-white/40 mb-3">
          暂无作品
        </p>
        <p className="text-sm text-white/40">换个标签筛选试试</p>
      </div>
    );
  }

  const featured = projects.filter((p) => p.featured);
  const regular = projects.filter((p) => !p.featured);

  return (
    <div className="space-y-24 lg:space-y-32">
      {/* 精选作品横幅 — 交替布局 */}
      {featured.length > 0 && (
        <div className="space-y-16 lg:space-y-24">
          {featured.map((project, i) => (
            <FadeIn key={project.id} delay={i * 120}>
              <HeroBanner project={project} index={i} />
            </FadeIn>
          ))}
        </div>
      )}

      {/* 普通作品双列网格 */}
      {regular.length > 0 && (
        <>
          {featured.length > 0 && (
            <FadeIn>
              <div className="flex items-center gap-4 mb-12">
                <span className="w-8 h-[1px] bg-accent-purple/10" />
                <span className="text-[10px] tracking-[0.25em] uppercase text-white/40 font-display">
                  更多作品
                </span>
                <span className="flex-1 h-[1px] bg-accent-purple/[0.04]" />
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
    </div>
  );
}
