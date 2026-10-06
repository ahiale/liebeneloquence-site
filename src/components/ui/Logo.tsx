import Link from "next/link";

/**
 * Logo « LEQ. » : lettres bleu nuit sur fond clair, blanches sur fond sombre,
 * toujours avec le point orange.
 */
export function Logo({ size = 24, tone = "light" }: { size?: number; tone?: "light" | "dark" }) {
  return (
    <Link
      href="/"
      aria-label="Lieben Éloquence, retour à l'accueil"
      style={{ fontSize: size, color: tone === "light" ? "#FFFFFF" : "#001636" }}
      className="font-extrabold tracking-[-0.04em] no-underline"
    >
      LEQ<span style={{ color: "#FF5E01" }}>.</span>
    </Link>
  );
}
