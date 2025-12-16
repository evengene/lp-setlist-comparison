import type { Leg, EnrichedShow } from '../services/tourDataService.old.ts';

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
 * Find which leg a show belongs to based on date
 */
export function findLegByDate(showDate: Date, legs: Leg[]): Leg | undefined {
  return legs.find(leg => {
    const start = new Date(leg.startDate);
    const end = new Date(leg.endDate);
    return showDate >= start && showDate <= end;
  });
}

/**
 * Get all shows for a specific leg
 */
export function filterShowsByLeg(shows: EnrichedShow[], legId: number): EnrichedShow[] {
  return shows.filter(show => show.legId === legId);
}

/**
 * Get leg statistics
 */
export function getLegStats(shows: EnrichedShow[], legId: number) {
  const legShows = filterShowsByLeg(shows, legId);

  if (legShows.length === 0) {
    return {
      showCount: 0,
      cities: [],
      countries: [],
      firstShow: null,
      lastShow: null
    };
  }

  // Sort by date
  const sorted = [...legShows].sort((a, b) =>
    parseSetlistDate(a.date).getTime() - parseSetlistDate(b.date).getTime()
  );

  const cities = [...new Set(legShows.map(s => s.city))];
  const countries = [...new Set(legShows.map(s => s.country))];

  return {
    showCount: legShows.length,
    cities,
    countries,
    firstShow: sorted[0],
    lastShow: sorted[sorted.length - 1]
  };
}

/**
 * Check if a leg is in the future
 */
export function isLegFuture(leg: Leg): boolean {
  const startDate = new Date(leg.startDate);
  return startDate > new Date();
}

/**
 * Check if a leg is currently active
 */
export function isLegActive(leg: Leg): boolean {
  const now = new Date();
  const start = new Date(leg.startDate);
  const end = new Date(leg.endDate);
  return now >= start && now <= end;
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
