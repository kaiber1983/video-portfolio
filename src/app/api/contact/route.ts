import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { readMessagesRemote, writeMessagesRemote, getNextMessageId } from "@/lib/data";

export const dynamic = "force-dynamic";

// 创建 Gmail SMTP 发送器
function createTransporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "z8u7qwbt@gmail.com",
      pass: process.env.GMAIL_APP_PASSWORD || "",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "姓名、邮箱和留言内容为必填项" },
        { status: 400 }
      );
    }

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

    // 1. 保存留言到数据库
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

    // 2. 发送邮件通知
    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: `"${body.name} (联系表单)" <z8u7qwbt@gmail.com>`,
        to: "z8u7qwbt@gmail.com",
        subject: `[作品集留言] 来自 ${body.name} 的新消息`,
        replyTo: body.email,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; padding: 20px;">
            <h2 style="color: #D48BA6; margin-bottom: 16px;">新的留言</h2>
            <p><strong>姓名：</strong>${body.name}</p>
            <p><strong>邮箱：</strong>${body.email}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;" />
            <p style="white-space: pre-line; line-height: 1.6;">${body.message}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;" />
            <p style="color: #999; font-size: 12px;">此邮件由作品集网站自动发送</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("邮件发送失败:", emailError);
      // 留言已保存，邮件发送失败不阻塞响应
    }

    return NextResponse.json(
      { success: true, id: newMessage.id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "留言保存失败" }, { status: 503 });
  }
}
