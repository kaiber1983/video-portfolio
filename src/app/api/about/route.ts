import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/about — 获取关于我信息
export async function GET() {
  try {
    const about = await prisma.about.findFirst();
    return NextResponse.json(about);
  } catch {
    return NextResponse.json({ error: "数据库不可用" }, { status: 503 });
  }
}

// PUT /api/about — 更新关于我信息
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const about = await prisma.about.findFirst();

    if (!about) {
      return NextResponse.json({ error: "暂无信息" }, { status: 404 });
    }

    const updated = await prisma.about.update({
      where: { id: about.id },
      data: {
        name: body.name,
        bio: body.bio,
        avatarUrl: body.avatarUrl,
        socialJson: JSON.stringify(body.socialLinks),
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "数据库不可用" }, { status: 503 });
  }
}
