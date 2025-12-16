/**
 * Tour Data Service - Loads From Zero World Tour data from local file
 * Simple and fast - no API calls, no caching complexity
 */

import fromZeroTourData from '../data/fromZeroTourData.json';

export interface TourData {
  tour: {
    name: string;
    startDate: string;
    endDate: string;
    lastUpdated: string;
    totalShows: number;
    totalLegs: number;
  };
  legs: Array<{
    id: number;
    name: string;
    region: string;
    startDate: string;
    endDate: string;
    color: string;
  }>;
  shows: Array<{
    id: string;
    legId: number | null;
    legName: string;
    date: string;
    city: string;
    country: string;
    venue: string;
    setlist: any;
  }>;
}

/**
 * Get tour data - loads from local file instantly
 */
export function getTourData(): TourData {
  console.log('📂 Loading tour data from local file...');
  console.log(`✅ Loaded ${fromZeroTourData.tourData.shows.length} shows`);
  return fromZeroTourData.tourData as TourData;
}

/**
 * Get shows filtered by leg
 */
export function getShowsByLeg(legId: number | null): TourData['shows'] {
  const data = getTourData();
  if (legId === null) {
    return data.shows;
  }
  return data.shows.filter(show => show.legId === legId);
}

/**
 * Get cache info (for display purposes)
 */
export function getCacheInfo() {
  return {
    source: 'local-file',
    lastUpdated: fromZeroTourData.tourData.tour.lastUpdated,
    totalShows: fromZeroTourData.tourData.shows.length,
  };
}
