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
    href: "/short-link",
    title: "短链",
    description: "长链接收成短码，支持自定义与访问计数。",
    badge: "可用",
    accent: "sky",
    icon: "🔗",
  },
  {
    href: "/paste",
    title: "便签",
    description: "临时分享文本、日志或配置，可设过期。",
    badge: "可用",
    accent: "violet",
    icon: "📝",
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
    href: "#",
    title: "图床",
    description: "上传图片拿直链，下一步再接存储。",
    badge: "规划中",
    accent: "amber",
    icon: "🖼️",
  },
];
