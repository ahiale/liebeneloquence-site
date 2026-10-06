import Link from "next/link";

export function Logo({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const scale = { sm: "text-xl", md: "text-2xl", lg: "text-3xl" }[size];

  return (
    <Link
      href="/"
      aria-label="Lieben Éloquence — retour à l'accueil"
      className={`inline-flex items-baseline font-extrabold tracking-[-0.04em] text-gold transition-opacity hover:opacity-85 ${scale} ${className}`}
    >
      LEQ
      <span className="text-orange">.</span>
    </Link>
  );
}
