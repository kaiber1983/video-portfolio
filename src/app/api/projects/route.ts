import { NextResponse } from "next/server";
import { readProjects, writeProjects, getNextProjectId } from "@/lib/data";

export const dynamic = "force-dynamic";

/** 获取所有作品 */
export async function GET() {
  const projects = readProjects();
  return NextResponse.json(projects);
}

/** 新增作品 */
export async function POST(request: Request) {
  const body = await request.json();
  const { title, description, thumbnail, videoUrl, platform, tags, featured } = body;

  if (!title || !description) {
    return NextResponse.json(
      { error: "标题和描述不能为空" },
      { status: 400 }
    );
  }

  const projects = readProjects();
  const newProject = {
    id: getNextProjectId(projects),
    title,
    description: description || "",
    thumbnail: thumbnail || "",
    videoUrl: videoUrl || "",
    platform: platform || "youtube",
    tags: tags || "",
    featured: featured || false,
    createdAt: new Date().toISOString(),
  };

  projects.push(newProject);
  writeProjects(projects);

  return NextResponse.json(newProject, { status: 201 });
}
