import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0b1020]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-violet-500 text-xs text-white shadow-lg shadow-sky-500/30">
            工
          </span>
          <span className="text-white group-hover:text-sky-200 transition-colors">个人工具站</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-300">
          <Link href="/short-link" className="hover:text-white transition-colors">
            短链
          </Link>
          <Link href="/paste" className="hover:text-white transition-colors">
            便签
          </Link>
          <a
            href="https://korealu.top/x-video-parse"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            帧存
          </a>
        </nav>
      </div>
    </header>
  );
}
