import Link from "next/link";
import { Panel } from "@/components/ui";

export default function PasteNotFound() {
  return (
    <Panel className="py-12 text-center">
      <h1 className="text-2xl font-semibold text-foreground">便签不存在或已过期</h1>
      <Link href="/paste" className="mt-4 inline-block text-sm font-medium text-brand-link hover:underline">
        去新建一条
      </Link>
    </Panel>
  );
}
