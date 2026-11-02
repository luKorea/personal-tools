import Link from "next/link";
import type { ToolCard as ToolCardType } from "@/lib/tools";

const accents: Record<ToolCardType["accent"], string> = {
  sky: "from-sky-50 to-white ring-sky-100",
  violet: "from-violet-50 to-white ring-violet-100",
  rose: "from-rose-50 to-white ring-rose-100",
  amber: "from-amber-50 to-white ring-amber-100",
};

const badgeTone: Record<ToolCardType["accent"], string> = {
  sky: "bg-sky-50 text-sky-700 ring-sky-100",
  violet: "bg-violet-50 text-violet-700 ring-violet-100",
  rose: "bg-rose-50 text-rose-700 ring-rose-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
};

export function ToolCard({ tool }: { tool: ToolCardType }) {
  const isSoon = tool.href === "#";
  const className = `group relative flex min-h-[188px] flex-col overflow-hidden rounded-[28px] border border-zinc-200/80 bg-gradient-to-br ${accents[tool.accent]} p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ring-1 ring-inset transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)] ${accents[tool.accent].split(" ").pop()}`;

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl shadow-sm ring-1 ring-zinc-200/80">
          {tool.icon}
        </div>
        {tool.badge ? (
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset ${badgeTone[tool.accent]}`}>
            {tool.badge}
          </span>
        ) : null}
      </div>
      <div className="mt-5 space-y-2">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-950">{tool.title}</h2>
        <p className="text-sm leading-6 text-zinc-500">{tool.description}</p>
      </div>
      <div className="mt-auto pt-5 text-sm font-medium text-zinc-950">
        {isSoon ? "敬请期待" : tool.external ? "打开站点 ↗" : "进入工具 →"}
      </div>
    </>
  );

  if (isSoon) {
    return <div className={`${className} cursor-default opacity-70 grayscale-[0.2]`}>{body}</div>;
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
