import Link from "next/link";
import { readProjectsRemote } from "@/lib/data";
import LogoutButton from "./LogoutButton";
import SortableProjectTable from "@/components/SortableProjectTable";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const projects = await readProjectsRemote();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* 页面头部 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">管理后台</h1>
          <p className="text-sm text-white/65 mt-1">
            共 {projects.length} 个作品
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LogoutButton />
          <Link
            href="/admin/about"
            className="px-4 py-2 rounded-lg bg-[#1e1e1e] text-white/65 hover:text-white hover:bg-[#2a2a2a] transition-colors text-sm font-medium"
          >
            关于我
          </Link>
          <Link
            href="/admin/messages"
            className="px-4 py-2 rounded-lg bg-[#1e1e1e] text-white/65 hover:text-white hover:bg-[#2a2a2a] transition-colors text-sm font-medium"
          >
            留言
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
        <div className="text-center py-20 text-white/65">
          <p className="text-lg">还没有作品</p>
          <Link
            href="/admin/new"
            className="text-accent hover:text-white text-sm mt-2 inline-block"
          >
            创建第一个作品
          </Link>
        </div>
      ) : (
        <SortableProjectTable projects={projects} />
      )}
    </div>
  );
}
