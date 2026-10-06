import Link from "next/link";
import { Container } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <main className="bg-night flex min-h-screen flex-col items-center justify-center py-24">
      <Container className="max-w-xl text-center">
        <Logo size={30} />
        <p className="mt-10 font-serif text-7xl italic text-orange">404</p>
        <h1 className="h-section mt-6 text-3xl sm:text-4xl">
          Cette page reste sans voix.
        </h1>
        <p className="mt-4 leading-relaxed text-white/65">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
          Reprenons depuis le début.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/" variant="primary" size="lg">
            Retour à l&apos;accueil
          </ButtonLink>
          <ButtonLink href="/quiz" variant="ghost" size="lg">
            Faire le quiz
          </ButtonLink>
        </div>

        <p className="mt-8 text-sm text-white/45">
          Ou consultez{" "}
          <Link href="/evenements" className="text-gold underline underline-offset-4">
            les prochains événements
          </Link>
          .
        </p>
      </Container>
    </main>
  );
}
