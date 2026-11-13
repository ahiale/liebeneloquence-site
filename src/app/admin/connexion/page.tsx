import type { Metadata } from "next";
import { Logo } from "@/components/ui/Logo";
import { ConnexionForm } from "@/components/admin/ConnexionForm";

export const metadata: Metadata = { title: "Connexion à l'admin", robots: { index: false, follow: false } };

export default async function ConnexionPage({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  const expire = (await searchParams).erreur === "lien";
  return (
    <main className="bg-hero grid min-h-screen place-items-center px-4 py-16">
      <div className="w-full max-w-[440px]">
        <Logo size={26} />
        <h1 className="mt-6 mb-0 text-[34px] font-bold tracking-[-0.03em] text-white">
          Admin <span className="serif text-gold">LEQ</span>
        </h1>
        <p className="mt-3 mb-6 text-[15.5px] leading-[1.6] text-white/80">Saisissez votre adresse : vous recevez un lien de connexion par mail. Aucun mot de passe.</p>
        {expire && <p className="mb-5 rounded-[14px] bg-orange/20 px-4 py-3 text-[14.5px] text-white">Ce lien a expiré ou a déjà servi. Demandez-en un nouveau.</p>}
        <ConnexionForm />
      </div>
    </main>
  );
}
