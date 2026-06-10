import { NextRequest, NextResponse } from "next/server";
import { readMessagesRemote, writeMessagesRemote, getNextMessageId } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "姓名、邮箱和留言内容为必填项" },
        { status: 400 }
      );
    }

    // 内容长度校验
    if (body.name.length > 100) {
      return NextResponse.json(
        { error: "姓名不能超过 100 个字符" },
        { status: 400 }
      );
    }
    if (body.email.length > 200) {
      return NextResponse.json(
        { error: "邮箱不能超过 200 个字符" },
        { status: 400 }
      );
    }
    if (body.message.length > 2000) {
      return NextResponse.json(
        { error: "留言内容不能超过 2000 个字符" },
        { status: 400 }
      );
    }

    const messages = await readMessagesRemote();
    const newMessage = {
      id: getNextMessageId(messages),
      name: body.name,
      email: body.email,
      message: body.message,
      read: false,
      createdAt: new Date().toISOString(),
    };

    messages.push(newMessage);
    await writeMessagesRemote(messages);

    return NextResponse.json(
      { success: true, id: newMessage.id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "留言保存失败" }, { status: 503 });
  }
}
