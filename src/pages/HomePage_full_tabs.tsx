import { useEffect, useMemo, useState } from 'react';
import { getTourData } from '../services/tourDataService';
import { calculateTourStats, type SongStats } from '../utils/setlistStats';
import SongCard from "../components/SongCard.tsx";
import HeaderWrapper from "../components/HeaderWrapper.tsx";
import { TourLeg } from "../components/TourLeg.tsx";
import { AudioLines } from "lucide-react";

export default function HomePage() {
  const tourData = getTourData();
  const [selectedLeg, setSelectedLeg] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedSong, setSelectedSong] = useState<SongStats | null>(null);

  // Add useEffect for ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedSong(null);
    };

    if (selectedSong) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [selectedSong]);

  // Filter shows by selected leg
  const filteredShows = selectedLeg === null
    ? tourData.shows
    : tourData.shows.filter(show => show.legId === selectedLeg);

  // Calculate stats from filtered shows
  const stats = calculateTourStats(filteredShows.map(s => s.setlist as any));


  // Determine songs to display based on an active filter
  const displayedSongs = useMemo(() => {
    if (!stats || !stats.allSongs) return [];

    switch (activeFilter) {
      case 'staples': return stats.staple || [];
      case 'rotation': return stats.rotation || [];
      case 'rare': return stats.rare || [];
      case 'deep-cut': return stats.deepCut || [];
      case 'predictions': return stats.overdue || [];
      default: return stats.allSongs || [];
    }
  }, [activeFilter, stats]);

  // DEBUG LOGS
  console.log('Selected Leg:', selectedLeg);
  console.log('Total Shows:', tourData.shows.length);
  console.log('Filtered Shows:', filteredShows.length);
  console.log('Stats:', stats);
  console.log('Displayed Songs:', displayedSongs.length);

  // Check a few shows to see their legId
  console.log('Sample shows:', tourData.shows.slice(0, 3).map(s => ({
    city: s.city,
    legId: s.legId,
    legIdType: typeof s.legId
  })));

  return (
    <div className="min-h-screen bg-white">

      <HeaderWrapper
        badge={"From Zero World Tour 2024-2026"}
        title={"Linkin Park Live Shows"}
        subtitle={"Explore the setlist history across all tour legs"}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Tour Legs - Visual Cards with B&W → Color */}
        <div className="mb-10">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">
            Select Tour Leg
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {/* All Legs */}
            <button
              onClick={() => setSelectedLeg(null)}
              className={`group relative aspect-square rounded-xl overflow-hidden transition-all ${
                selectedLeg === null
                  ? 'ring-4 ring-slate-600 shadow-lg'
                  : 'hover:ring-2 hover:ring-gray-300'
              }`}
            >
              <div className={`absolute inset-0 bg-linear-to-br from-slate-700 to-slate-900 ${
                selectedLeg === null ? '' : 'grayscale group-hover:grayscale-0'
              } transition-all`}>
                {/* Icon or pattern */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <AudioLines className="w-24 h-24 text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-linear-to-t from-black/80">
                <div className="text-white text-xs font-bold">All Legs</div>
              </div>
            </button>

            {/* Individual Legs */}
            {tourData.legs.map(leg => (
              <TourLeg
                key={leg.id}
                legId={leg.id}
                onClick={() => setSelectedLeg(leg.id)}
                selectedLeg= {selectedLeg}
                region={leg.region}
              />
            ))}
          </div>
        </div>

        {/* Rarity Filters - Match Badge Colors */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
        <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          Filter by Rarity:
        </span>
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeFilter === 'all'
                ? 'bg-slate-300 text-slate-700 ring-2 ring-slate-600'
                : 'bg-gray-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>

          <button
            onClick={() => setActiveFilter('staples')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeFilter === 'staples'
                ? 'bg-green-100 text-green-700 ring-2 ring-green-600'
                : 'bg-gray-100 text-gray-600 hover:bg-green-50'
            }`}
          >
            Staple
          </button>

          <button
            onClick={() => setActiveFilter('rotation')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeFilter === 'rotation'
                ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-600'
                : 'bg-gray-100 text-gray-600 hover:bg-yellow-50'
            }`}
          >
            Rotation
          </button>

          <button
            onClick={() => setActiveFilter('rare')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeFilter === 'rare'
                ? 'bg-orange-100 text-orange-700 ring-2 ring-orange-600'
                : 'bg-gray-100 text-gray-600 hover:bg-orange-50'
            }`}
          >
            Rare
          </button>

          <button
            onClick={() => setActiveFilter('deep-cut')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeFilter === 'deep-cut'
                ? 'bg-purple-100 text-slate-700 ring-2 ring-slate-600'
                : 'bg-gray-100 text-gray-600 hover:bg-purple-50'
            }`}
          >
            Deep Cut
          </button>

          {/*<button*/}
          {/*  onClick={() => setActiveFilter('predictions')}*/}
          {/*  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${*/}
          {/*    activeFilter === 'predictions'*/}
          {/*      ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-600'*/}
          {/*      : 'bg-gray-100 text-gray-600 hover:bg-blue-50'*/}
          {/*  }`}*/}
          {/*>*/}
          {/*  Predictions*/}
          {/*</button>*/}
        </div>

        {/* Result Count */}
        {displayedSongs.length > 0 && (
          <div className="mb-6">
            <div className="text-2xl font-bold text-slate-900">

              {'List of songs played on Linkin Park Live shows'}
            </div>
            <div className="text-sm text-slate-600 mt-1">
              {displayedSongs.length} songs played across {filteredShows.length} shows
              {selectedLeg && ` in Leg ${selectedLeg}`}
            </div>
          </div>
        )}

        {/* Songs List */}
        <div className="space-y-3">
          {displayedSongs.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No songs found
              </h3>
              <p className="text-sm text-gray-600">
                Try selecting a different filter or tour leg
              </p>
            </div>
          ) : (
            displayedSongs.map((song) => (
              <SongCard
                key={song.title}
                song={song}
                totalShows={filteredShows.length}
                onClick={() => setSelectedSong(song)}
              />
            ))
          )}
        </div>
      </div>

      <div className="pt-16 mt-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-2xl md:text-3xl text-gray-800 font-light italic">
            "Dream big, work hard, and don't be an a**hole." - Mike Shinoda
          </p>
        </div>
      </div>

      {/* Modal */}
      {selectedSong && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedSong(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl font-bold text-slate-900">
                {selectedSong.title}
              </h2>
              <button
                onClick={() => setSelectedSong(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <p className="text-gray-600">
              Timeline view coming soon!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
