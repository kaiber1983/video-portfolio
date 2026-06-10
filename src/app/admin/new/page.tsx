import Link from "next/link";
import AdminProjectForm from "@/components/AdminProjectForm";

export default function NewProjectPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-white/65 hover:text-[#f0f0f0] transition-colors mb-6"
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
      <h1 className="text-2xl font-bold mb-8">新建作品</h1>
      <AdminProjectForm />
    </div>
  );
}
