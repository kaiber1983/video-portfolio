import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unreadCount = await prisma.contactMessage.count({
    where: { read: false },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* 页面头部 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">管理后台</h1>
          <p className="text-sm text-[#a0a0a0] mt-1">
            共 {projects.length} 个作品
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/about"
            className="px-4 py-2 rounded-lg bg-[#1e1e1e] text-[#a0a0a0] hover:text-white hover:bg-[#2a2a2a] transition-colors text-sm font-medium"
          >
            关于我
          </Link>
          <Link
            href="/admin/messages"
            className="px-4 py-2 rounded-lg bg-[#1e1e1e] text-[#a0a0a0] hover:text-white hover:bg-[#2a2a2a] transition-colors text-sm font-medium relative"
          >
            留言
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>
          <Link
            href="/admin/new"
            className="px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors text-sm font-medium"
          >
            + 新建作品
          </Link>
        </div>
      </div>

      {/* 作品列表 */}
      {projects.length === 0 ? (
        <div className="text-center py-20 text-[#a0a0a0]">
          <p className="text-lg">还没有作品</p>
          <Link
            href="/admin/new"
            className="text-accent hover:text-accent-hover text-sm mt-2 inline-block"
          >
            创建第一个作品
          </Link>
        </div>
      ) : (
        <div className="bg-[#1e1e1e] rounded-xl border border-[#2a2a2a] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a2a] text-[#a0a0a0]">
                <th className="text-left px-4 py-3 font-medium">标题</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                  平台
                </th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                  标签
                </th>
                <th className="text-left px-4 py-3 font-medium w-16">精选</th>
                <th className="text-right px-4 py-3 font-medium w-32">操作</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-[#2a2a2a] last:border-none hover:bg-[#2a2a2a]/50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3 text-[#a0a0a0] hidden md:table-cell">
                    {p.platform === "youtube" ? "YouTube" : "Bilibili"}
                  </td>
                  <td className="px-4 py-3 text-[#a0a0a0] hidden md:table-cell">
                    {p.tags || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {p.featured ? (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-accent/20 text-accent">
                        精选
                      </span>
                    ) : (
                      <span className="text-[#666]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/edit/${p.id}`}
                        className="px-3 py-1 rounded-md bg-[#2a2a2a] text-[#a0a0a0] hover:text-white transition-colors text-xs"
                      >
                        编辑
                      </Link>
                      <DeleteButton id={p.id} title={p.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
