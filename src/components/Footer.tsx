export default function Footer() {
  return (
    <footer className="relative mt-24">
      {/* 蓝紫渐变分割线 */}
      <div className="gradient-divider" />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* 左侧品牌 */}
          <div className="text-center md:text-left">
            <p className="font-display text-sm tracking-[0.15em] gradient-text">
              STUDIO PORTFOLIO
            </p>
            <p className="text-[10px] text-ink-dim tracking-[0.2em] uppercase mt-1">
              Director&apos;s Cut
            </p>
          </div>

          {/* 中间版权 */}
          <p className="text-xs text-ink-muted tracking-wider">
            &copy; {new Date().getFullYear()} All Rights Reserved
          </p>

          {/* 右侧 */}
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue/50 animate-pulse-soft" />
            <span className="text-[10px] text-ink-dim tracking-[0.15em] uppercase">
              —— 每一个作品，都是一段故事
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
