import { NextResponse } from "next/server";
import { createPaste } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      title?: string;
      content?: string;
      expireHours?: number | null;
    };
    const content = (body.content || "").trim();
    if (!content) {
      return NextResponse.json({ error: "内容不能为空" }, { status: 400 });
    }
    if (content.length > 100_000) {
      return NextResponse.json({ error: "内容太长了（上限约 10 万字符）" }, { status: 400 });
    }
    const item = await createPaste({
      title: body.title,
      content,
      expireHours: body.expireHours ?? 24,
    });
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "创建失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
