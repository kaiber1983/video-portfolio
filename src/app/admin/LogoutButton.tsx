"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 rounded-lg bg-[#1e1e1e] text-white/65 hover:text-red-400 hover:bg-[#2a2a2a] transition-colors text-sm font-medium"
    >
      退出
    </button>
  );
}
