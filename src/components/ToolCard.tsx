import Link from "next/link";
import type { ToolCard as ToolCardType } from "@/lib/tools";

export function ToolCard({ tool }: { tool: ToolCardType }) {
  const isSoon = tool.href === "#";
  const className =
    "group relative flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20 transition hover:border-sky-400/40 hover:bg-white/10";

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">{tool.title}</h2>
        {tool.badge ? (
          <span className="shrink-0 rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-xs text-slate-300">
            {tool.badge}
          </span>
        ) : null}
      </div>
      <p className="text-sm leading-6 text-slate-300">{tool.description}</p>
      <div className="mt-auto pt-2 text-sm text-sky-300 opacity-80 group-hover:opacity-100">
        {isSoon ? "敬请期待" : tool.external ? "打开外链 →" : "进入工具 →"}
      </div>
    </>
  );

  if (isSoon) {
    return <div className={`${className} cursor-default opacity-70`}>{body}</div>;
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
