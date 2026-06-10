"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import DeleteButton from "@/app/admin/DeleteButton";

interface Project {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  platform: string;
  tags: string;
  featured: boolean;
  createdAt: string;
}

interface Props {
  projects: Project[];
}

export default function SortableProjectTable({ projects: initialProjects }: Props) {
  const [projects, setProjects] = useState(initialProjects);
  const [dragId, setDragId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // 当外部数据变化时同步（如删除后 router.refresh）
  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const handleDragStart = useCallback((e: React.DragEvent, id: number) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
    // 拖拽时让浏览器显示半透明的行
    const el = e.currentTarget as HTMLElement;
    requestAnimationFrame(() => {
      el.style.opacity = "0.4";
    });
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setDragId(null);
    const el = e.currentTarget as HTMLElement;
    el.style.opacity = "1";
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, targetId: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (dragId === null || dragId === targetId) return;

      setProjects((prev) => {
        const dragIndex = prev.findIndex((p) => p.id === dragId);
        const targetIndex = prev.findIndex((p) => p.id === targetId);
        if (dragIndex === -1 || targetIndex === -1) return prev;

        const next = [...prev];
        const [removed] = next.splice(dragIndex, 1);
        next.splice(targetIndex, 0, removed);
        return next;
      });
    },
    [dragId]
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setDragId(null);
      setSaving(true);

      try {
        const res = await fetch("/api/projects/reorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: projects.map((p) => p.id) }),
        });

        if (!res.ok) {
          const text = await res.text();
          let err = "保存排序失败";
          try { err = JSON.parse(text).error || err; } catch {}
          throw new Error(err);
        }

        setMessage("排序已保存");
        setTimeout(() => setMessage(""), 2000);
      } catch (err) {
        console.error("排序保存失败:", err);
        setMessage("排序保存失败，请刷新重试");
      } finally {
        setSaving(false);
      }
    },
    [projects]
  );

  // 删除后从本地状态移除，无需等服务器刷新
  const handleDeleted = useCallback((id: number) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <div className="relative">
      {/* 状态提示 */}
      {message && (
        <div
          className={`mb-3 px-3 py-2 rounded-lg text-xs ${
            message.includes("失败")
              ? "bg-red-900/50 text-red-300 border border-red-800"
              : "bg-green-900/50 text-green-300 border border-green-800"
          }`}
        >
          {message}
          {saving && " ..."}
        </div>
      )}

      <div className="bg-[#1e1e1e] rounded-xl border border-[#2a2a2a] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a] text-white/65">
              <th className="w-12 px-2 py-3 text-center text-xs text-white/33 font-normal">
                排序
              </th>
              <th className="text-left px-4 py-3 font-medium w-14">#</th>
              <th className="text-left px-4 py-3 font-medium">标题</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                平台
              </th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                标签
              </th>
              <th className="text-left px-4 py-3 font-medium w-16">精选</th>
              <th className="text-right px-4 py-3 font-medium w-28">操作</th>
            </tr>
          </thead>
          <tbody onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
            {projects.map((p, i) => (
              <tr
                key={p.id}
                draggable
                onDragStart={(e) => handleDragStart(e, p.id)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, p.id)}
                className={`border-b border-[#2a2a2a] last:border-none hover:bg-[#2a2a2a]/50 transition-colors select-none ${
                  dragId === p.id ? "" : "cursor-grab"
                }`}
              >
                <td className="px-2 py-3 text-center cursor-grab active:cursor-grabbing select-none">
                  <svg
                    className="mx-auto"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <circle cx="6" cy="3" r="1.5" fill="#666" />
                    <circle cx="10" cy="3" r="1.5" fill="#666" />
                    <circle cx="6" cy="8" r="1.5" fill="#666" />
                    <circle cx="10" cy="8" r="1.5" fill="#666" />
                    <circle cx="6" cy="13" r="1.5" fill="#666" />
                    <circle cx="10" cy="13" r="1.5" fill="#666" />
                  </svg>
                </td>
                <td className="px-4 py-3 text-white/33 font-mono text-xs">{i + 1}</td>
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3 text-white/65 hidden md:table-cell">
                  {p.platform === "youtube" ? "YouTube" : "Bilibili"}
                </td>
                <td className="px-4 py-3 text-white/65 hidden md:table-cell">
                  {p.tags || "—"}
                </td>
                <td className="px-4 py-3">
                  {p.featured ? (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-accent/20 text-white">
                      精选
                    </span>
                  ) : (
                    <span className="text-white/40">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/edit/${p.id}`}
                      className="px-3 py-1 rounded-md bg-[#2a2a2a] text-white/65 hover:text-white transition-colors text-xs"
                    >
                      编辑
                    </Link>
                    <DeleteButton
                      id={p.id}
                      title={p.title}
                      onDeleted={handleDeleted}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-white/33 mt-3 pl-1">
        拖拽左侧 ⠿ 图标可调整作品排列顺序
      </p>
    </div>
  );
}
