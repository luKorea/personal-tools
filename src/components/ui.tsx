import {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

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
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-link">{eyebrow}</p>
      ) : null}
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h1>
      <p className="max-w-2xl text-[15px] leading-7 text-muted">{description}</p>
    </section>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-panel-border bg-panel p-5 shadow-[0_1px_1px_rgba(0,0,0,0.04),0_8px_24px_rgba(18,22,30,0.04)] sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return <span className="mb-2 block text-sm font-medium text-gray-800">{children}</span>;
}

const fieldClass =
  "w-full rounded-xl border border-panel-border bg-background px-3.5 py-2.5 text-[15px] text-foreground outline-none transition placeholder:text-muted focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand-soft";

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
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: string }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition hover:bg-[#1b2d70] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    />
  );
}

export function GhostButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-xl border border-panel-border bg-white/70 px-3.5 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-white ${props.className || ""}`}
    />
  );
}
