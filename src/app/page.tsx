import { ToolCard } from "@/components/ToolCard";
import { TOOLS } from "@/lib/tools";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-sm font-medium text-sky-300/90">korealu toolbox</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          个人工具站
        </h1>
        <p className="max-w-2xl text-base leading-7 text-slate-300">
          一个壳，多个工具。短链和便签可在本机直接用；帧存链到已上线站点；图床先占位。
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.title} tool={tool} />
        ))}
      </section>
    </div>
  );
}
