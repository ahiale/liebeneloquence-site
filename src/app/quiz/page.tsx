import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { SimpleHeader } from "@/components/layout/SimpleHeader";
import { Sparkle } from "@/components/ui/Doodles";
import { Quiz } from "@/components/quiz/Quiz";

export const metadata: Metadata = pageMeta({
  title: "Quiz gratuit : quel orateur êtes-vous ?",
  description: "6 questions, 2 minutes : découvrez gratuitement votre profil d'orateur, votre niveau et vos points à travailler en prise de parole.",
  path: "/quiz",
});

export default function QuizPage() {
  return (
    <div className="bg-hero relative min-h-screen overflow-hidden text-white">
      <Sparkle className="wiggle hide-sm absolute" size={46} style={{ left: "6%", top: 180 }} />
      <Sparkle className="wiggle hide-sm absolute" size={34} color="#fff" style={{ right: "8%", top: 320 }} />
      <SimpleHeader />
      <Quiz />
    </div>
  );
}
