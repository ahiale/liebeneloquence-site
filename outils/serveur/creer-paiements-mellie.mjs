// Crée dans Stripe (compte réel) les deux liens de paiement de la BD « Mellie a le trac » :
// 1. précommande de la version papier : 12 € minimum, prix libre au-dessus, livraison en France ;
// 2. « Soutenir LEQ » (love money) : montant libre à partir de 1 €.
// Exécuté une seule fois sur le serveur (la clé reste dans /opt/leq/.env, jamais affichée) :
//   ssh root@169.58.187.153 "cd /opt/leq && docker compose exec -T site node --input-type=module -" < outils/serveur/creer-paiements-mellie.mjs
// Les deux liens obtenus sont à reporter dans src/config/site.ts (SITE.stripeMellie, SITE.stripeSoutien).
const CLE = process.env.STRIPE_SECRET_KEY;
if (!CLE) throw new Error("STRIPE_SECRET_KEY absente");

const encoder = (obj, prefixe = "") =>
  Object.entries(obj).flatMap(([k, v]) => {
    const nom = prefixe ? `${prefixe}[${k}]` : k;
    if (v === undefined || v === null) return [];
    if (typeof v === "object") return encoder(v, nom);
    return [`${encodeURIComponent(nom)}=${encodeURIComponent(String(v))}`];
  });
const stripe = async (chemin, corps) => {
  const r = await fetch(`https://api.stripe.com/v1${chemin}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${CLE}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: encoder(corps).join("&"),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(`${chemin} : ${d.error?.message}`);
  return d;
};

// 1. Précommande papier
const livre = await stripe("/products", {
  name: "Mellie a le trac · BD papier (précommande)",
  description: "La BD et son cahier d'exercices anti-trac, version imprimée, livraison comprise en France.",
  metadata: { leq: "mellie-papier" },
});
const prixLivre = await stripe("/prices", { product: livre.id, currency: "eur", custom_unit_amount: { enabled: true, minimum: 1200, preset: 1200 } });
const lienLivre = await stripe("/payment_links", {
  line_items: { 0: { price: prixLivre.id, quantity: 1 } },
  shipping_address_collection: { allowed_countries: { 0: "FR" } },
  phone_number_collection: { enabled: true },
  metadata: { leq: "mellie-papier" },
  custom_text: {
    submit: { message: "Précommande : 12 € minimum, qui couvrent uniquement l'impression et l'envoi (livraison en France uniquement). Tout montant au-dessus soutient LEQ. L'impression est lancée dès 30 précommandes, pas avant ; vous êtes prévenu·e par mail, et remboursé·e si elle n'a pas lieu." },
  },
  after_completion: { type: "redirect", redirect: { url: "https://liebeneloquence.com/mellie?merci=precommande" } },
});

// 2. Soutenir LEQ
const soutien = await stripe("/products", { name: "Soutenir LEQ", description: "Un coup de pouce libre pour soutenir les projets de Lieben Éloquence.", metadata: { leq: "soutien" } });
const prixSoutien = await stripe("/prices", { product: soutien.id, currency: "eur", custom_unit_amount: { enabled: true, minimum: 100, preset: 500 } });
const lienSoutien = await stripe("/payment_links", {
  line_items: { 0: { price: prixSoutien.id, quantity: 1 } },
  submit_type: "donate",
  metadata: { leq: "soutien" },
  after_completion: { type: "redirect", redirect: { url: "https://liebeneloquence.com/mellie?merci=soutien" } },
});

console.log(JSON.stringify({ precommande: lienLivre.url, soutien: lienSoutien.url }));
