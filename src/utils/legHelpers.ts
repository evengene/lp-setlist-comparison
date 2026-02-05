/**
 * Might need helpers
 */

export interface Leg {
  id: number;
  name: string;
  region: string;
  startDate: string;
  endDate: string;
  color: string;
}

/**
 * Parse setlist.fm date format (DD-MM-YYYY) to Date object
 */
export function parseSetlistDate(dateString: string): Date {
  const [day, month, year] = dateString.split('-');
  return new Date(`${year}-${month}-${day}`);
}

/**
 * Format date to readable string
 */
export function formatDate(dateString: string): string {
  const date = parseSetlistDate(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Get leg date range as string
 */
export function getLegDateRange(leg: Leg): string {
  const start = new Date(leg.startDate);
  const end = new Date(leg.endDate);

  const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return `${startStr} - ${endStr}`;
}
