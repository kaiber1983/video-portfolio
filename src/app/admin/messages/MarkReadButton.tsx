"use client";

import { useRouter } from "next/navigation";

export default function MarkReadButton({
  id,
  read,
}: {
  id: number;
  read: boolean;
}) {
  const router = useRouter();

  const toggleRead = async () => {
    await fetch(`/api/contact/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !read }),
    });
    router.refresh();
  };

  return (
    <button
      onClick={toggleRead}
      className={`text-xs px-2 py-1 rounded-md transition-colors ${
        read
          ? "bg-[#2a2a2a] text-[#a0a0a0] hover:text-white"
          : "bg-accent/20 text-accent hover:bg-accent/30"
      }`}
    >
      {read ? "标为未读" : "标为已读"}
    </button>
  );
}
