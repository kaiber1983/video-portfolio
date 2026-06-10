"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

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
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // 确保视频自动播放（某些浏览器会在加载后暂停）
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* 视频背景 */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* 暗色遮罩，确保文字可读 */}
        <div className="absolute inset-0 bg-black/55" />
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
            className="font-pixel text-5xl md:text-7xl leading-tight mb-4"
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
