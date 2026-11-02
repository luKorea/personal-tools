"use client";

import { FormEvent, useEffect, useState } from "react";

type ShortLink = {
  code: string;
  url: string;
  createdAt: string;
  hits: number;
};

export default function ShortLinkPage() {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [latest, setLatest] = useState<ShortLink | null>(null);
  const [items, setItems] = useState<ShortLink[]>([]);
  const [copied, setCopied] = useState(false);

  async function refresh() {
    const res = await fetch("/api/short-link");
    const data = await res.json();
    setItems(data.items || []);
  }

  useEffect(() => {
    refresh().catch(() => undefined);
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCopied(false);
    try {
      const res = await fetch("/api/short-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, code: code || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "创建失败");
      setLatest(data.item);
      setUrl("");
      setCode("");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建失败");
    } finally {
      setLoading(false);
    }
  }

  function shortUrl(item: ShortLink) {
    if (typeof window === "undefined") return `/s/${item.code}`;
    return `${window.location.origin}/s/${item.code}`;
  }

  async function copyLatest() {
    if (!latest) return;
    await navigator.clipboard.writeText(shortUrl(latest));
    setCopied(true);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">短链</h1>
        <p className="text-slate-300">本地 JSON 存储，适合个人试用；上线前可换成数据库。</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
        <label className="block space-y-2">
          <span className="text-sm text-slate-300">原始链接</span>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very/long/path"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 outline-none ring-sky-400/40 focus:ring-2"
            required
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm text-slate-300">自定义短码（可选）</span>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="比如 my-link"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 outline-none ring-sky-400/40 focus:ring-2"
          />
        </label>
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-sky-500 px-4 py-2.5 font-medium text-slate-950 transition hover:bg-sky-400 disabled:opacity-60"
        >
          {loading ? "生成中…" : "生成短链"}
        </button>
      </form>

      {latest ? (
        <div className="rounded-2xl border border-sky-400/30 bg-sky-500/10 p-5">
          <p className="text-sm text-sky-100">刚生成</p>
          <p className="mt-2 break-all font-mono text-lg text-white">{shortUrl(latest)}</p>
          <button
            type="button"
            onClick={copyLatest}
            className="mt-3 rounded-lg border border-white/20 px-3 py-1.5 text-sm text-white hover:bg-white/10"
          >
            {copied ? "已复制" : "复制链接"}
          </button>
        </div>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-lg font-medium text-white">最近记录</h2>
        {items.length === 0 ? (
          <p className="text-sm text-slate-400">还没有短链。</p>
        ) : (
          <ul className="space-y-2">
            {items.slice(0, 20).map((item) => (
              <li
                key={item.code}
                className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <a className="font-mono text-sky-300 hover:underline" href={`/s/${item.code}`}>
                    /s/{item.code}
                  </a>
                  <span className="text-slate-400">{item.hits} 次访问</span>
                </div>
                <p className="mt-1 truncate text-slate-400">{item.url}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
