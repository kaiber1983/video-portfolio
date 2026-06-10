"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.error || "登录失败");
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-2 text-center">管理后台</h1>
        <p className="text-white/65 text-sm text-center mb-8">
          请输入密码以继续
        </p>

        {error && (
          <div className="p-3 rounded-lg bg-red-900/50 text-red-300 text-sm border border-red-800 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密码"
            required
            autoFocus
            className="w-full px-4 py-3 rounded-lg bg-[#1e1e1e] border border-[#2a2a2a] focus:border-accent focus:outline-none transition-colors text-center"
          />
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full px-4 py-3 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-50 font-medium"
          >
            {loading ? "验证中..." : "登录"}
          </button>
        </form>
      </div>
    </div>
  );
}
