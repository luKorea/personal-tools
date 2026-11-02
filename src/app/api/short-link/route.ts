import { NextResponse } from "next/server";
import { createShortLink, listShortLinks } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  const items = await listShortLinks();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { url?: string; code?: string };
    const url = (body.url || "").trim();
    if (!url) {
      return NextResponse.json({ error: "请填写要缩短的链接" }, { status: 400 });
    }
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return NextResponse.json({ error: "链接格式不对，需要带 http/https" }, { status: 400 });
    }
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return NextResponse.json({ error: "只支持 http/https 链接" }, { status: 400 });
    }
    const item = await createShortLink(url, body.code);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "创建失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
