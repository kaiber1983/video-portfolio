import Image from "next/image";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "关于我",
  description: "了解我和我的创作故事",
};

const socialIcons: Record<string, JSX.Element> = {
  bilibili: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 01-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 01.16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.249-.56.373-.933.373s-.684-.124-.933-.373c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.249-.56.373-.933.373s-.684-.124-.933-.373c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z" />
    </svg>
  ),
  youtube: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  weibo: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zm3.743-6.457c-.375-.924-1.158-1.668-2.23-2.117-.497-.209-.65-.215-.9-.1-.166.077-.208.264-.094.419.296.401.55.875.688 1.371.175.637.142 1.133-.099 1.248-.241.116-.616-.17-.95-.561-.563-.659-.934-1.499-1.078-2.444-.041-.266-.009-.385.071-.354.686.253 1.613.885 2.07 1.754.538 1.021.441 2.052-.123 2.052-.034 0-.098-.046-.194-.122-.749-.598-1.404-1.88-1.662-3.408-.246-1.467.219-2.957 1.158-3.716 1.126-.909 2.691-.909 4.01-.164 1.374.774 2.104 2.228 1.889 3.757-.196 1.396-1.04 2.681-2.187 3.332-.961.544-1.843.508-1.843-.095 0-.226.1-.502.239-.75z" />
    </svg>
  ),
};

const socialNames: Record<string, string> = {
  bilibili: "Bilibili",
  youtube: "YouTube",
  weibo: "微博",
};

export default async function AboutPage() {
  let about: Awaited<ReturnType<typeof prisma.about.findFirst>> | null = null;
  try {
    about = await prisma.about.findFirst();
  } catch {
    console.warn("数据库不可用，显示空状态");
  }

  if (!about) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-4xl gradient-text mb-4">关于我</h1>
        <p className="text-ink-muted">暂无信息</p>
      </div>
    );
  }

  const socialLinks = JSON.parse(about.socialJson) as Record<string, string>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 md:py-20">
      <FadeIn>
        {/* 页面标题 */}
        <div className="flex items-center gap-3 mb-8">
          <span className="w-6 h-[1px] bg-accent-blue/50" />
          <span className="text-[10px] tracking-[0.25em] uppercase text-ink-dim font-display">
            About
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
          {/* 头像 */}
          <div className="shrink-0">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-surface-muted relative ring-2 ring-accent-indigo/20 ring-offset-2 ring-offset-surface">
              <Image
                src={about.avatarUrl}
                alt={about.name}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 信息 */}
          <div className="text-center md:text-left flex-1">
            <h1 className="font-display text-3xl md:text-4xl gradient-text mb-4">
              {about.name}
            </h1>
            <p className="text-ink-muted leading-relaxed whitespace-pre-line max-w-lg font-light">
              {about.bio}
            </p>
          </div>
        </div>
      </FadeIn>

      {/* 社交链接 */}
      {Object.keys(socialLinks).length > 0 && (
        <FadeIn delay={150}>
          <div className="mt-12 pt-8 gradient-divider">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-6 h-[1px] bg-accent-blue/40" />
              <h2 className="font-display text-sm tracking-[0.2em] uppercase text-accent-indigo">
                找到我
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {Object.entries(socialLinks).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-white/[0.08] text-ink-muted hover:text-accent-indigo hover:border-accent-indigo/30 transition-all duration-300 group"
                >
                  <span className="group-hover:text-accent-indigo transition-colors">
                    {socialIcons[platform] || null}
                  </span>
                  <span className="text-sm tracking-wide">
                    {socialNames[platform] || platform}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
