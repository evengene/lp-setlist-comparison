export const LINKIN_PARK_MBID = 'f59c5520-5f46-4d2c-b2c4-822eabf53419';
export const CACHE_DURATION_HOURS = 24;
export const CACHE_KEY = 'lp-setlists-cache';
export const API_ROUTES = {
  linkinParkSetlists: `/artist/${LINKIN_PARK_MBID}/setlists`,

  // searchArtists: '/search/artists',
  // artistSetlists: (mbid: string) => `/artist/${mbid}/setlists`,
} as const;

export const API_BASE_URL = import.meta.env.DEV
  ? '/api/rest/1.0'  // Development: use Vite proxy
  : '/api/setlistfm';  // Production: use Vercel serverless function
