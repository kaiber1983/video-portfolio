import { NextResponse } from "next/server";
import { readProjectsRemote, writeProjectsRemote } from "@/lib/data";

export const dynamic = "force-dynamic";

/** 获取单个作品 */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const projects = await readProjectsRemote();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return NextResponse.json({ error: "作品不存在" }, { status: 404 });
  }

  return NextResponse.json(project);
}

/** 更新作品 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const body = await request.json();
  const projects = await readProjectsRemote();
  const index = projects.findIndex((p) => p.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "作品不存在" }, { status: 404 });
  }

  projects[index] = {
    ...projects[index],
    ...body,
    id, // 防止 ID 被修改
  };

  await writeProjectsRemote(projects);

  return NextResponse.json(projects[index]);
}

/** 删除作品 */
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const projects = await readProjectsRemote();
  const index = projects.findIndex((p) => p.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "作品不存在" }, { status: 404 });
  }

  projects.splice(index, 1);
  await writeProjectsRemote(projects);

  return NextResponse.json({ success: true });
}
