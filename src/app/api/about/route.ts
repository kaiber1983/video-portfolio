import { NextRequest, NextResponse } from "next/server";
import { readAboutRemote, writeAboutRemote } from "@/lib/data";

export const dynamic = "force-dynamic";

// GET /api/about — 获取关于我信息
export async function GET() {
  try {
    const about = await readAboutRemote();
    return NextResponse.json(about);
  } catch {
    return NextResponse.json({ error: "数据读取失败" }, { status: 503 });
  }
}

// PUT /api/about — 更新关于我信息
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.bio) {
      return NextResponse.json({ error: "姓名和简介不能为空" }, { status: 400 });
    }

    const existing = await readAboutRemote();

    const updated = {
      id: existing?.id ?? 1,
      name: body.name,
      bio: body.bio,
      avatarUrl: body.avatarUrl || "",
      socialJson: JSON.stringify(body.socialLinks || {}),
    };

    await writeAboutRemote(updated);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "数据保存失败" }, { status: 503 });
  }
}
