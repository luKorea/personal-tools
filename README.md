# 个人工具站

本地个人工具合集（Next.js App Router）。

## 已有工具

- `/` 工具首页
- `/short-link` 短链（本地 `data/short-links.json`）
- `/s/[code]` 短链跳转
- `/paste` 便签粘贴板
- `/paste/[id]` 便签详情
- 帧存：外链到 https://korealu.top/x-video-parse
- 图床：占位

## 本地运行

```bash
cd personal-tools
npm install
npm run dev
```

打开 http://localhost:3000

## 说明

数据默认写在项目根目录 `data/*.json`，已加入 `.gitignore`。以后接 GitHub 远程仓库时，把仓库地址给我即可关联。
