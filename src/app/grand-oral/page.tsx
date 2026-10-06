import type { Metadata } from "next";
import { GrandOralPage } from "@/components/pages/GrandOral";

export const metadata: Metadata = {
  title: "L'offre Grand Oral — Terminale, BTS, soutenance, pitch",
  description:
    "5 séances intensives pour préparer le Grand Oral, un oral de BTS, une soutenance ou un pitch : structuration du discours, gestion du trac, mise en situation et feedback personnalisé.",
};

export default function Page() {
  return <GrandOralPage />;
}
