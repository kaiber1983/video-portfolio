import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import BackButton from "@/components/BackButton";
import VideoEmbed from "@/components/VideoEmbed";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = await prisma.project.findUnique({
    where: { id: parseInt(params.id) },
    select: { title: true, description: true },
  });
  if (!project) return { title: "作品未找到" };
  return {
    title: `${project.title} - 作品详情`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await prisma.project.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!project) {
    notFound();
  }

  const tags = project.tags.split(",").filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
      {/* 面包屑 */}
      <BackButton />

      {/* 视频播放器 */}
      <div className="rounded-xl overflow-hidden border border-white/[0.06] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.3)]">
        <VideoEmbed
          videoUrl={project.videoUrl}
          platform={project.platform}
          title={project.title}
        />
      </div>

      {/* 作品信息 */}
      <div className="mt-8 space-y-6">
        <div className="gradient-divider" />

        <h1 className="font-display text-2xl md:text-3xl gradient-text">
          {project.title}
        </h1>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <a
              key={tag}
              href={`/?tag=${encodeURIComponent(tag)}`}
              className="text-[10px] px-3 py-1 rounded-full border border-white/[0.08] text-ink-dim hover:text-accent-indigo hover:border-accent-indigo/30 transition-all duration-300 tracking-wider uppercase"
            >
              {tag.trim()}
            </a>
          ))}
        </div>

        {/* 描述 */}
        <p className="text-ink-muted leading-relaxed whitespace-pre-line font-light">
          {project.description}
        </p>

        {/* 元信息 */}
        <div className="text-xs text-ink-dim pt-6 gradient-divider">
          <div className="flex items-center gap-4 pt-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-accent-blue/50" />
              发布平台：{project.platform === "youtube" ? "YouTube" : "Bilibili"}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-accent-purple/50" />
              添加于 {new Date(project.createdAt).toLocaleDateString("zh-CN")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
