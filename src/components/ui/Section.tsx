import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Eyebrow({
  children,
  className = "text-gold",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

/**
 * Titre de section : SF Pro Display serré, avec un fragment mis en valeur.
 * `accent` accepte du texte ou un élément (pour l'italique didone).
 */
export function SectionTitle({
  children,
  className = "",
  as: Tag = "h2",
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag
      className={`h-section mt-4 text-4xl sm:text-[2.9rem] lg:text-[3.25rem] ${className}`}
    >
      {children}
    </Tag>
  );
}

/** Paragraphe d'introduction de section. */
export function Lede({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`mt-5 max-w-2xl leading-relaxed text-white/65 ${className}`}>
      {children}
    </p>
  );
}
