/** Formats a count and label, with an optional irregular plural form. */
export function formatCountLabel(count: number, singular: string, pluralForm = `${singular}S`): string {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}
