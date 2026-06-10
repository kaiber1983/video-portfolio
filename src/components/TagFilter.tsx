"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface TagFilterProps {
  tags: string[];
}

export default function TagFilter({ tags }: TagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag") || "";

  const handleClick = (tag: string) => {
    if (tag === activeTag) {
      router.push("/");
    } else {
      router.push(`/?tag=${encodeURIComponent(tag)}`);
    }
  };

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-10">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleClick(tag)}
          className={`px-4 py-1.5 rounded-full text-xs tracking-[0.08em] uppercase transition-all duration-400 ${
            activeTag === tag
              ? "bg-accent-dim text-white border border-accent-indigo/30 shadow-[0_0_20px_-5px_rgba(99,102,241,0.15)]"
              : "bg-transparent text-white border border-white/[0.08] hover:text-white hover:border-white/[0.15]"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
