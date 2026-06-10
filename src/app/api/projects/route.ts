import { NextResponse } from "next/server";
import { readProjectsRemote, writeProjectsRemote, getNextProjectId } from "@/lib/data";

export const dynamic = "force-dynamic";

/** 获取所有作品 */
export async function GET() {
  try {
    const projects = await readProjectsRemote();
    return NextResponse.json(projects);
  } catch (error) {
    const message = error instanceof Error ? error.message : "获取作品失败";
    console.error("获取作品失败:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** 新增作品 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, thumbnail, videoUrl, platform, tags, featured } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "标题和描述不能为空" },
        { status: 400 }
      );
    }

    const projects = await readProjectsRemote();
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
    await writeProjectsRemote(projects);

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "保存失败";
    console.error("项目保存失败:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
