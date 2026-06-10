import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/projects/:id — 获取单个作品
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const project = await prisma.project.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!project) {
    return NextResponse.json({ error: "作品未找到" }, { status: 404 });
  }

  return NextResponse.json(project);
}

// PUT /api/projects/:id — 更新作品
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  try {
    const project = await prisma.project.update({
      where: { id: parseInt(params.id) },
      data: {
        title: body.title,
        description: body.description,
        thumbnail: body.thumbnail,
        videoUrl: body.videoUrl,
        platform: body.platform,
        tags: body.tags,
        featured: body.featured,
      },
    });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "作品未找到" }, { status: 404 });
  }
}

// DELETE /api/projects/:id — 删除作品
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.project.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "作品未找到" }, { status: 404 });
  }
}
