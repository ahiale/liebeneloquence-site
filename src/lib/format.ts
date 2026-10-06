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
