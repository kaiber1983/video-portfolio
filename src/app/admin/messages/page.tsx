import Link from "next/link";
import { readMessages } from "@/lib/data";
import MarkReadButton from "./MarkReadButton";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const messages = readMessages().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-[#a0a0a0] hover:text-[#f0f0f0] transition-colors mb-6"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M10 4L6 8L10 12" />
        </svg>
        返回管理后台
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold">留言管理</h1>
        <p className="text-sm text-[#a0a0a0] mt-1">
          共 {messages.length} 条留言
          {unreadCount > 0 && (
            <span className="text-accent ml-1">
              （{unreadCount} 条未读）
            </span>
          )}
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-20 text-[#a0a0a0]">
          <p className="text-lg">暂无留言</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-xl border p-5 transition-colors ${
                m.read
                  ? "bg-[#1e1e1e] border-[#2a2a2a]"
                  : "bg-[#1e1e1e] border-accent/40"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="font-medium">{m.name}</span>
                  <span className="text-[#a0a0a0] text-sm ml-3">
                    {m.email}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!m.read && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent">
                      未读
                    </span>
                  )}
                  <span className="text-xs text-[#666]">
                    {new Date(m.createdAt).toLocaleDateString("zh-CN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <MarkReadButton id={m.id} read={m.read} />
                </div>
              </div>
              <p className="text-sm text-[#a0a0a0] leading-relaxed whitespace-pre-line">
                {m.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
