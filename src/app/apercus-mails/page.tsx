import { readdir } from "node:fs/promises";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PREVIEW_DIR } from "@/lib/mail";

/* Page de travail, uniquement en local (npm run dev) : liste les mails
   générés par les formulaires tant que l'envoi réel n'est pas configuré. */

export const dynamic = "force-dynamic";
export const metadata = { title: "Aperçu des mails", robots: { index: false } };

export default async function ApercusMails() {
  if (process.env.NODE_ENV !== "development") notFound();
  const files = (await readdir(PREVIEW_DIR()).catch(() => [] as string[])).filter((f) => f.endsWith(".html")).sort().reverse();

  return (
    <main className="wrap py-12 text-white">
      <h1 className="m-0 text-[32px] font-bold">Aperçu des mails</h1>
      <p className="mt-2 text-white/70">Les plus récents en premier. Visible uniquement sur votre ordinateur.</p>
      {files.length === 0 ? (
        <p className="mt-8">Aucun mail pour l&apos;instant : remplissez un formulaire du site.</p>
      ) : (
        <ul className="mt-8 grid list-none gap-2 p-0">
          {files.map((f) => (
            <li key={f}>
              <Link href={`/apercus-mails/${encodeURIComponent(f)}`} target="_blank" className="block rounded-xl bg-white/8 px-4 py-3 no-underline hover:bg-white/14">
                <span className="text-white/50">{f.slice(0, 19).replace("T", " ").replace(/-(\d\d)-(\d\d)$/, ":$1:$2")}</span> · {f.slice(25, -5).replace(/-/g, " ")}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
