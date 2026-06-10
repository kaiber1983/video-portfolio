import { Suspense } from "react";
import Hero3D from "@/components/Hero3D";
import FadeIn from "@/components/FadeIn";
import { readProjectsRemote } from "@/lib/data";
import type { Project } from "@/lib/data";
import HomeContent from "./HomeContent";

// 强制每次请求都重新渲染，不使用静态缓存
export const dynamic = "force-dynamic";

export default async function HomePage() {
  let projects: Project[] = [];
  let fetchError = false;

  try {
    projects = await readProjectsRemote();
  } catch {
    fetchError = true;
  }

  return (
    <main>
      <Hero3D />

      <section className="relative z-10">
        <div className="px-6 md:px-12 lg:px-16 xl:px-20 2xl:px-28 py-24">
          <FadeIn>
            <div className="flex items-center gap-4 mb-10">
              <span className="w-8 h-[1px] bg-accent-purple/30" />
              <span className="text-[10px] tracking-[0.25em] uppercase text-white/70 font-display">
                全部作品
              </span>
              <span className="w-8 h-[1px] bg-accent-purple/30" />
            </div>
          </FadeIn>

          <Suspense fallback={null}>
            <HomeContent projects={projects} error={fetchError} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
