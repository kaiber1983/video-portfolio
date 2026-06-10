"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { ReactLenis } from "lenis/react";
import Link from "next/link";
import TextSplitReveal from "@/components/TextSplitReveal";
import MagneticButton from "@/components/MagneticButton";

/* ── 动画 variants ── */

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const childVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ── 数据 ── */

const stats = [
  { label: "Resolution", value: "4K" },
  { label: "Frame Rate", value: "60fps" },
  { label: "Production", value: "3 Months" },
  { label: "Satisfaction", value: "100%" },
];

const processSteps = [
  {
    number: "01",
    title: "Concept",
    description: "深入理解需求，创意构思与故事板设计",
  },
  {
    number: "02",
    title: "Production",
    description: "专业拍摄设备，精准灯光与导演把控",
  },
  {
    number: "03",
    title: "Post",
    description: "精细剪辑，色彩分级与音效设计",
  },
];

/* ── 页面 ── */

export default function NextVideoPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const glowY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <ReactLenis root>
      <main className="bg-[#0A0A0B] text-white overflow-x-hidden">
        {/* ═══ Section 1: Hero ═══ */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        >
          {/* 视差金色光晕 */}
          <motion.div
            style={{ y: glowY }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,139,166,0.15)_0%,transparent_70%)] blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,139,166,0.08)_0%,transparent_60%)] blur-2xl animate-pulse-soft" />
          </motion.div>

          {/* Hero 内容 */}
          <motion.div
            className="relative z-10 text-center px-6 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.span
              variants={childVariants}
              className="inline-block text-xs tracking-[0.3em] uppercase text-accent-purple/80 font-body mb-8"
            >
              SHOWCASE · 作品展示
            </motion.span>

            <TextSplitReveal
              text="NEXT VIDEO"
              as="h1"
              staggerDelay={0.06}
              className="text-6xl md:text-8xl lg:text-9xl font-display font-bold tracking-tight leading-[1.1] mb-4"
            />

            <motion.p
              variants={childVariants}
              className="text-sm md:text-base tracking-[0.2em] uppercase text-accent-purple/50 font-body mb-6"
            >
              下一部作品
            </motion.p>

            <TextSplitReveal
              text="每一个作品，都是一段值得讲述的故事"
              as="p"
              staggerDelay={0.03}
              delay={0.6}
              className="text-lg md:text-xl text-neutral-400 font-body max-w-2xl mx-auto"
            />
          </motion.div>

          {/* 底部滚动提示 */}
          <motion.div
            style={{ opacity: heroOpacity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-xs tracking-[0.2em] uppercase text-neutral-500 font-body">
              Scroll
            </span>
            <div className="w-px h-12 bg-gradient-to-b from-neutral-500/50 to-transparent" />
          </motion.div>
        </section>

        {/* ═══ Section 2: About ═══ */}
        <section className="relative py-32 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
            >
              <motion.span
                variants={childVariants}
                className="inline-block text-xs tracking-[0.3em] uppercase text-accent-purple/60 font-body mb-4"
              >
                [01] ABOUT THE PROJECT
              </motion.span>

              <TextSplitReveal
                text="一部关于光影与情感的视觉叙事"
                as="h2"
                staggerDelay={0.05}
                delay={0.2}
                className="text-3xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-[1.15] mb-3"
              />

              <motion.p
                variants={childVariants}
                className="text-base md:text-lg text-accent-purple/50 font-body tracking-wide mb-8"
              >
                A Visual Narrative of Light and Emotion
              </motion.p>

              <TextSplitReveal
                text="通过镜头捕捉每一个动人瞬间，用画面讲述无法言说的故事。这是一次对视觉语言的深度探索，融合了电影叙事手法与先锋制作技术。"
                as="p"
                staggerDelay={0.025}
                delay={0.5}
                className="text-base md:text-lg text-neutral-400 font-body leading-relaxed max-w-3xl mb-16"
              />
            </motion.div>

            {/* 统计行 */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainerVariants}
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={staggerItemVariants}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-display font-bold text-accent-purple mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs tracking-[0.15em] uppercase text-neutral-500 font-body">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══ Section 3: Process ═══ */}
        <section className="relative py-32 px-6 bg-[#111113]">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="mb-16"
            >
              <motion.span
                variants={childVariants}
                className="inline-block text-xs tracking-[0.3em] uppercase text-accent-purple/60 font-body mb-4"
              >
                [02] THE PROCESS
              </motion.span>

              <TextSplitReveal
                text="从创意到成片，每一步都精益求精"
                as="h2"
                staggerDelay={0.04}
                delay={0.2}
                className="text-3xl md:text-5xl font-display font-bold tracking-tight leading-[1.15] mb-3"
              />

              <motion.p
                variants={childVariants}
                className="text-base md:text-lg text-accent-purple/50 font-body tracking-wide mb-6"
              >
                From Concept to Screen — Every Frame Matters
              </motion.p>

              <TextSplitReveal
                text="我们相信优秀的作品源于严谨的流程。从概念萌芽到最终交付，每个环节都有专业团队精心打磨。"
                as="p"
                staggerDelay={0.025}
                delay={0.4}
                className="text-base md:text-lg text-neutral-400 font-body leading-relaxed max-w-3xl"
              />
            </motion.div>

            {/* 流程卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1],
                        delay: index * 0.15,
                      },
                    },
                  }}
                >
                  <MagneticButton
                    strength={0.4}
                    className="block w-full p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-accent-purple/30 hover:bg-white/[0.04] transition-colors duration-500 text-left cursor-default"
                  >
                    <div className="text-5xl font-display font-bold text-accent-purple/30 mb-4">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-display font-semibold mb-3 text-white/90">
                      {step.title}
                    </h3>
                    <p className="text-sm text-neutral-500 font-body leading-relaxed">
                      {step.description}
                    </p>
                  </MagneticButton>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Section 4: CTA ═══ */}
        <section className="relative py-32 px-6 overflow-hidden">
          {/* 金色光晕 */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,139,166,0.10)_0%,transparent_70%)] blur-3xl" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.span
                variants={childVariants}
                className="inline-block text-xs tracking-[0.3em] uppercase text-accent-purple/60 font-body mb-6"
              >
                [03] GET IN TOUCH · 联系我们
              </motion.span>

              <TextSplitReveal
                text="Have a project in mind?"
                as="h2"
                staggerDelay={0.05}
                delay={0.2}
                className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-[1.1] mb-3"
              />

              <motion.p
                variants={childVariants}
                className="text-lg text-accent-purple/50 font-body tracking-wide mb-10"
              >
                有项目想聊聊？
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.6,
              }}
            >
              <MagneticButton
                href="/"
                strength={0.5}
                className="inline-block px-10 py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-body font-semibold text-base hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-shadow duration-300"
              >
                Start a Conversation
              </MagneticButton>

              <div className="mt-8">
                <Link
                  href="/"
                  className="text-sm text-neutral-500 hover:text-accent-purple transition-colors duration-300 font-body underline underline-offset-4"
                >
                  View all projects
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ Footer ═══ */}
        <footer className="border-t border-white/[0.06] py-8 px-6">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-sm text-neutral-500 font-body">
              &copy; {new Date().getFullYear()} Portfolio. All rights reserved.
            </span>
            <span className="text-xs text-neutral-600 font-body">
              每一个作品，都是一段故事
            </span>
          </div>
        </footer>
      </main>
    </ReactLenis>
  );
}
