import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 不需要认证也能访问的后台路径
const PUBLIC_PATHS = ["/admin/login", "/api/auth/login", "/api/auth/logout"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 只拦截 /admin 开头的路径
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // 登录页面和认证 API 放行
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // 检查认证 cookie
  const authToken = request.cookies.get("auth_token")?.value;
  const validToken = process.env.ADMIN_PASSWORD;

  if (!authToken || authToken !== validToken) {
    // 未认证，跳转到登录页
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// 只匹配需要保护的路由
export const config = {
  matcher: ["/admin/:path*", "/api/auth/:path*"],
};
