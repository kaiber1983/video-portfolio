"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({
  id,
}: {
  id: number;
  title: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    }
    setConfirming(false);
  };

  if (confirming) {
    return (
      <div className="flex gap-1">
        <button
          onClick={() => setConfirming(false)}
          className="px-2 py-1 rounded-md text-xs text-[#a0a0a0] border border-[#2a2a2a] hover:text-white transition-colors"
        >
          取消
        </button>
        <button
          onClick={handleDelete}
          className="px-2 py-1 rounded-md text-xs text-white bg-red-600 hover:bg-red-500 transition-colors"
        >
          确认删除
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="px-3 py-1 rounded-md bg-[#2a2a2a] text-red-400 hover:text-red-300 transition-colors text-xs"
    >
      删除
    </button>
  );
}
