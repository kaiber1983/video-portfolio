import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/projects — 获取全部作品
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "数据库不可用" }, { status: 503 });
  }
}

// POST /api/projects — 新建作品
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.videoUrl) {
      return NextResponse.json(
        { error: "标题和视频链接为必填项" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title: body.title,
        description: body.description || "",
        thumbnail: body.thumbnail || "",
        videoUrl: body.videoUrl,
        platform: body.platform || "youtube",
        tags: body.tags || "",
        featured: body.featured || false,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json({ error: "数据库不可用" }, { status: 503 });
  }
}
