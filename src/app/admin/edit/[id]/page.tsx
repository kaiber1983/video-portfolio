import { notFound } from "next/navigation";
import { readProjects } from "@/lib/data";
import Link from "next/link";
import AdminProjectForm from "@/components/AdminProjectForm";

export const dynamic = "force-dynamic";

interface EditProjectPageProps {
  params: { id: string };
}

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const projects = readProjects();
  const project = projects.find((p) => p.id === parseInt(params.id));

  if (!project) notFound();

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
      <h1 className="text-2xl font-bold mb-8">编辑作品</h1>
      <AdminProjectForm
        projectId={project.id}
        initialData={{
          title: project.title,
          description: project.description,
          thumbnail: project.thumbnail,
          videoUrl: project.videoUrl,
          platform: project.platform,
          tags: project.tags,
          featured: project.featured,
        }}
      />
    </div>
  );
}
