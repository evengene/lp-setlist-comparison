import { useState } from 'react';
import { getTourData } from '../services/tourDataService';
import { calculateTourStats } from '../utils/setlistStats';
import SongCard from "../components/SongCard.tsx";

const FILTER_OPTIONS = [
  { id: 'staples', label: 'Core Playlist' },
  { id: 'rotation', label: 'Rotation' },
  { id: 'rare', label: 'Rare' },
  { id: 'deep-cut', label: 'Deep Cuts' },
  { id: 'predictions', label: 'Predictions' },
];

export default function HomePage() {
  const tourData = getTourData();
  const [selectedLeg, setSelectedLeg] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState('staples');
  const [selectedSong, setSelectedSong] = useState<any>(null);

  // Filter shows by selected leg
  const filteredShows = selectedLeg === null
    ? tourData.shows
    : tourData.shows.filter(show => show.legId === selectedLeg);

  // Calculate stats from filtered shows
  const stats = calculateTourStats(filteredShows.map(s => s.setlist));

  // Filter songs by active filter
  const getFilteredSongs = () => {
    if (!stats || !stats.allSongs) return [];

    switch (activeFilter) {
      case 'staples':
        return stats.staple || [];
      case 'rotation':
        return stats.rotation || [];
      case 'rare':
        return stats.rare || [];
      case 'deep-cut':
        return stats.deepCut || [];
      case 'predictions':
        // For predictions, return rare and deep cuts sorted by times played
        return [...(stats.rare || []), ...(stats.deepCut || [])]
          .sort((a, b) => b.timesPlayed - a.timesPlayed);
      default:
        return stats.allSongs || [];
    }
  };

  const displayedSongs = getFilteredSongs();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Linkin Park Song Tracker
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Select a tour leg and filter songs to explore song rarity.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Leg Selector */}
        <div className="mb-10">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tour Leg
          </label>
          <select
            value={selectedLeg === null ? 'all' : selectedLeg}
            onChange={(e) => setSelectedLeg(e.target.value === 'all' ? null : Number(e.target.value))}
            className="w-full px-5 py-3.5 border border-gray-200 rounded-xl bg-white text-gray-900
                     hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-900
                     focus:border-transparent transition-colors
                     text-base font-medium"
          >
            <option value="all">All Legs</option>
            {tourData.legs.map(leg => (
              <option key={leg.id} value={leg.id}>
                Leg {leg.id}: {leg.region}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Buttons */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {FILTER_OPTIONS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-colors cursor-pointer border-2 ${
                  activeFilter === filter.id
                    ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-900'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Songs List */}
        <div className="space-y-3">
          {displayedSongs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No songs found
                </h3>
                <p className="text-sm text-gray-500">
                  Try selecting a different filter or tour leg
                </p>
              </div>
            </div>
          ) : (
            displayedSongs.map((song) => (
              <SongCard
                key={song.title}
                song={song}
                totalShows={stats.totalShows}
                filteredShows={filteredShows}
                onClick={() => setSelectedSong(song)}
              />
            ))
          )}
        </div>
      </div>

      {/* Song Detail Modal - Placeholder for Task 3 */}
      {selectedSong && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedSong(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                {selectedSong.title}
              </h2>
              <button
                onClick={() => setSelectedSong(null)}
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
              >
                ×
              </button>
            </div>
            <p className="text-gray-600">
              Timeline view coming in Task 3!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
