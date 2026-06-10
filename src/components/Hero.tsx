interface HeroProps {
  title: string;
  subtitle?: string;
  compact?: boolean;
}

export default function Hero({ title, subtitle, compact }: HeroProps) {
  return (
    <section
      className={`relative overflow-hidden ${
        compact
          ? "pt-16 pb-10"
          : "pt-24 pb-16 md:pt-32 md:pb-20"
      }`}
    >
      {/* 背景光晕 — 蓝紫 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-accent-blue/5 blur-[100px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-accent-purple/8 blur-[80px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative">
        {!compact && (
          <div className="flex items-center gap-3 mb-6">
            <span className="w-6 h-[1px] bg-accent-blue/50" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-ink-dim font-display">
              Director&apos;s Cut
            </span>
          </div>
        )}

        <h1
          className={`font-display gradient-text leading-tight ${
            compact ? "text-3xl" : "text-5xl md:text-7xl"
          }`}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className={`mt-4 text-ink-muted font-light tracking-wide max-w-xl ${
              compact ? "text-sm" : "text-base md:text-lg"
            }`}
          >
            {subtitle}
          </p>
        )}

        {!compact && (
          <div className="flex items-center gap-4 mt-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue/50 animate-pulse-soft" />
            <span className="text-[11px] tracking-[0.15em] uppercase text-ink-dim">
              Scroll to explore
            </span>
            <span className="w-8 h-[1px] bg-accent-indigo/20" />
          </div>
        )}
      </div>
    </section>
  );
}
