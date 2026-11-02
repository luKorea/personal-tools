export type ToolCard = {
  href: string;
  title: string;
  description: string;
  badge?: string;
  external?: boolean;
};

export const TOOLS: ToolCard[] = [
  {
    href: "/short-link",
    title: "短链",
    description: "把长链接收成短码，支持自定义短码和访问计数。",
    badge: "本地可用",
  },
  {
    href: "/paste",
    title: "便签粘贴板",
    description: "丢一段文字，生成可分享的链接，可设过期时间。",
    badge: "本地可用",
  },
  {
    href: "https://korealu.top/x-video-parse",
    title: "帧存 · 视频解析",
    description: "解析 X / YouTube / 抖音 / B 站 / Instagram 视频，支持转 GIF。",
    badge: "已上线",
    external: true,
  },
  {
    href: "#",
    title: "图床",
    description: "上传图片拿直链。下一步再接对象存储或本地磁盘。",
    badge: "规划中",
  },
];
