export type ChatMessage = {
  time: string | null;
  sender: string | null;
  content: string;
  kind: "message" | "system";
};

export type CleanOptions = {
  dropSystem: boolean;
  dropEmpty: boolean;
  onlySenders: string[]; // empty = all
  mergeConsecutive: boolean;
};

export type CleanResult = {
  messages: ChatMessage[];
  stats: {
    totalLines: number;
    messages: number;
    system: number;
    senders: string[];
    detectedFormat: string;
  };
};

const SYSTEM_HINTS =
  /(撤回了一条消息|加入了群聊|退出了群聊|修改群名为|拍了拍|开启了朋友验证|以上是打招呼|红包|转账|邀请.*加入|你已添加了|消息已发出，但被对方拒收|当前群聊人数较多)/;

// WeChat / QQ common headers
const PATTERNS: { name: string; re: RegExp }[] = [
  {
    name: "datetime-sender",
    // 2024-01-02 12:30:01 张三
    // 2024/1/2 12:30:01 张三(123)
    re: /^(\d{4}[-\/.]\d{1,2}[-\/.]\d{1,2}\s+\d{1,2}:\d{2}(?::\d{2})?)\s+(.+)$/,
  },
  {
    name: "sender-datetime",
    // 张三 2024-01-02 12:30:01
    re: /^(.+?)\s+(\d{4}[-\/.]\d{1,2}[-\/.]\d{1,2}\s+\d{1,2}:\d{2}(?::\d{2})?)$/,
  },
  {
    name: "bracket-qq",
    // 张三(123456) 12:30:01
    // 【张三】2024-01-02 12:30:01
    re: /^【?([^\](]+?)】?(?:\((\d+)\))?\s+(\d{4}[-\/.]\d{1,2}[-\/.]\d{1,2}\s+\d{1,2}:\d{2}(?::\d{2})?|\d{1,2}:\d{2}(?::\d{2})?)$/,
  },
  {
    name: "csv-like",
    // 2024-01-02 12:30:01,张三,你好
    re: /^(\d{4}[-\/.]\d{1,2}[-\/.]\d{1,2}\s+\d{1,2}:\d{2}(?::\d{2})?),([^,]+),([\s\S]+)$/,
  },
];

function stripBom(text: string) {
  return text.replace(/^\uFEFF/, "");
}

function normalizeLine(line: string) {
  return line.replace(/\r$/, "").replace(/\u00a0/g, " ");
}

function isSystemContent(content: string) {
  const t = content.trim();
  if (!t) return true;
  if (SYSTEM_HINTS.test(t)) return true;
  if (/^[-—=]{3,}/.test(t)) return true;
  return false;
}

function parseHeader(line: string): { time: string | null; sender: string | null; rest?: string; format: string } | null {
  const csv = line.match(PATTERNS[3].re);
  if (csv) {
    return { time: csv[1], sender: csv[2].trim(), rest: csv[3], format: "csv-like" };
  }

  const a = line.match(PATTERNS[0].re);
  if (a) {
    // avoid matching pure dates as senders later
    return { time: a[1], sender: a[2].trim(), format: "datetime-sender" };
  }

  const b = line.match(PATTERNS[1].re);
  if (b && /\d{4}/.test(b[2])) {
    return { time: b[2], sender: b[1].trim(), format: "sender-datetime" };
  }

  const c = line.match(PATTERNS[2].re);
  if (c) {
    const sender = c[2] ? `${c[1].trim()}(${c[2]})` : c[1].trim();
    return { time: c[3], sender, format: "bracket-qq" };
  }

  return null;
}

export function parseChatExport(raw: string): { messages: ChatMessage[]; detectedFormat: string; totalLines: number } {
  const text = stripBom(raw);
  const lines = text.split(/\n/).map(normalizeLine);
  const messages: ChatMessage[] = [];
  let current: ChatMessage | null = null;
  let detectedFormat = "unknown";
  let formatVotes: Record<string, number> = {};

  const flush = () => {
    if (!current) return;
    current.content = current.content.replace(/\n+$/, "").trimEnd();
    if (current.kind === "message" && isSystemContent(current.content)) {
      current.kind = "system";
    }
    messages.push(current);
    current = null;
  };

  for (const line of lines) {
    if (!line.trim()) {
      if (current) current.content += "\n";
      continue;
    }

    const header = parseHeader(line.trim());
    if (header && !header.rest) {
      // Heuristic: if previous content empty and line looks like continuation, keep
      flush();
      formatVotes[header.format] = (formatVotes[header.format] || 0) + 1;
      current = {
        time: header.time,
        sender: header.sender,
        content: "",
        kind: "message",
      };
      continue;
    }

    if (header?.rest) {
      flush();
      formatVotes[header.format] = (formatVotes[header.format] || 0) + 1;
      messages.push({
        time: header.time,
        sender: header.sender,
        content: header.rest.trim(),
        kind: isSystemContent(header.rest) ? "system" : "message",
      });
      current = null;
      continue;
    }

    // system-only lines without header
    if (!current && isSystemContent(line)) {
      messages.push({ time: null, sender: null, content: line.trim(), kind: "system" });
      continue;
    }

    if (!current) {
      current = { time: null, sender: null, content: line, kind: "message" };
    } else {
      current.content = current.content ? `${current.content}\n${line}` : line;
    }
  }
  flush();

  const ranked = Object.entries(formatVotes).sort((a, b) => b[1] - a[1]);
  detectedFormat = ranked[0]?.[0] || detectedFormat;

  return { messages, detectedFormat, totalLines: lines.length };
}

export function cleanMessages(messages: ChatMessage[], options: CleanOptions): ChatMessage[] {
  let list = messages.slice();

  if (options.dropSystem) {
    list = list.filter((m) => m.kind !== "system");
  }
  if (options.dropEmpty) {
    list = list.filter((m) => m.content.trim().length > 0);
  }
  if (options.onlySenders.length > 0) {
    const set = new Set(options.onlySenders);
    list = list.filter((m) => m.sender && set.has(m.sender));
  }
  if (options.mergeConsecutive) {
    const merged: ChatMessage[] = [];
    for (const m of list) {
      const prev = merged[merged.length - 1];
      if (
        prev &&
        prev.kind === m.kind &&
        prev.sender &&
        prev.sender === m.sender &&
        prev.time &&
        m.time &&
        prev.time.slice(0, 16) === m.time.slice(0, 16)
      ) {
        prev.content = `${prev.content}\n${m.content}`;
      } else {
        merged.push({ ...m });
      }
    }
    list = merged;
  }
  return list;
}

export function toMarkdown(messages: ChatMessage[], title = "聊天记录"): string {
  const lines = [`# ${title}`, "", `> 共 ${messages.length} 条`, ""];
  let lastDay = "";
  for (const m of messages) {
    const day = m.time?.slice(0, 10) || "";
    if (day && day !== lastDay) {
      lines.push(`## ${day}`, "");
      lastDay = day;
    }
    if (m.kind === "system") {
      lines.push(`*${m.content}*`, "");
      continue;
    }
    const who = m.sender || "未知";
    const when = m.time ? ` · ${m.time}` : "";
    lines.push(`**${who}**${when}`, "", m.content, "");
  }
  return lines.join("\n").trim() + "\n";
}

export function toPlainText(messages: ChatMessage[]): string {
  return (
    messages
      .map((m) => {
        if (m.kind === "system") return `[系统] ${m.content}`;
        const head = [m.time, m.sender].filter(Boolean).join(" ");
        return head ? `${head}\n${m.content}` : m.content;
      })
      .join("\n\n") + "\n"
  );
}

export function analyze(raw: string, options: CleanOptions): CleanResult {
  const parsed = parseChatExport(raw);
  const cleaned = cleanMessages(parsed.messages, options);
  const senders = Array.from(
    new Set(cleaned.map((m) => m.sender).filter((s): s is string => Boolean(s))),
  ).sort((a, b) => a.localeCompare(b, "zh-CN"));
  return {
    messages: cleaned,
    stats: {
      totalLines: parsed.totalLines,
      messages: cleaned.filter((m) => m.kind === "message").length,
      system: cleaned.filter((m) => m.kind === "system").length,
      senders,
      detectedFormat: parsed.detectedFormat,
    },
  };
}
