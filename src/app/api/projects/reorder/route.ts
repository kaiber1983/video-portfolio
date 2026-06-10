import { NextResponse } from "next/server";
import { readProjectsRemote, writeProjectsRemote } from "@/lib/data";

export const dynamic = "force-dynamic";

/** 重新排序作品 */
export async function POST(request: Request) {
  try {
    const { ids } = (await request.json()) as { ids: number[] };

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "排序数据不能为空" },
        { status: 400 }
      );
    }

    const projects = await readProjectsRemote();

    // 按传入的 ID 顺序重新排列
    const idOrder = new Map(ids.map((id, i) => [id, i]));
    projects.sort((a, b) => {
      const orderA = idOrder.get(a.id) ?? Number.MAX_SAFE_INTEGER;
      const orderB = idOrder.get(b.id) ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });

    await writeProjectsRemote(projects, "调整作品排序");

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "排序保存失败";
    console.error("排序保存失败:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
