"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Label, PageHero, Panel, PrimaryButton, Select, TextArea, TextInput } from "@/components/ui";

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
      <PageHero
        eyebrow="Paste"
        title="便签"
        description="生成可分享的文本链接，适合临时传配置、报错日志。"
      />

      <Panel>
        <form onSubmit={onSubmit} className="space-y-5">
          <label className="block">
            <Label>标题（可选）</Label>
            <TextInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="比如：接口报错日志"
            />
          </label>
          <label className="block">
            <Label>内容</Label>
            <TextArea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              placeholder="把文字粘贴到这里…"
              required
            />
          </label>
          <label className="block">
            <Label>过期时间</Label>
            <Select value={expireHours} onChange={(e) => setExpireHours(e.target.value)}>
              <option value="1">1 小时</option>
              <option value="24">24 小时</option>
              <option value="168">7 天</option>
              <option value="0">永不过期</option>
            </Select>
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <PrimaryButton type="submit"  disabled={loading}>
            {loading ? "创建中…" : "生成分享链接"}
          </PrimaryButton>
        </form>
      </Panel>
    </div>
  );
}
