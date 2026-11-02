"use client";

import { useState } from "react";
import { GhostButton } from "@/components/ui";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return <GhostButton type="button" onClick={onCopy}>{copied ? "已复制" : "复制内容"}</GhostButton>;
}
