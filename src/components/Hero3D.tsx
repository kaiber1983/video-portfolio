"use client";

import { useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useScrollProgress } from "@/components/Scene3D";

const Scene3D = dynamic(() => import("@/components/Scene3D"), { ssr: false });

// 粉色钻石光标 SVG
const DIAMOND_CURSOR = [
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'",
  "width='24' height='24' viewBox='0 0 24 24'%3E%3Cdefs%3E",
  "%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E",
  "%3Cstop offset='0%25' stop-color='%23ECA8D6'/%3E",
  "%3Cstop offset='100%25' stop-color='%23D48BA6'/%3E",
  "%3C/linearGradient%3E%3C/defs%3E",
  "%3Cpath d='M12 2l3 4h4l-3 4l3 4h-4l-3 4l-3-4H5l3-4l-3-4h4z'",
  "fill='url(%23g)' stroke='%23B06D8A' stroke-width='0.5'/%3E",
  "%3Ccircle cx='12' cy='12' r='2' fill='white' opacity='0.6'/%3E",
  "%3C/svg%3E\") 12 2, auto",
].join("");

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.3 },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null!);
  const scrollRef = useScrollProgress();

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-surface"
      style={{ cursor: DIAMOND_CURSOR }}
    >
      {/* 3D 场景 */}
      <div className="absolute inset-0">
        <Suspense fallback={null}>
          <Canvas
            camera={{ position: [0, 1.5, 8], fov: 50 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
          >
            <Scene3D scrollRef={scrollRef} />
          </Canvas>
        </Suspense>
      </div>

      {/* 粉紫光晕装饰 */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-[#ECA8D6]/8 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-[#D48BA6]/6 blur-[120px] pointer-events-none" />

      {/* HTML 覆盖层 */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={childVariants}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span className="w-8 h-[1px] bg-accent-purple/30" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-accent-purple/70 font-display">
              Director&apos;s Cut
            </span>
            <span className="w-8 h-[1px] bg-accent-purple/30" />
          </motion.div>

          <motion.h1
            variants={childVariants}
            className="font-display text-5xl md:text-7xl leading-tight mb-4"
            style={{
              background: "linear-gradient(135deg, #ECA8D6 0%, #D48BA6 50%, #B06D8A 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            光影漫记
          </motion.h1>

          <motion.p
            variants={childVariants}
            className="text-base md:text-lg tracking-wide text-accent-purple/60 font-body"
          >
            Visual Stories — Where Light Meets Shadow
          </motion.p>

          <motion.div
            variants={childVariants}
            className="flex items-center justify-center gap-4 mt-10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent-purple/50 animate-pulse-soft" />
            <span className="text-[11px] tracking-[0.15em] uppercase text-accent-purple/60 font-display">
              Scroll to explore
            </span>
            <span className="w-8 h-[1px] bg-accent-indigo/20" />
          </motion.div>
        </motion.div>
      </div>

      {/* 底部渐变 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-surface pointer-events-none z-20" />
    </section>
  );
}
