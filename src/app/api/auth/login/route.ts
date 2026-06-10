import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const correctPassword = process.env.ADMIN_PASSWORD;

    if (!correctPassword) {
      return NextResponse.json(
        { error: "服务器未配置密码" },
        { status: 500 }
      );
    }

    if (password !== correctPassword) {
      return NextResponse.json(
        { error: "密码错误" },
        { status: 401 }
      );
    }

    // 登录成功，设置 cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set("auth_token", password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 天
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "请求格式错误" },
      { status: 400 }
    );
  }
}
