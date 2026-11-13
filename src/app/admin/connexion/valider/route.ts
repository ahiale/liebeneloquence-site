import { NextResponse } from "next/server";
import { COOKIE_ADMIN, sessionDepuisLien } from "@/lib/admin";
import { SITE } from "@/config/site";

/** Lien reçu par mail : ouvre la session admin sur cet appareil, puis mène au tableau de bord. */
export async function GET(req: Request) {
  const session = sessionDepuisLien(new URL(req.url).searchParams.get("jeton"));
  if (!session) return NextResponse.redirect(`${SITE.url}/admin/connexion?erreur=lien`, 303);
  const r = NextResponse.redirect(`${SITE.url}/admin`, 303);
  r.cookies.set(COOKIE_ADMIN, session.valeur, { httpOnly: true, secure: true, sameSite: "lax", path: "/admin", maxAge: session.maxAge });
  return r;
}
