import Link from "next/link";
import { notFound } from "next/navigation";
import { getPaste } from "@/lib/store";
import { Panel } from "@/components/ui";
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
          <Link href="/paste" className="text-sm font-medium text-lime hover:underline">
            ← 新建便签
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-white">{item.title}</h1>
          <p className="text-sm text-zinc-400">
            创建于 {new Date(item.createdAt).toLocaleString("zh-CN", { hour12: false })}
            {item.expiresAt
              ? ` · ${new Date(item.expiresAt).toLocaleString("zh-CN", { hour12: false })} 过期`
              : " · 永不过期"}
          </p>
        </div>
        <CopyButton text={item.content} />
      </div>
      <Panel className="bg-black/50 text-zinc-50">
        <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm leading-7 text-zinc-100">
          {item.content}
        </pre>
      </Panel>
    </div>
  );
}
