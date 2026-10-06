import type { LucideIcon } from "lucide-react";

type Tone = "gold" | "orange" | "royal" | "success" | "violet" | "neutral";
type Size = "sm" | "md" | "lg";

/* Tuiles d'icônes : dégradé sourd + liseré, pour un rendu solide et
   professionnel (aucun emoji dans l'interface). */
const tones: Record<Tone, { dark: string; light: string }> = {
  gold: {
    dark: "bg-gold/14 text-gold ring-gold/25",
    light: "bg-gold/18 text-orange-700 ring-gold/40",
  },
  orange: {
    dark: "bg-orange/14 text-orange ring-orange/28",
    light: "bg-orange/12 text-orange-700 ring-orange/30",
  },
  royal: {
    dark: "bg-royal/28 text-royal-200 ring-royal/40",
    light: "bg-royal/10 text-royal ring-royal/20",
  },
  success: {
    dark: "bg-success/14 text-success-300 ring-success/28",
    light: "bg-success/12 text-success ring-success/25",
  },
  violet: {
    dark: "bg-[#70268a]/20 text-[#c79ae0] ring-[#c79ae0]/25",
    light: "bg-[#70268a]/10 text-[#70268a] ring-[#70268a]/20",
  },
  neutral: {
    dark: "bg-white/8 text-white/80 ring-white/15",
    light: "bg-ink/6 text-ink/70 ring-ink/10",
  },
};

const sizes: Record<Size, { box: string; icon: number }> = {
  sm: { box: "h-9 w-9 rounded-[11px]", icon: 17 },
  md: { box: "h-11 w-11 rounded-[13px]", icon: 20 },
  lg: { box: "h-14 w-14 rounded-[17px]", icon: 25 },
};

export function IconTile({
  icon: Icon,
  tone = "gold",
  size = "md",
  variant = "dark",
  className = "",
}: {
  icon: LucideIcon;
  tone?: Tone;
  size?: Size;
  variant?: "dark" | "light";
  className?: string;
}) {
  const s = sizes[size];
  return (
    <span
      aria-hidden
      className={`inline-grid shrink-0 place-items-center ring-1 ${s.box} ${tones[tone][variant]} ${className}`}
    >
      <Icon size={s.icon} strokeWidth={1.9} />
    </span>
  );
}
