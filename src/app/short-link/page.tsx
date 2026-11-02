"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  GhostButton,
  Label,
  PageHero,
  Panel,
  PrimaryButton,
  TextInput,
} from "@/components/ui";

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
      <PageHero
        eyebrow="Short link"
        title="短链"
        description="把长链接收成短码。数据先存在本地 JSON，适合个人试用。"
      />

      <Panel>
        <form onSubmit={onSubmit} className="space-y-5">
          <label className="block">
            <Label>原始链接</Label>
            <TextInput
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/very/long/path"
              required
            />
          </label>
          <label className="block">
            <Label>自定义短码（可选）</Label>
            <TextInput
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="比如 my-link"
            />
          </label>
          {error ? <p className="text-sm text-rose-400">{error}</p> : null}
          <PrimaryButton type="submit"  disabled={loading}>
            {loading ? "生成中…" : "生成短链"}
          </PrimaryButton>
        </form>
      </Panel>

      {latest ? (
        <Panel className="border-lime/25 bg-lime-soft">
          <p className="text-sm font-medium text-lime">刚生成</p>
          <p className="mt-2 break-all font-mono text-lg text-white">{shortUrl(latest)}</p>
          <GhostButton type="button" onClick={copyLatest} className="mt-4">
            {copied ? "已复制" : "复制链接"}
          </GhostButton>
        </Panel>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">最近记录</h2>
        {items.length === 0 ? (
          <p className="text-sm text-zinc-400">还没有短链。</p>
        ) : (
          <ul className="space-y-3">
            {items.slice(0, 20).map((item) => (
              <li key={item.code} className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <a className="font-mono text-sm font-medium text-lime hover:underline" href={`/s/${item.code}`}>
                    /s/{item.code}
                  </a>
                  <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-zinc-400">
                    {item.hits} 次访问
                  </span>
                </div>
                <p className="mt-1.5 truncate text-sm text-zinc-400">{item.url}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
