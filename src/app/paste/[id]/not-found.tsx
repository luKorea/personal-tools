import Link from "next/link";

export default function PasteNotFound() {
  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
      <h1 className="text-2xl font-semibold text-white">便签不存在或已过期</h1>
      <Link href="/paste" className="inline-block text-violet-300 hover:underline">
        去新建一条
      </Link>
    </div>
  );
}
