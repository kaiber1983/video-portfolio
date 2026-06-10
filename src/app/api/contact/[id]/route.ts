import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT /api/contact/:id — 更新留言状态（标为已读/未读）
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  try {
    const message = await prisma.contactMessage.update({
      where: { id: parseInt(params.id) },
      data: { read: body.read },
    });
    return NextResponse.json(message);
  } catch {
    return NextResponse.json({ error: "留言未找到" }, { status: 404 });
  }
}
