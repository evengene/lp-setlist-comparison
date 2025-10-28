import { useState, useEffect } from 'react';
import { Music, Loader2 } from 'lucide-react';

import { setlistService } from './services/setlistService.ts';
import { processSetlist, compareShows } from './utils/setlistUtils';
import { CacheStatus } from './components/CacheStatus';
import { ShowCard } from './components/ShowCard';

import type { Show, ComparisonStats } from './types/setlist';


function App() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedShow1, setSelectedShow1] = useState<string>('');
  const [selectedShow2, setSelectedShow2] = useState<string>('');
  const [comparisonStats, setComparisonStats] = useState<ComparisonStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

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
      <div className="bg-white border-b border-gray-200 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music className="w-8 h-8 text-red-500" />
            <h1 className="text-4xl font-bold text-white">Linkin Park Setlist Companion</h1>
          </div>
          <p className="text-gray-300 text-lg mb-8">
            Celebrating the artistry behind every setlist.
            <br/>
            Compare Linkin Park shows side-by-side and discover which songs made each night special.
          </p>

          {/* Tour Info Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md
              hover:shadow-xl hover:-translate-y-1 transition-all duration-300
              max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">From Zero World Tour 2024-2025</h2>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
              <div>
                <span className="font-medium text-gray-900">{shows.length}</span> shows loaded
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Show Selectors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select First Show</label>
            <select
              value={selectedShow1}
              onChange={(e) => setSelectedShow1(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
            >
              {shows.map((show) => (
                <option key={show.id} value={show.id}>
                  {show.name} - {show.date}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Second Show</label>
            <select
              value={selectedShow2}
              onChange={(e) => setSelectedShow2(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
            >
              {shows.map((show) => (
                <option key={show.id} value={show.id}>
                  {show.name} - {show.date}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        {comparisonStats && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600
              bg-clip-text text-transparent mb-1">
                  {comparisonStats.similarityPercent}%
                </div>
                <div className="text-sm text-gray-600">Setlist Similarity</div>
              </div>
              <div>
                <div className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-1">
                  {comparisonStats.sharedCount}
                </div>
                <div className="text-sm text-gray-600">Songs in Both Shows</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-rose-600 mb-1">
                  {comparisonStats.uniqueCount}
                </div>
                <div className="text-sm text-gray-600">Unique Songs Total</div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200">
          <CacheStatus onRefresh={handleRefresh} loading={refreshing} />
        </div>

        {/* Side-by-Side Setlists */}
        {show1 && show2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Show 1 */}
            <ShowCard show={show1} />

            {/* Show 2 */}
            <ShowCard show={show2} />
          </div>
        )}

        {/* Legend */}
        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-4">Color Guide</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 rounded flex items-center justify-center">
                <div className="w-6 h-6 bg-emerald-100 rounded"></div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Played in Both Shows</div>
                <div className="text-sm text-gray-600">Tour staples and shared songs</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-50 border border-rose-200 rounded flex items-center justify-center">
                <div className="w-6 h-6 bg-rose-100 rounded"></div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Unique to This Show</div>
                <div className="text-sm text-gray-600">Rotating songs and special moments</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-gray-300 text-center py-6 mt-16">
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
          {' '}— The live music wiki
        </p>
      </div>
    </div>
  );
}

export default App;
