import Link from "next/link";
import type { ToolCard as ToolCardType } from "@/lib/tools";

export function ToolCard({ tool }: { tool: ToolCardType }) {
  const isSoon = tool.href === "#";
  const className =
    "group relative flex min-h-[188px] flex-col overflow-hidden rounded-2xl border border-panel-border bg-panel p-5 shadow-[0_1px_1px_rgba(0,0,0,0.04),0_10px_28px_rgba(18,22,30,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-[0_12px_32px_rgba(17,26,74,0.1)]";

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-xl ring-1 ring-panel-border">
          {tool.icon}
        </div>
        {tool.badge ? (
          <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-medium text-brand-link ring-1 ring-brand/10">
            {tool.badge}
          </span>
        ) : null}
      </div>
      <div className="mt-5 space-y-2">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">{tool.title}</h2>
        <p className="text-sm leading-6 text-muted">{tool.description}</p>
      </div>
      <div className="mt-auto pt-5 text-sm font-medium text-brand-link">
        {isSoon ? "敬请期待" : tool.external ? "打开站点 ↗" : "进入工具 →"}
      </div>
    </>
  );

  if (isSoon) {
    return <div className={`${className} cursor-default opacity-60`}>{body}</div>;
  }
  if (tool.external) {
    return (
      <a href={tool.href} target="_blank" rel="noreferrer" className={className}>
        {body}
      </a>
    );
  }
  return (
    <Link href={tool.href} className={className}>
      {body}
    </Link>
  );
}
