import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant =
  | "primary" /* dégradé or → orange, sur fond sombre comme clair */
  | "royal" /* bleu roi plein */
  | "ghost" /* verre translucide, fond sombre */
  | "outline" /* contour clair */
  | "light"; /* bleu pâle sur fond clair */

type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-all duration-200 disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary:
    "bg-[linear-gradient(96deg,var(--color-gold),var(--color-orange))] text-ink shadow-[0_16px_38px_-16px_rgba(255,94,1,0.75)] hover:brightness-110 hover:-translate-y-0.5",
  royal:
    "bg-royal text-white shadow-[0_16px_38px_-18px_rgba(17,77,168,0.9)] hover:bg-royal-400 hover:-translate-y-0.5",
  ghost:
    "border border-white/15 bg-white/8 text-white backdrop-blur-md hover:border-white/30 hover:bg-white/14",
  outline:
    "border border-white/25 bg-transparent text-white hover:border-white/55 hover:bg-white/5",
  light:
    "bg-royal-200 text-ink-700 hover:bg-royal-200/80 hover:-translate-y-0.5",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-[0.82rem]",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-[0.95rem]",
};

type Common = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

const cx = (v: Variant, s: Size, extra: string) =>
  `${base} ${variants[v]} ${sizes[s]} ${extra}`;

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: Common & ComponentProps<"button">) {
  return (
    <button className={cx(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  children,
  href,
  external = false,
  ...props
}: Common & { href: string; external?: boolean } & Omit<
    ComponentProps<typeof Link>,
    "href" | "className"
  >) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={cx(variant, size, className)}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cx(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}
