import type { Metadata } from "next";
import Link from "next/link";
import { exigerAdmin, MODULES } from "@/lib/admin";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** Cadre de l'admin : réservé à l'admin connectée (sinon, page de connexion). */
export default async function EspaceAdmin({ children }: { children: React.ReactNode }) {
  const email = await exigerAdmin();
  return (
    <div className="min-h-screen bg-[#F4F7FC] text-ink">
      <header className="bg-ink text-white">
        <div className="wrap flex flex-wrap items-center gap-x-8 gap-y-3 py-4">
          <Link href="/admin" className="no-underline">
            <Logo size={20} />
          </Link>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[14.5px]">
            {MODULES.map((m) =>
              m.pret ? (
                <Link key={m.href} href={m.href} className="text-white/85 no-underline hover:text-white">
                  {m.label}
                </Link>
              ) : (
                <span key={m.href} className="text-white/35" title="Bientôt">
                  {m.label}
                </span>
              ),
            )}
          </nav>
          <span className="ml-auto text-[13px] text-white/50">{email}</span>
        </div>
      </header>
      <main className="wrap py-10">{children}</main>
    </div>
  );
}
