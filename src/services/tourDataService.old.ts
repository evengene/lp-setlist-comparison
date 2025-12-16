import type { Setlist } from '../types/setlist';
import { setlistService } from './setlistService';
import tourConfig from '../data/tourConfig.json';

export interface Leg {
  id: number;
  name: string;
  region: string;
  startDate: string;
  endDate: string;
  color: string;
}

export interface EnrichedShow {
  id: string;
  legId: number;
  legName: string;
  date: string;
  city: string;
  country: string;
  venue: string;
  setlist: Setlist;
}

export interface TourData {
  tour: {
    name: string;
    startDate: string;
    endDate: string;
    totalShows: number;
    totalLegs: number;
  };
  legs: Leg[];
  shows: EnrichedShow[];
}

const CACHE_KEY = 'fromZeroTourData';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Parse setlist.fm date format (DD-MM-YYYY) to Date object
 */
function parseSetlistDate(dateString: string): Date {
  const [day, month, year] = dateString.split('-');
  return new Date(`${year}-${month}-${day}`);
}

/**
 * Find which leg a show belongs to based on date
 */
function findLegByDate(showDate: Date, legs: Leg[]): Leg | undefined {
  return legs.find(leg => {
    const start = new Date(leg.startDate);
    const end = new Date(leg.endDate);
    return showDate >= start && showDate <= end;
  });
}

/**
 * Fetch all pages from setlist.fm API with improved error handling
 */
async function fetchAllPages(): Promise<Setlist[]> {
  const allSetlists: Setlist[] = [];
  let page = 1;
  const maxPages = 10; // Safety limit

  console.log('🔄 Starting to fetch From Zero tour shows...');

  try {
    while (page <= maxPages) {
      console.log(`📄 Fetching page ${page}...`);

      try {
        const response = await setlistService.getLinkinParkSetlists(page);

        console.log(`✅ Page ${page} response:`, {
          total: response.total,
          itemsPerPage: response.itemsPerPage,
          setlistCount: response.setlist?.length || 0
        });

        // Check if we got any setlists
        if (!response.setlist || response.setlist.length === 0) {
          console.log('⚠️ No more setlists, stopping pagination');
          break;
        }

        // Filter for From Zero World Tour
        const tourShows = response.setlist.filter(
          s => s.tour?.name === 'From Zero World Tour'
        );

        console.log(`🎵 Found ${tourShows.length} From Zero tour shows on page ${page}`);

        if (tourShows.length === 0) {
          // No tour shows on this page - might be past our tour
          console.log('⚠️ No From Zero shows on this page, checking if we should continue...');

          // If we already have shows, stop. Otherwise, try next page.
          if (allSetlists.length > 0) {
            console.log('✅ Already have shows, stopping pagination');
            break;
          }
        } else {
          allSetlists.push(...tourShows);
        }

        // Check if we've reached the end
        const totalPages = Math.ceil(response.total / response.itemsPerPage);
        console.log(`📊 Progress: page ${page}/${totalPages}`);

        if (page >= totalPages) {
          console.log('✅ Reached last page');
          break;
        }

        page++;

        // Rate limiting: wait 300ms between requests
        if (page <= maxPages) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }

      } catch (pageError) {
        console.error(`❌ Error fetching page ${page}:`, pageError);

        // If we have some data, return what we have
        if (allSetlists.length > 0) {
          console.log(`⚠️ Returning ${allSetlists.length} shows despite error`);
          break;
        }

        // If it's the first page and it fails, throw the error
        if (page === 1) {
          throw pageError;
        }

        break;
      }
    }
  } catch (error) {
    console.error('❌ Fatal error in fetchAllPages:', error);
    throw error;
  }

  console.log(`✅ Total shows fetched: ${allSetlists.length}`);
  return allSetlists;
}

/**
 * Enrich setlist data with leg information
 */
function enrichSetlists(setlists: Setlist[], legs: Leg[]): EnrichedShow[] {
  console.log(`🔧 Enriching ${setlists.length} setlists...`);

  return setlists.map(setlist => {
    const showDate = parseSetlistDate(setlist.eventDate);
    const leg = findLegByDate(showDate, legs);

    return {
      id: setlist.id,
      legId: leg?.id || 0,
      legName: leg?.name || 'Unknown',
      date: setlist.eventDate,
      city: setlist.venue.city.name,
      country: setlist.venue.city.country.name,
      venue: setlist.venue.name,
      setlist: setlist
    };
  });
}

/**
 * Get tour data from cache or API
 */
export async function getTourData(forceRefresh: boolean = false): Promise<TourData> {
  console.log('🚀 getTourData called, forceRefresh:', forceRefresh);

  // Check cache first (unless forcing refresh)
  if (!forceRefresh) {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const data = JSON.parse(cached);
        const cacheAge = Date.now() - data.timestamp;
        const cacheAgeMinutes = Math.floor(cacheAge / 1000 / 60);

        console.log(`💾 Found cached data (age: ${cacheAgeMinutes} minutes)`);

        if (cacheAge < CACHE_DURATION) {
          console.log('✅ Using cached tour data');
          return data.tourData;
        } else {
          console.log('⚠️ Cache expired, fetching fresh data');
        }
      } catch (error) {
        console.error('❌ Error parsing cached data:', error);
      }
    } else {
      console.log('💾 No cache found');
    }
  }

  // Fetch from API
  console.log('🌐 Fetching fresh tour data from API...');

  try {
    const allSetlists = await fetchAllPages();

    if (allSetlists.length === 0) {
      throw new Error('No setlists returned from API');
    }

    const enrichedShows = enrichSetlists(allSetlists, tourConfig.legs);

    const tourData: TourData = {
      tour: {
        ...tourConfig.tour,
        totalShows: enrichedShows.length
      },
      legs: tourConfig.legs,
      shows: enrichedShows.sort((a, b) => {
        // Sort by date descending (newest first)
        return parseSetlistDate(b.date).getTime() - parseSetlistDate(a.date).getTime();
      })
    };

    // Cache the data
    console.log('💾 Caching tour data...');
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      tourData
    }));

    console.log('✅ Tour data ready:', {
      shows: tourData.shows.length,
      legs: tourData.legs.length
    });

    return tourData;

  } catch (error) {
    console.error('❌ Error in getTourData:', error);

    // Try to return cached data as fallback
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      console.log('⚠️ Falling back to cached data due to error');
      try {
        const data = JSON.parse(cached);
        return data.tourData;
      } catch (parseError) {
        console.error('❌ Could not parse cached fallback data');
      }
    }

    throw error;
  }
}

/**
 * Get shows for a specific leg
 */
export function getShowsByLeg(tourData: TourData, legId: number): EnrichedShow[] {
  return tourData.shows.filter(show => show.legId === legId);
}

/**
 * Get cache info for debugging
 */
export function getCacheInfo(): { exists: boolean; age?: number; showCount?: number } {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) {
    return { exists: false };
  }

  try {
    const data = JSON.parse(cached);
    const age = Date.now() - data.timestamp;
    return {
      exists: true,
      age: Math.floor(age / 1000 / 60), // minutes
      showCount: data.tourData.shows.length
    };
  } catch {
    return { exists: false };
  }
}

/**
 * Clear cache
 */
export function clearTourCache(): void {
  localStorage.removeItem(CACHE_KEY);
  console.log('🗑️ Tour cache cleared');
}
