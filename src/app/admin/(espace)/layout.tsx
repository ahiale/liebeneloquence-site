import type { Metadata } from "next";
import Link from "next/link";
import { exigerAdmin, MODULES } from "@/lib/admin";
import { NavAdmin } from "@/components/admin/NavAdmin";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** Cadre de l'admin : menu latéral et contenu. Réservé à l'admin connectée (sinon, page de connexion). */
export default async function EspaceAdmin({ children }: { children: React.ReactNode }) {
  const email = await exigerAdmin();
  return (
    <div className="admin-cadre grid min-h-screen bg-[#F4F7FC] text-ink lg:grid-cols-[248px_1fr]">
      {/* Le pied de page du site n'a pas sa place dans l'admin */}
      <style>{"footer{display:none}"}</style>
      <aside className="bg-ink px-4 py-6 text-white lg:sticky lg:top-0 lg:h-screen">
        <Link href="/admin" className="block px-3 pb-6 text-[26px] font-black tracking-[-0.04em] text-white no-underline">
          LEQ<span className="text-orange">.</span> <span className="text-[13px] font-semibold tracking-normal text-white/50">admin</span>
        </Link>
        <NavAdmin modules={MODULES} />
        <p className="mt-8 px-3 text-[12px] break-all text-white/40">{email}</p>
        <Link href="/" className="mt-2 block px-3 text-[12.5px] text-white/60 no-underline hover:text-white">
          ← Voir le site
        </Link>
      </aside>
      <main className="min-w-0 px-5 py-8 sm:px-10">{children}</main>
    </div>
  );
}
