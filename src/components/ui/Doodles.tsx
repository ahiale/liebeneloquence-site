import type { CSSProperties } from "react";

/* Petits dessins de la charte LEQ (repris de la maquette).
   Tous décoratifs : aria-hidden. L'animation passe par className
   (« wiggle », « bob », « floaty »), coupée si l'utilisateur réduit les animations. */

type DoodleProps = {
  className?: string;
  style?: CSSProperties;
  size?: number;
  color?: string;
};

/** Étoile scintillante (rayons). */
export function Sparkle({ className, style, size = 40, color = "#FFBD59" }: DoodleProps) {
  return (
    <svg className={className} style={style} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M12 2v5M12 17v5M2 12h5M17 12h5M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3" />
    </svg>
  );
}

/** Étoile à cinq branches (contour). */
export function Star({ className, style, size = 40, color = "#FF5E01" }: DoodleProps) {
  return (
    <svg className={className} style={style} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 3l1.9 5.8L20 10.7l-5.1 3.6L16.8 21 12 17.3 7.2 21l1.9-6.7L4 10.7l6.1-1.9z" />
    </svg>
  );
}

export function Heart({ className, style, size = 30, color = "#FF5E01" }: DoodleProps) {
  return (
    <svg className={className} style={style} width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M12 21s-7-4.4-9.5-9A5.4 5.4 0 0 1 12 6.1 5.4 5.4 0 0 1 21.5 12C19 16.6 12 21 12 21z" />
    </svg>
  );
}

/** Bulle de dialogue. `fill` vide = simple contour. */
export function SpeechBubble({
  className,
  style,
  width = 64,
  height = 52,
  fill = "#fff",
  stroke = "#001636",
  lines = "#FF5E01",
}: {
  className?: string;
  style?: CSSProperties;
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string | null;
  lines?: string;
}) {
  return (
    <svg className={className} style={style} width={width} height={height} viewBox="0 0 70 56" fill="none" aria-hidden="true">
      <path
        d="M10 6h50a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H32l-12 12V38H10a8 8 0 0 1-8-8V14a8 8 0 0 1 8-8z"
        fill={fill}
        stroke={stroke ?? undefined}
        strokeWidth={stroke ? 2.4 : undefined}
        strokeLinejoin="round"
      />
      <path d="M20 20h30M20 27h20" stroke={lines} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

/** Gribouillis en boucle. */
export function Squiggle({ className, style, color = "#FFBD59" }: Omit<DoodleProps, "size">) {
  return (
    <svg className={className} style={style} width="80" height="44" viewBox="0 0 72 44" fill="none" aria-hidden="true">
      <path d="M4 32c10-22 26-26 36-14s8 18 0 16-6-16 6-22 18 0 22 6" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

/** Flèche gribouillée. */
export function ScribbleArrow({ className, style, color = "#FFBD59" }: Omit<DoodleProps, "size">) {
  return (
    <svg className={className} style={style} width="90" height="50" viewBox="0 0 90 50" fill="none" aria-hidden="true">
      <path d="M4 30c16-20 34-22 44-10 6 8-2 16-8 10s4-20 22-20c8 0 16 4 22 10" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
      <path d="m78 12 8 8-11 2" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Micro dessiné. */
export function MicDoodle({
  className,
  style,
  width = 70,
  height = 90,
  stand = "#fff",
  body = "#fff",
}: {
  className?: string;
  style?: CSSProperties;
  width?: number;
  height?: number;
  stand?: string;
  body?: string;
}) {
  return (
    <svg className={className} style={style} width={width} height={height} viewBox="0 0 70 90" fill="none" aria-hidden="true">
      <rect x="20" y="4" width="30" height="44" rx="15" fill={body} stroke="#001636" strokeWidth="2.5" />
      <path d="M24 18h22M24 26h22M24 34h22" stroke="#001636" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 36c0 14 10 24 23 24s23-10 23-24M35 60v18M24 84h22" stroke={stand} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Trait de soulignement qui se dessine. */
export function DrawUnderline({
  className = "",
  style,
  width = 230,
  color = "#FFBD59",
}: {
  className?: string;
  style?: CSSProperties;
  width?: number;
  color?: string;
}) {
  return (
    <svg className={`draw ${className}`} style={{ display: "block", ...style }} width={width} height="24" viewBox="0 0 230 24" fill="none" aria-hidden="true">
      <path d="M4 15c32-9 66-11 104-8s78 4 118-6" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Coche de liste. */
export function Check({ color = "#114DA8", size = 18 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function ArrowRight({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export function ArrowLeft({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

/** Pointe de bulle de parole (bas de carte). */
export function BubbleTail({ side = "left" }: { side?: "left" | "right" }) {
  return side === "left" ? (
    <svg width="34" height="24" viewBox="0 0 34 24" aria-hidden="true" style={{ position: "absolute", left: 40, bottom: -21 }}>
      <path d="M2 0 L10 22 L30 0" fill="#fff" stroke="#001636" strokeWidth="2" strokeLinejoin="round" />
      <path d="M0 0h34" stroke="#fff" strokeWidth="5" />
    </svg>
  ) : (
    <svg width="34" height="24" viewBox="0 0 34 24" aria-hidden="true" style={{ position: "absolute", right: 40, bottom: -21 }}>
      <path d="M4 0 L24 22 L32 0" fill="#fff" stroke="#001636" strokeWidth="2" strokeLinejoin="round" />
      <path d="M0 0h34" stroke="#fff" strokeWidth="5" />
    </svg>
  );
}
