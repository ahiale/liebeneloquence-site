/** « 89 », « 3,99 » : nombre au format français, sans décimales inutiles. */
export function formatAmount(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** « 3,99 € » */
export function formatPrice(value: number): string {
  return `${formatAmount(value)} €`;
}

/** « 19 octobre 2026 » à partir d'une date AAAA-MM-JJ. */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T12:00:00Z`));
}
