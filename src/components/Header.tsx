"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "作品" },
    { href: "/about", label: "关于" },
    { href: "/contact", label: "联系" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0A0A0B]/80 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.06)]"
          : "bg-transparent"
      }`}
    >
      {/* 顶部蓝紫渐变线 */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent" />

      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="relative group"
        >
          <span className="text-lg font-display tracking-[0.15em] gradient-text">
            STUDIO
          </span>
          <span className="block text-[9px] tracking-[0.3em] text-ink-dim uppercase text-right -mt-0.5">
            Portfolio
          </span>
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent-indigo transition-all duration-500 group-hover:w-full" />
        </Link>

        {/* 导航链接 */}
        <div className="flex items-center gap-1">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`relative px-3.5 py-1.5 rounded-lg text-sm tracking-wider transition-all duration-300 ${
                  isActive
                    ? "text-accent-indigo"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-accent-indigo rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
