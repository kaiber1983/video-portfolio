import Link from "next/link";
import { readAbout } from "@/lib/data";
import AboutForm from "./AboutForm";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const about = readAbout();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-[#a3a3a3] hover:text-white transition-colors mb-6"
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

      <h1 className="text-2xl font-bold mb-8">编辑关于我</h1>

      <AboutForm
        initialData={
          about
            ? {
                name: about.name,
                bio: about.bio,
                avatarUrl: about.avatarUrl,
                socialLinks: JSON.parse(about.socialJson),
              }
            : undefined
        }
      />
    </div>
  );
}
