import { NextResponse } from "next/server";
import { hitShortLink } from "@/lib/store";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ code: string }> };

export async function GET(_request: Request, context: Ctx) {
  const { code } = await context.params;
  const item = await hitShortLink(code);
  if (!item) {
    return NextResponse.json({ error: "短链不存在" }, { status: 404 });
  }
  return NextResponse.redirect(item.url, 302);
}
