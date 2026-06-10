"use client";

import { useState } from "react";
import FadeIn from "@/components/FadeIn";

export default function ContactPage() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name") as string,
      email: form.get("email") as string,
      message: form.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "发送失败");
      }

      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "发送失败");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-start justify-center px-4 py-16 md:py-20">
      <div className="w-full max-w-lg">
        <FadeIn>
          {/* 标题区 */}
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-[1px] bg-accent-blue/50" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-ink-dim font-display">
              Contact
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl gradient-text mb-3">
            联系我
          </h1>
          <p className="text-ink-muted font-light mb-10 tracking-wide">
            有合作意向或想聊聊？欢迎留言。
          </p>
        </FadeIn>

        {status === "success" ? (
          <FadeIn delay={100}>
            <div className="p-8 rounded-xl border border-accent-indigo/20 bg-accent-dim/50 text-center">
              <div className="w-12 h-12 rounded-full border-2 border-accent-indigo/40 flex items-center justify-center mx-auto mb-4">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#6366F1" strokeWidth="2">
                  <path d="M4 10L8 14L16 6" />
                </svg>
              </div>
              <p className="text-accent-indigo text-lg font-display mb-1">
                留言已发送
              </p>
              <p className="text-ink-muted text-sm font-light">
                感谢你的留言，我会尽快回复。
              </p>
            </div>
          </FadeIn>
        ) : (
          <FadeIn delay={100}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === "error" && (
                <div className="p-3 rounded-lg border border-red-500/30 bg-red-950/50 text-red-400 text-sm">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs tracking-wider uppercase mb-2 text-ink-dim">
                  姓名 *
                </label>
                <input
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-surface-card border border-white/[0.08] text-ink placeholder:text-ink-dim focus:border-accent-indigo/40 focus:outline-none transition-all duration-300 text-sm"
                  placeholder="你的名字"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-xs tracking-wider uppercase mb-2 text-ink-dim">
                  邮箱 *
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-surface-card border border-white/[0.08] text-ink placeholder:text-ink-dim focus:border-accent-indigo/40 focus:outline-none transition-all duration-300 text-sm"
                  placeholder="your@email.com"
                  maxLength={200}
                />
              </div>

              <div>
                <label className="block text-xs tracking-wider uppercase mb-2 text-ink-dim">
                  留言 *
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-surface-card border border-white/[0.08] text-ink placeholder:text-ink-dim focus:border-accent-indigo/40 focus:outline-none transition-all duration-300 text-sm resize-none"
                  placeholder="你想说什么..."
                  maxLength={2000}
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple text-white hover:opacity-90 transition-opacity duration-300 text-sm tracking-wider uppercase disabled:opacity-40 shadow-sm"
              >
                {status === "loading" ? "发送中..." : "发送留言"}
              </button>
            </form>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
