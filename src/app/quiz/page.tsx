import type { Metadata } from "next";
import { QuizApp } from "@/components/quiz/QuizApp";

export const metadata: Metadata = {
  title: "Quel type d'orateur êtes-vous ?",
  description:
    "6 questions, 2 minutes : découvrez votre profil d'orateur, vos forces, vos axes de travail et la formation LEQ qui vous correspond.",
};

export default function QuizPage() {
  return <QuizApp />;
}
