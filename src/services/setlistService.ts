import type {
  SetlistResponse, Setlist } from '../types/setlist';
import { API_ROUTES, CACHE_DURATION_HOURS, CACHE_KEY, API_BASE_URL } from "../constants/shared.ts";

interface CacheData {
  data: SetlistResponse;
  timestamp: number;
  page: number;
}

export class SetlistFMService {

  /* Check if cache is still valid */
  private isCacheValid(cached: CacheData): boolean {
    const ageInHours = (Date.now() - cached.timestamp) / (1000 * 60 * 60);
    return ageInHours < CACHE_DURATION_HOURS;
  }

  /* Get cached data from localStorage */
  private getCache(): CacheData | null {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error('Error reading cache:', error);
    }
    return null;
  }

  /* Save data to localStorage cache */

  private setCache(data: SetlistResponse, page: number): void {
    try {
      const cacheData: CacheData = {
        data,
        timestamp: Date.now(),
        page,
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      console.log('Cached setlist data (valid for 24 hours)');
    } catch (error) {
      console.error('Error saving cache:', error);
    }
  }

  /* Clear the cache  */
  public clearCache(): void {
    localStorage.removeItem(CACHE_KEY);
    console.log('Cache cleared');
  }

  /* Get cache info for debugging */
  public getCacheInfo(): { exists: boolean; age?: string; valid?: boolean } {
    const cached = this.getCache();

    if (!cached) {
      return { exists: false };
    }

    const ageInHours = (Date.now() - cached.timestamp) / (1000 * 60 * 60);
    const valid = this.isCacheValid(cached);

    return {
      exists: true,
      age: `${ageInHours.toFixed(1)} hours ago`,
      valid,
    };
  }

  private async fetchAPI(endpoint: string): Promise<any> {
    const headers: HeadersInit = {
      'Accept': 'application/json',
      'x-api-key': import.meta.env.VITE_SETLISTFM_API_KEY
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`Setlist.fm API error: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get setlists for Linkin Park (with caching)
   * @param page Page number (default: 1)
   * @param forceRefresh Force API call even if cache is valid
   */
  async getLinkinParkSetlists(
    page: number = 1,
    forceRefresh: boolean = false
  ): Promise<SetlistResponse> {
    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = this.getCache();

      if (cached && cached.page === page && this.isCacheValid(cached)) {
        console.log('Using cached data');
        return cached.data;
      }
    }

    // Fetch fresh data from API
    console.log('Fetching from Setlist.fm API...');
    const data = await this.fetchAPI(`${API_ROUTES.linkinParkSetlists}?p=${page}`);

    // Cache the response
    this.setCache(data, page);

    return data;
  }

  /**
   * Get a specific setlist by ID
   * @param setlistId The setlist ID
   */
  async getSetlistById(setlistId: string): Promise<Setlist> {
    return this.fetchAPI(`/setlist/${setlistId}`);
  }

  /**
   * Search for setlists
   * @param params Search parameters
   */
  async searchSetlists(params: {
    artistName?: string;
    artistMbid?: string;
    year?: number;
    date?: string;
    cityName?: string;
    countryCode?: string;
    venueId?: string;
    tourName?: string;
    p?: number;
  }): Promise<SetlistResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.fetchAPI(`/search/setlists?${queryParams.toString()}`);
  }
}

export const setlistService = new SetlistFMService();
