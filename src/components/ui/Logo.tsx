import Link from "next/link";

/** Logo « LEQ. » : `tone` règle la couleur des lettres selon le fond. */
export function Logo({
  size = 24,
  tone = "gold",
  dot = "#FF5E01",
}: {
  size?: number;
  tone?: "gold" | "ink";
  dot?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="Lieben Éloquence, retour à l'accueil"
      style={{ fontSize: size, color: tone === "gold" ? "#FFBD59" : "#001636" }}
      className="font-extrabold tracking-[-0.04em] no-underline"
    >
      LEQ<span style={{ color: dot }}>.</span>
    </Link>
  );
}
