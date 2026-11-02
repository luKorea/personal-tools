import { ToolCard } from "@/components/ToolCard";
import { PageHero } from "@/components/ui";
import { TOOLS } from "@/lib/tools";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <PageHero
        eyebrow="Toolbox"
        title="个人工具站"
        description="一个壳，多个工具。短链和便签本机就能用；帧存跳到已上线站点；图床先留位置。"
      />

      <section className="grid gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.title} tool={tool} />
        ))}
      </section>
    </div>
  );
}
