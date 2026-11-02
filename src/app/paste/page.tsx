"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function PastePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [expireHours, setExpireHours] = useState("24");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const hours = expireHours === "0" ? null : Number(expireHours);
      const res = await fetch("/api/paste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, expireHours: hours }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "创建失败");
      router.push(`/paste/${data.item.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建失败");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">便签粘贴板</h1>
        <p className="text-slate-300">生成一个可分享的文本链接，适合临时传配置、报错日志。</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
        <label className="block space-y-2">
          <span className="text-sm text-slate-300">标题（可选）</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="比如：接口报错日志"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 outline-none ring-violet-400/40 focus:ring-2"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm text-slate-300">内容</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            placeholder="把文字粘贴到这里…"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 outline-none ring-violet-400/40 focus:ring-2"
            required
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm text-slate-300">过期时间</span>
          <select
            value={expireHours}
            onChange={(e) => setExpireHours(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 outline-none ring-violet-400/40 focus:ring-2"
          >
            <option value="1">1 小时</option>
            <option value="24">24 小时</option>
            <option value="168">7 天</option>
            <option value="0">永不过期</option>
          </select>
        </label>
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-violet-500 px-4 py-2.5 font-medium text-white transition hover:bg-violet-400 disabled:opacity-60"
        >
          {loading ? "创建中…" : "生成分享链接"}
        </button>
      </form>
    </div>
  );
}
