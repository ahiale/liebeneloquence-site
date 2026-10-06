/** Résultat renvoyé par les actions de formulaire au navigateur. */
export type FormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string; fields?: Record<string, string> };

export const IDLE: FormState = { status: "idle" };

/** Nom du champ invisible anti-robots (laissé vide par les humains). */
export const HONEYPOT = "site_web";
