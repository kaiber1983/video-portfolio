import { NextRequest, NextResponse } from "next/server";
import { readMessagesRemote, writeMessagesRemote } from "@/lib/data";

// PUT /api/contact/:id — 更新留言状态（标为已读/未读）
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const messages = await readMessagesRemote();
    const index = messages.findIndex((m) => m.id === parseInt(params.id));

    if (index === -1) {
      return NextResponse.json({ error: "留言未找到" }, { status: 404 });
    }

    messages[index].read = body.read;
    await writeMessagesRemote(messages);

    return NextResponse.json(messages[index]);
  } catch {
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}
