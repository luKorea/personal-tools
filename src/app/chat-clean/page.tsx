"use client";

import { useMemo, useState } from "react";
import {
  analyze,
  toMarkdown,
  toPlainText,
  type CleanOptions,
} from "@/lib/chat-clean";
import {
  GhostButton,
  Label,
  PageHero,
  Panel,
  PrimaryButton,
  TextArea,
} from "@/components/ui";

const DEFAULT_OPTIONS: CleanOptions = {
  dropSystem: true,
  dropEmpty: true,
  onlySenders: [],
  mergeConsecutive: false,
};

export default function ChatCleanPage() {
  const [raw, setRaw] = useState("");
  const [fileName, setFileName] = useState("");
  const [options, setOptions] = useState<CleanOptions>(DEFAULT_OPTIONS);
  const [selectedSenders, setSelectedSenders] = useState<string[]>([]);
  const [error, setError] = useState("");

  const preview = useMemo(() => {
    if (!raw.trim()) return null;
    try {
      return analyze(raw, {
        ...options,
        onlySenders: selectedSenders,
      });
    } catch (e) {
      return null;
    }
  }, [raw, options, selectedSenders]);

  async function onFile(file: File | null) {
    if (!file) return;
    setError("");
    setFileName(file.name);
    const text = await file.text();
    setRaw(text);
    setSelectedSenders([]);
  }

  async function loadSample() {
    const res = await fetch("/samples/wechat-demo.txt");
    const text = await res.text();
    setFileName("wechat-demo.txt");
    setRaw(text);
    setSelectedSenders([]);
    setError("");
  }

  function download(kind: "md" | "txt") {
    if (!preview) return;
    const title = fileName ? fileName.replace(/\.[^.]+$/, "") : "聊天记录";
    const content = kind === "md" ? toMarkdown(preview.messages, title) : toPlainText(preview.messages);
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.${kind === "md" ? "md" : "txt"}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function toggleSender(sender: string) {
    setSelectedSenders((prev) =>
      prev.includes(sender) ? prev.filter((s) => s !== sender) : [...prev, sender],
    );
  }

  const allSenders = useMemo(() => {
    if (!raw.trim()) return [] as string[];
    try {
      return analyze(raw, { ...DEFAULT_OPTIONS, dropSystem: false, onlySenders: [] }).stats.senders;
    } catch {
      return [] as string[];
    }
  }, [raw]);

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Chat cleaner"
        title="聊天记录清洗"
        description="把微信 / QQ 导出的乱七八糟文本，整理成可读的 Markdown 或纯文本。全程在浏览器本地处理，不上传服务器。"
      />

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm">
            选择导出文件
            <input
              type="file"
              accept=".txt,.log,.md,text/plain"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0] || null)}
            />
          </label>
          <GhostButton type="button" onClick={loadSample}>
            载入示例
          </GhostButton>
          {fileName ? <span className="text-sm text-muted">已载入：{fileName}</span> : null}
        </div>

        <label className="block">
          <Label>或直接粘贴原始文本</Label>
          <TextArea
            value={raw}
            onChange={(e) => {
              setRaw(e.target.value);
              setSelectedSenders([]);
            }}
            rows={10}
            placeholder="把聊天导出内容粘贴到这里…"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-3">
          {(
            [
              ["dropSystem", "去掉系统提示 / 撤回"],
              ["dropEmpty", "去掉空消息"],
              ["mergeConsecutive", "合并同一人连续发言"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 rounded-xl border border-panel-border bg-background px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={options[key]}
                onChange={(e) => setOptions((o) => ({ ...o, [key]: e.target.checked }))}
              />
              {label}
            </label>
          ))}
        </div>

        {allSenders.length > 0 ? (
          <div className="space-y-2">
            <Label>只保留这些人（不选则全部）</Label>
            <div className="flex flex-wrap gap-2">
              {allSenders.map((sender) => {
                const active = selectedSenders.includes(sender);
                return (
                  <button
                    key={sender}
                    type="button"
                    onClick={() => toggleSender(sender)}
                    className={`rounded-full px-3 py-1 text-sm ring-1 transition ${
                      active
                        ? "bg-brand text-white ring-brand"
                        : "bg-white text-foreground ring-panel-border hover:bg-brand-soft"
                    }`}
                  >
                    {sender}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </Panel>

      {preview ? (
        <>
          <div className="grid gap-3 sm:grid-cols-4">
            {[
              ["识别格式", preview.stats.detectedFormat],
              ["原始行数", String(preview.stats.totalLines)],
              ["消息条数", String(preview.stats.messages)],
              ["发言人数", String(preview.stats.senders.length)],
            ].map(([k, v]) => (
              <Panel key={k} className="!p-4">
                <div className="text-xs text-muted">{k}</div>
                <div className="mt-1 text-lg font-semibold text-foreground">{v}</div>
              </Panel>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <PrimaryButton type="button" onClick={() => download("md")}>
              导出 Markdown
            </PrimaryButton>
            <GhostButton type="button" onClick={() => download("txt")}>
              导出纯文本
            </GhostButton>
          </div>

          <Panel>
            <div className="mb-3 text-sm font-medium text-foreground">预览（前 30 条）</div>
            <div className="max-h-[480px] space-y-4 overflow-auto pr-1">
              {preview.messages.slice(0, 30).map((m, idx) => (
                <div key={idx} className="rounded-xl border border-panel-border bg-background px-3 py-2.5">
                  <div className="text-xs text-muted">
                    {m.kind === "system" ? "系统" : m.sender || "未知"}
                    {m.time ? ` · ${m.time}` : ""}
                  </div>
                  <pre className="mt-1 whitespace-pre-wrap break-words font-sans text-sm text-foreground">
                    {m.content}
                  </pre>
                </div>
              ))}
            </div>
          </Panel>
        </>
      ) : null}
    </div>
  );
}
