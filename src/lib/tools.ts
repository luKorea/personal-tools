export type ToolCard = {
  href: string;
  title: string;
  description: string;
  badge?: string;
  external?: boolean;
  accent: "sky" | "violet" | "rose" | "amber";
  icon: string;
};

export const TOOLS: ToolCard[] = [
  {
    href: "/chat-clean",
    title: "聊天记录清洗",
    description: "微信 / QQ 导出文本一键整理成可读 Markdown，本地处理不上传。",
    badge: "新",
    accent: "sky",
    icon: "💬",
  },
  {
    href: "https://korealu.top/x-video-parse",
    title: "帧存",
    description: "解析多平台视频，支持转 GIF。",
    badge: "已上线",
    external: true,
    accent: "rose",
    icon: "🎬",
  },
  {
    href: "/short-link",
    title: "短链",
    description: "长链接收成短码，支持自定义与访问计数。",
    badge: "可用",
    accent: "violet",
    icon: "🔗",
  },
  {
    href: "/paste",
    title: "便签",
    description: "临时分享文本、日志或配置，可设过期。",
    badge: "可用",
    accent: "amber",
    icon: "📝",
  },
];
