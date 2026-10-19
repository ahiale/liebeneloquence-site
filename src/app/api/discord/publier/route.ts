import { cleServeurValide } from "@/lib/cle-serveur";
import { publierPlanifies } from "@/lib/publications-discord";

/**
 * Publications automatiques du robot LEQ (planning Google Sheets et opportunités), voir lib/publications-discord.ts.
 * Appelée toutes les 5 minutes par le serveur (/opt/leq/publier-discord.sh, tâche cron) avec l'en-tête « X-LEQ-Cle ».
 */
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: Request) {
  if (!cleServeurValide(req)) return new Response("Not found", { status: 404 });
  const bilan = await publierPlanifies();
  if (bilan.erreurs.length) console.error("Publications Discord :", bilan.erreurs.join(" · "));
  return Response.json(bilan);
}
