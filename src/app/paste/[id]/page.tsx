import Link from "next/link";
import { notFound } from "next/navigation";
import { getPaste } from "@/lib/store";
import { CopyButton } from "./CopyButton";

export const runtime = "nodejs";

type Props = { params: Promise<{ id: string }> };

export default async function PasteDetailPage({ params }: Props) {
  const { id } = await params;
  const item = await getPaste(id);
  if (!item) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-sm text-violet-300">
            <Link href="/paste" className="hover:underline">
              ← 新建便签
            </Link>
          </p>
          <h1 className="text-3xl font-semibold text-white">{item.title}</h1>
          <p className="text-sm text-slate-400">
            创建于 {new Date(item.createdAt).toLocaleString("zh-CN", { hour12: false })}
            {item.expiresAt
              ? ` · ${new Date(item.expiresAt).toLocaleString("zh-CN", { hour12: false })} 过期`
              : " · 永不过期"}
          </p>
        </div>
        <CopyButton text={item.content} />
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-2xl border border-white/10 bg-black/30 p-5 text-sm leading-6 text-slate-100">
        {item.content}
      </pre>
    </div>
  );
}
