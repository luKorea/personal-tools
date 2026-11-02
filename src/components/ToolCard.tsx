import Link from "next/link";
import type { ToolCard as ToolCardType } from "@/lib/tools";

export function ToolCard({ tool }: { tool: ToolCardType }) {
  const isSoon = tool.href === "#";
  const className =
    "group relative flex min-h-[188px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#12141a] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition duration-200 hover:-translate-y-0.5 hover:border-[color:var(--lime)]/40 hover:shadow-[0_22px_50px_rgba(200,241,53,0.08)]";

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/40 text-xl ring-1 ring-white/10">
          {tool.icon}
        </div>
        {tool.badge ? (
          <span className="rounded-full bg-[color:var(--lime-soft)] px-2.5 py-1 text-[11px] font-medium text-[color:var(--lime)] ring-1 ring-[color:var(--lime)]/20">
            {tool.badge}
          </span>
        ) : null}
      </div>
      <div className="mt-5 space-y-2">
        <h2 className="text-xl font-semibold tracking-tight text-white">{tool.title}</h2>
        <p className="text-sm leading-6 text-zinc-400">{tool.description}</p>
      </div>
      <div className="mt-auto pt-5 text-sm font-medium text-[color:var(--lime)]">
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
