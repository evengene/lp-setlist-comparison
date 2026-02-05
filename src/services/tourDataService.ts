/**
 * Tour Data Service - Loads From Zero World Tour data from local files
 * Each leg is stored in a separate file for maintainability
 */

import tourMetadata from '../data/tourMetadata.json';

// Import all leg files
import leg01Data from '../data/tours/leg-01.json';
import leg02Data from '../data/tours/leg-02.json';
import leg03Data from '../data/tours/leg-03.json';
import leg04Data from '../data/tours/leg-04.json';
import leg05Data from '../data/tours/leg-05.json';
import leg06Data from '../data/tours/leg-06.json';
import leg07Data from '../data/tours/leg-07.json';
// import leg08Data from '../data/tours/leg-08.json';
// import leg09Data from '../data/tours/leg-09.json';

// Raw Setlist.fm show structure (what's in your JSON files)
interface RawShow {
  id: string;
  versionId: string;
  eventDate: string;
  lastUpdated: string;
  artist: unknown;
  venue: unknown;
  tour: unknown;
  sets: unknown;
  info?: string;
  url: string;
}

// Transformed show (what your app uses)
interface Show {
  id: string;
  legId: number;
  legName: string;
  date: string;
  city: string;
  country: string;
  venue: string;
  setlist: RawShow;
}

// Leg file structure
interface LegFile {
  legId: number;
  shows: RawShow[];
}

// Main tour data interface
export interface TourData {
  tour: {
    name: string;
    startDate: string;
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
    color?: string;
  }>;
  shows: Show[];
}

// Cache for memoization
let cachedTourData: TourData | null = null;

/**
 * Get tour data - loads from multiple leg files and combines them
 */
export function getTourData(): TourData {
  // Return cached data if available
  if (cachedTourData) {
    return cachedTourData;
  }

  console.log('📂 Loading tour data from leg files...');

  const allLegFiles: LegFile[] = [
    leg01Data as LegFile,
    leg02Data as LegFile,
    leg03Data as LegFile,
    leg04Data as LegFile,
    leg05Data as LegFile,
    leg06Data as LegFile,
    leg07Data as LegFile,
    // leg08Data as LegFile,
    // leg09Data as LegFile,
  ];

  // Transform raw shows to add extracted fields
  const allShows: Show[] = allLegFiles.flatMap(legFile =>
    legFile.shows.map(rawShow => ({
      id: rawShow.id,
      legId: legFile.legId,
      legName: `Leg ${legFile.legId}`,
      date: rawShow.eventDate,
      city: (rawShow.venue as any)?.city?.name || 'Unknown',
      country: (rawShow.venue as any)?.city?.country?.name || 'Unknown',
      venue: (rawShow.venue as any)?.name || 'Unknown',
      setlist: rawShow,
    }))
  );

  const legsWithShows = allLegFiles.filter(leg => leg.shows.length > 0);

  console.log(`✅ Loaded ${allShows.length} shows across ${legsWithShows.length} legs`);

  const result: TourData = {
    tour: {
      name: tourMetadata.tourName,
      startDate: tourMetadata.startDate,
      lastUpdated: new Date().toISOString(),
      totalShows: allShows.length,
      totalLegs: legsWithShows.length,
    },
    legs: tourMetadata.legs,
    shows: allShows,
  };

  // Cache the result
  cachedTourData = result;
  return result;
}

/**
 * Get shows filtered by leg
 */
export function getShowsByLeg(legId: number | null): Show[] {
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
  const data = getTourData();
  return {
    source: 'local-files',
    lastUpdated: data.tour.lastUpdated,
    totalShows: data.shows.length,
    totalLegs: data.tour.totalLegs,
  };
}