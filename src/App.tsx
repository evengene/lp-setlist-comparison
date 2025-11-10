import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

import { setlistService } from './services/setlistService.ts';
import { processSetlist, compareShows } from './utils/setlistUtils';
import { CacheStatus } from './components/CacheStatus';
import { ShowCard } from './components/ShowCard';
import { ShareButton } from "./components/ShareButton.tsx";


import type { Show, ComparisonStats } from './types/setlist';


function App() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedShow1, setSelectedShow1] = useState<string>('');
  const [selectedShow2, setSelectedShow2] = useState<string>('');
  const [comparisonStats, setComparisonStats] = useState<ComparisonStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);


// Update url when on different shows selection
  const updateURL = (show1Id: string, show2Id: string) => {
    const newUrl = `${window.location.pathname}?show1=${show1Id}&show2=${show2Id}`;
    window.history.pushState({}, '', newUrl);
  };

  useEffect(() => {
    if (selectedShow1 && selectedShow2) {
      updateURL(selectedShow1, selectedShow2);
    }
  }, [selectedShow1, selectedShow2]);


  // Check url params for current show
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log('URL Params:', {
      show1: urlParams.get('show1'),
      show2: urlParams.get('show2'),
      fullURL: window.location.href
    });

  }, []);

  // Fetch Linkin Park setlists on mount
  useEffect(() => {
    const fetchSetlists = async () => {
      try {
        setLoading(true);
        const response = await setlistService.getLinkinParkSetlists(1);

        // Filter for "From Zero World Tour" only
        const fromZeroTour = response.setlist.filter(setlist =>
          setlist.tour?.name === 'From Zero World Tour'
        );

        const processedShows = fromZeroTour.map(processSetlist);

        // Filter shows that have songs
        const showsWithSetlists = processedShows.filter(show =>
          show.setlist.totalSongs > 0
        );

        setShows(showsWithSetlists);

        // Default to the first two shows from the setlists
        if (showsWithSetlists.length >= 2) {
          setSelectedShow1(showsWithSetlists[1].id);
          setSelectedShow2(showsWithSetlists[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch setlists');
      } finally {
        setLoading(false);
      }
    };

    fetchSetlists();
  }, []);

  // Update comparison when shows change
  useEffect(() => {
    if (selectedShow1 && selectedShow2) {
      const show1 = shows.find(s => s.id === selectedShow1);
      const show2 = shows.find(s => s.id === selectedShow2);

      if (show1 && show2) {
        const comparison = compareShows(show1, show2);
        setComparisonStats(comparison.stats);
      }
    }
  }, [selectedShow1, selectedShow2, shows]);

  const getShow = (showId: string) => shows.find(s => s.id === showId);
  const show1 = getShow(selectedShow1);
  const show2 = getShow(selectedShow2);
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Force refresh = ignore cache
      const response = await setlistService.getLinkinParkSetlists(1, true);
      const processedShows = response.setlist.map(processSetlist);
      setShows(processedShows);

      // Re-select the same shows if they still exist
      if (selectedShow1 && selectedShow2) {
        const comparison = compareShows(
          processedShows.find(s => s.id === selectedShow1)!,
          processedShows.find(s => s.id === selectedShow2)!
        );
        setComparisonStats(comparison.stats);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh');
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gray-900" />
          <p className="text-gray-600">Loading setlists from Setlist.fm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Make sure you've added your Setlist.fm API key to the .env file as VITE_SETLISTFM_API_KEY
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 px-8 pt-20 pb-24 text-center">
        {/* Purple radial gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.15) 0%, transparent 60%)'
          }}
        />

        <div className="relative z-10">

          {/*add a png image from public folder */}

          <img src="/linkin-park-logo.png" alt="Linkin Park Logo" className="w-12 h-12 mx-auto mb-6" />


          <h1 className="mb-4 text-6xl font-extrabold tracking-tight text-white">
            LP Setlist Comparison
          </h1>
          <p className="mx-auto max-w-2xl text-xl font-normal text-white/70">
            Celebrating the artistry behind every live performance. Compare Linkin Park shows side-by-side and discover which songs made each night special.
          </p>
          <div className="inline-block bg-purple-500/15 text-purple-200 px-5 py-2 rounded-full text-sm font-semibold mt-6">
            From Zero World Tour 2024-2025
          </div>
        </div>
      </header>

      {/* Main Container - with negative margin */}
      <div
        className="relative z-10 mx-auto max-w-7xl px-8 pb-16"
        style={{ marginTop: '-3rem' }}
      >
        {/* Show Selectors */}
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* First Show */}
          <div className="relative rounded-[20px] bg-white p-10 shadow-lg">
            <label className="mb-6 block text-xs font-bold uppercase tracking-widest text-slate-500">
              First Show
            </label>

            <div className="relative">
              <select
                value={selectedShow1}
                onChange={(e) => setSelectedShow1(e.target.value)}
                className="mb-1 w-full appearance-none rounded-xl border-0 bg-slate-100 px-6 py-5 pr-14 text-lg font-semibold text-slate-900 transition-all hover:bg-slate-200 focus:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                {shows.map((show) => (
                  <option key={show.id} value={show.id}>
                    {show.name} - {show.date}
                  </option>
                ))}
              </select>

              <div className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2">
                <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {show1 && (
              <div className="mt-2 text-[15px] font-medium text-slate-500">
                {show1.venue}
              </div>
            )}
          </div>

          {/* Second Show */}
          <div className="relative rounded-[20px] bg-white p-10 shadow-lg">
            <label className="mb-6 block text-xs font-bold uppercase tracking-widest text-slate-500">
              Second Show
            </label>

            <div className="relative">
              <select
                value={selectedShow2}
                onChange={(e) => setSelectedShow2(e.target.value)}
                className="mb-1 w-full appearance-none rounded-xl border-0 bg-slate-100 px-6 py-5 pr-14 text-lg font-semibold text-slate-900 transition-all hover:bg-slate-200 focus:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                {shows.map((show) => (
                  <option key={show.id} value={show.id}>
                    {show.name} - {show.date}
                  </option>
                ))}
              </select>

              <div className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2">
                <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {show2 && (
              <div className="mt-2 text-[15px] font-medium text-slate-500">
                {show2.venue}
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        {comparisonStats && (
          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Similarity */}
            <div className="rounded-[20px] bg-white px-8 py-12 text-center shadow-lg transition-transform hover:-translate-y-1">
              <div className="mb-3 text-6xl font-extrabold leading-none tracking-tight text-gray-700">
                {comparisonStats.similarityPercent}%
              </div>
              <div className="text-[15px] font-semibold text-slate-500">
                Setlist Similarity
              </div>
            </div>

            {/* Shared Songs */}
            <div className="rounded-[20px] bg-white px-8 py-12 text-center shadow-lg transition-transform hover:-translate-y-1">
              <div className="mb-3 text-6xl font-extrabold leading-none tracking-tight text-gray-700">
                {comparisonStats.sharedCount}
              </div>
              <div className="text-[15px] font-semibold text-slate-500">
                Songs in Both Shows
              </div>
            </div>

            {/* Unique Songs */}
            <div className="rounded-[20px] bg-white px-8 py-12 text-center shadow-lg transition-transform hover:-translate-y-1">
              <div className="mb-3 text-6xl font-extrabold leading-none tracking-tight text-gray-700">
                {comparisonStats.uniqueCount}
              </div>
              <div className="text-[15px] font-semibold text-slate-500">
                Unique Songs Total
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 pt-4">
          <CacheStatus onRefresh={handleRefresh} loading={refreshing} />
        </div>

        {show1 && show2 && (
            <>
              {/* Downloadable Comparison Container */}
              <div
                  id="comparison-container"
                  className="p-6 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
                  }}
              >
                {/* Header for Downloaded Image */}
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Linkin Park Setlist Comparison
                  </h2>
                  <p className="text-sm text-gray-600">From Zero World Tour</p>
                </div>

                {/* The Comparison Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ShowCard show={show1} />
                  <ShowCard show={show2} />
                </div>

                {/* Footer for Downloaded Image */}
                <div className="mt-6 text-center text-sm text-gray-500">
                  lpsetlists.com
                </div>
              </div>

              {/* Share Button (outside the download container) */}
              <div className="mt-8 text-center">
                <ShareButton show1={show1} show2={show2} />
              </div>
            </>
        )}


        {/* Legend */}
        <div className="rounded-[20px] bg-white mt-12 p-10 shadow-lg">
          <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-500">
            Color Guide
          </h4>
          <div className="flex flex-wrap gap-12">
            {/* Shared Songs */}
            <div className="flex min-w-[250px] flex-1 items-center gap-4">
              <div
                className="h-12 w-12 flex-shrink-0 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
                }}
              />
              <div>
                <div className="mb-1 text-base font-bold text-slate-900">
                  Played in Both Shows
                </div>
                <div className="text-sm text-slate-500">
                  Tour staples and shared songs
                </div>
              </div>
            </div>

            {/* Unique Songs */}
            <div className="flex min-w-[250px] flex-1 items-center gap-4">
              <div
                className="h-12 w-12 flex-shrink-0 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)'
                }}
              />
              <div>
                <div className="mb-1 text-base font-bold text-slate-900">
                  Unique to This Show
                </div>
                <div className="text-sm text-slate-500">
                  Rotating songs and special moments
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-gray-600 text-center py-6 mt-8">
        <p className="text-sm mb-2">
          Celebrating the artistry of Linkin Park's live performances.
        </p>
        <p className="text-sm">
          Setlist data provided by{' '}
          <a
            href="https://www.setlist.fm/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            setlist.fm
          </a>
          • For fans made with ❤️ by <a href={"https://github.com/evengene"} className="text-blue-400 hover:text-blue-300 underline">evengene</a>
        </p>
      </div>
    </div>
  );
}

export default App;
