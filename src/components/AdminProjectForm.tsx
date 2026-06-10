"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProjectFormData {
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  platform: string;
  tags: string;
  featured: boolean;
}

interface AdminProjectFormProps {
  initialData?: ProjectFormData;
  projectId?: number;
}

// 浏览器端压缩图片：限制最大尺寸 1920px，JPEG 质量 0.8，确保不超过 Vercel 4.5MB 限制
async function compressForUpload(file: File): Promise<File> {
  // 小于 1MB 的小文件直接上传
  if (file.size < 1024 * 1024) return file;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const maxSize = 1920;
      let { width, height } = img;
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round((height / width) * maxSize);
          width = maxSize;
        } else {
          width = Math.round((width / height) * maxSize);
          height = maxSize;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("压缩失败"));
          resolve(new File([blob], file.name, { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.8
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("图片加载失败"));
    };
    img.src = objectUrl;
  });
}

export default function AdminProjectForm({
  initialData,
  projectId,
}: AdminProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnail || "");
  const [preview, setPreview] = useState(initialData?.thumbnail || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEdit = !!projectId;

  // 安全解析 JSON，处理 Vercel 返回非 JSON 响应（如 413 超限）
  async function safeJson(res: Response) {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(text.slice(0, 100) || `服务器错误 (HTTP ${res.status})`);
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 本地预览
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    // 上传到服务器
    setUploading(true);
    setError("");

    try {
      // 浏览器端压缩图片，避免超过 Vercel 4.5MB 限制
      const compressed = await compressForUpload(file);

      const formData = new FormData();
      formData.append("file", compressed);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await safeJson(res);
        throw new Error(err.error || "上传失败");
      }

      const data = await safeJson(res);
      setThumbnailUrl(data.url);
      // 保留本地 Blob URL 作预览，Vercel 上图片可能还没部署完成
    } catch (err) {
      console.error("图片上传失败:", err);
      setError(err instanceof Error ? err.message : "上传失败");
      // 保留本地 Blob 预览，不清空
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data: ProjectFormData = {
      title: form.get("title") as string,
      description: form.get("description") as string,
      thumbnail: thumbnailUrl,
      videoUrl: form.get("videoUrl") as string,
      platform: form.get("platform") as string,
      tags: form.get("tags") as string,
      featured: form.get("featured") === "on",
    };

    try {
      const res = await fetch(
        isEdit ? `/api/projects/${projectId}` : "/api/projects",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "保存失败");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="p-3 rounded-lg bg-red-900/50 text-red-300 text-sm border border-red-800">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1.5 text-[#a0a0a0]">
          标题 *
        </label>
        <input
          name="title"
          defaultValue={initialData?.title}
          required
          className="w-full px-3 py-2 rounded-lg bg-[#1e1e1e] border border-[#2a2a2a] focus:border-accent focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5 text-[#a0a0a0]">
          视频 URL *
        </label>
        <input
          name="videoUrl"
          defaultValue={initialData?.videoUrl}
          required
          placeholder="https://www.youtube.com/embed/xxx 或 https://www.bilibili.com/video/BVxxx/"
          className="w-full px-3 py-2 rounded-lg bg-[#1e1e1e] border border-[#2a2a2a] focus:border-accent focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5 text-[#a0a0a0]">
          平台
        </label>
        <select
          name="platform"
          defaultValue={initialData?.platform || "youtube"}
          className="w-full px-3 py-2 rounded-lg bg-[#1e1e1e] border border-[#2a2a2a] focus:border-accent focus:outline-none transition-colors"
        >
          <option value="youtube">YouTube</option>
          <option value="bilibili">Bilibili</option>
        </select>
      </div>

      {/* 图片上传区域 */}
      <div>
        <label className="block text-sm font-medium mb-1.5 text-[#a0a0a0]">
          封面图片
        </label>

        {/* 预览 */}
        {preview && (
          <div className="mb-3 rounded-lg overflow-hidden border border-[#2a2a2a] aspect-video max-w-sm bg-[#111]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="作品封面图片预览"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}

        {/* 上传按钮 */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 rounded-lg bg-[#2a2a2a] text-sm text-[#a0a0a0] hover:text-white hover:bg-[#3a3a3a] transition-colors disabled:opacity-50"
          >
            {uploading ? "上传中..." : "选择本地图片"}
          </button>
          <span className="text-xs text-[#666]">支持 JPG/PNG/WebP/GIF，无尺寸限制</span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* 图片地址输入框 */}
        <div className="mt-3">
          <label className="block text-xs mb-1 text-[#666]">
            或输入图片 URL（上传后自动填充）
          </label>
          <input
            name="thumbnail"
            value={thumbnailUrl}
            onChange={(e) => {
              setThumbnailUrl(e.target.value);
              setPreview(e.target.value);
            }}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3 py-2 rounded-lg bg-[#1e1e1e] border border-[#2a2a2a] focus:border-accent focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5 text-[#a0a0a0]">
          描述
        </label>
        <textarea
          name="description"
          defaultValue={initialData?.description}
          rows={4}
          className="w-full px-3 py-2 rounded-lg bg-[#1e1e1e] border border-[#2a2a2a] focus:border-accent focus:outline-none transition-colors resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5 text-[#a0a0a0]">
          标签（逗号分隔）
        </label>
        <input
          name="tags"
          defaultValue={initialData?.tags}
          placeholder="例如：航拍,城市,夜景"
          className="w-full px-3 py-2 rounded-lg bg-[#1e1e1e] border border-[#2a2a2a] focus:border-accent focus:outline-none transition-colors"
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={initialData?.featured}
          className="w-4 h-4 rounded border-[#2a2a2a] bg-[#1e1e1e] accent-accent"
        />
        <span className="text-sm text-[#a0a0a0]">精选作品</span>
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading || uploading}
          className="px-6 py-2.5 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          {loading ? "保存中..." : isEdit ? "更新作品" : "创建作品"}
        </button>
        <Link
          href="/admin"
          className="px-6 py-2.5 rounded-lg bg-[#1e1e1e] text-[#a0a0a0] hover:text-white transition-colors"
        >
          取消
        </Link>
      </div>
    </form>
  );
}
