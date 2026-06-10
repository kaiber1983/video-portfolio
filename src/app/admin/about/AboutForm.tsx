"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SocialLinks {
  [key: string]: string;
}

interface AboutFormData {
  name: string;
  bio: string;
  avatarUrl: string;
  socialLinks: SocialLinks;
}

export default function AboutForm({
  initialData,
}: {
  initialData?: AboutFormData;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const defaultSocials = initialData?.socialLinks ?? {
    bilibili: "",
    youtube: "",
    weibo: "",
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    const form = new FormData(e.currentTarget);
    const socialLinks: SocialLinks = {};
    const entries = Array.from(form.entries());
    for (const [key, value] of entries) {
      if (key.startsWith("social_")) {
        const platform = key.replace("social_", "");
        if (value) socialLinks[platform] = value as string;
      }
    }

    const data: AboutFormData = {
      name: form.get("name") as string,
      bio: form.get("bio") as string,
      avatarUrl: form.get("avatarUrl") as string,
      socialLinks,
    };

    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("保存失败");

      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setSuccess(false);
      setError(err instanceof Error ? err.message : "保存失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {success && (
        <div className="p-3 rounded-lg bg-green-900/50 text-green-300 text-sm border border-green-800">
          保存成功
        </div>
      )}
      {error && (
        <div className="p-3 rounded-lg bg-red-900/50 text-red-300 text-sm border border-red-800">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1.5 text-[#a3a3a3]">
          姓名
        </label>
        <input
          name="name"
          defaultValue={initialData?.name}
          required
          className="w-full px-3 py-2.5 rounded-lg bg-[#1a1a1a] border border-white/[0.06] focus:border-accent focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5 text-[#a3a3a3]">
          头像 URL
        </label>
        <input
          name="avatarUrl"
          defaultValue={initialData?.avatarUrl}
          placeholder="https://images.unsplash.com/..."
          className="w-full px-3 py-2.5 rounded-lg bg-[#1a1a1a] border border-white/[0.06] focus:border-accent focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5 text-[#a3a3a3]">
          个人简介
        </label>
        <textarea
          name="bio"
          defaultValue={initialData?.bio}
          rows={6}
          className="w-full px-3 py-2.5 rounded-lg bg-[#1a1a1a] border border-white/[0.06] focus:border-accent focus:outline-none transition-colors resize-none"
        />
      </div>

      <div>
        <p className="text-sm font-medium mb-3 text-[#a3a3a3]">社交链接</p>
        <div className="space-y-3">
          {Object.entries(defaultSocials).map(([platform, url]) => (
            <div key={platform}>
              <label className="block text-xs mb-1 text-[#666]">
                {platform}
              </label>
              <input
                name={`social_${platform}`}
                defaultValue={url}
                placeholder={`https://${platform}.com/...`}
                className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-white/[0.06] focus:border-accent focus:outline-none transition-colors text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2.5 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-50"
      >
        {loading ? "保存中..." : "保存"}
      </button>
    </form>
  );
}
