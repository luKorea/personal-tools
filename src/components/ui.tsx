import { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <section className="space-y-3">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--lime)]">{eyebrow}</p>
      ) : null}
      <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
      <p className="max-w-2xl text-[15px] leading-7 text-[color:var(--muted)]">{description}</p>
    </section>
  );
}

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-3xl border border-[color:var(--panel-border)] bg-[color:var(--panel)] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return <span className="mb-2 block text-sm font-medium text-zinc-200">{children}</span>;
}

const fieldClass =
  "w-full rounded-2xl border border-white/10 bg-black/35 px-3.5 py-2.5 text-[15px] text-white outline-none transition placeholder:text-zinc-500 focus:border-[color:var(--lime)] focus:ring-4 focus:ring-[color:var(--lime-soft)]";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${fieldClass} ${props.className || ""}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${fieldClass} resize-y ${props.className || ""}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${fieldClass} ${props.className || ""}`} />;
}

export function PrimaryButton({
  tone = "lime",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "lime" | "sky" | "violet" | "dark" }) {
  const tones = {
    lime: "bg-[color:var(--lime)] text-zinc-950 hover:brightness-110",
    sky: "bg-[color:var(--lime)] text-zinc-950 hover:brightness-110",
    violet: "bg-[color:var(--lime)] text-zinc-950 hover:brightness-110",
    dark: "bg-white text-zinc-950 hover:bg-zinc-200",
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone]} ${className}`}
    />
  );
}

export function GhostButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/5 px-3.5 py-2 text-sm font-medium text-zinc-100 transition hover:bg-white/10 ${props.className || ""}`}
    />
  );
}
