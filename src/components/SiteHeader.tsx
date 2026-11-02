import Link from "next/link";

const links = [
  { href: "/short-link", label: "短链" },
  { href: "/paste", label: "便签" },
  { href: "https://korealu.top/x-video-parse", label: "帧存", external: true },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-[#f6f7f9]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-950 text-[13px] font-semibold text-white">
            PT
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-zinc-950">Personal Tools</div>
            <div className="text-[11px] text-zinc-450 text-zinc-500">korealu</div>
          </div>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {links.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full px-3 py-1.5 text-zinc-600 transition hover:bg-white hover:text-zinc-950"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-1.5 text-zinc-600 transition hover:bg-white hover:text-zinc-950"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}
