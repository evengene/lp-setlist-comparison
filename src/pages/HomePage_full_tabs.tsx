import { useEffect, useMemo, useState } from 'react';
import { getTourData } from '../services/tourDataService';
import { calculateTourStats, type SongStats } from '../utils/setlistStats';
import SongCard from "../components/SongCard.tsx";
import { TourHero } from "../components/TourHero.tsx";
import { HomeHeatmap } from "../components/HomeHeatmap.tsx";
import { TourLeg } from "../components/TourLeg.tsx";
import { SongDetail } from "../components/SongDetail.tsx";
import { AudioLines } from "lucide-react";

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'staples', label: 'Staple' },
  { key: 'rotation', label: 'Rotation' },
  { key: 'rare', label: 'Rare' },
  { key: 'deep-cut', label: 'Deep Cut' },
];

export default function HomePage() {
  const tourData = getTourData();
  const [selectedLeg, setSelectedLeg] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedSong, setSelectedSong] = useState<SongStats | null>(null);

  // Close the modal on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedSong(null);
    };
    if (selectedSong) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [selectedSong]);

  const filteredShows = selectedLeg === null
    ? tourData.shows
    : tourData.shows.filter(show => show.legId === selectedLeg);

  const stats = calculateTourStats(filteredShows.map(s => s.setlist as any));

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

  return (
    <div className="min-h-screen bg-ink font-body text-bone">
      <TourHero />
      <HomeHeatmap sort="variation" heading="HOW THE SETLIST CHANGED" />

      {/* Explorer */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Leg selector */}
        <div className="mb-12">
          <h2 className="mb-5 font-mono text-[11px] tracking-[0.14em] text-ash">
            <span className="text-ember">03.</span>&nbsp;&nbsp;BROWSE BY LEG
          </h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {/* All Legs */}
            <button
              onClick={() => setSelectedLeg(null)}
              className={`group relative aspect-square overflow-hidden rounded-sm transition-all ${
                selectedLeg === null ? 'ring-2 ring-ember' : 'ring-1 ring-line hover:ring-ash-2'
              }`}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-ink-2">
                <AudioLines className={`h-20 w-20 ${selectedLeg === null ? 'text-ember' : 'text-ash-2'}`} />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-2">
                <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-bone">All Legs</div>
              </div>
            </button>

            {tourData.legs.map(leg => (
              <TourLeg
                key={leg.id}
                legId={leg.id}
                onClick={() => setSelectedLeg(leg.id)}
                selectedLeg={selectedLeg}
                region={leg.region}
              />
            ))}
          </div>
        </div>

        {/* Rarity filters */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span className="mr-2 font-mono text-[11px] tracking-[0.14em] text-ash">FILTER BY RARITY</span>
          {FILTERS.map(f => {
            const active = activeFilter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors ${
                  active
                    ? 'bg-ember text-ink'
                    : 'border border-line text-ash hover:border-ash-2 hover:text-bone'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Songs */}
        {displayedSongs.length > 0 && (
          <div className="mb-6">
            <h3 className="font-display text-3xl uppercase leading-none text-bone">Songs played</h3>
            <p className="mt-2 font-mono text-[11px] tracking-[0.08em] text-ash">
              {displayedSongs.length} SONGS · {filteredShows.length} SHOWS
              {selectedLeg ? ` · LEG ${selectedLeg}` : ''}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {displayedSongs.length === 0 ? (
            <div className="rounded-lg border border-line bg-ink-2 p-12 text-center">
              <h3 className="mb-2 font-body text-lg font-semibold text-bone">No songs found</h3>
              <p className="font-mono text-[11px] tracking-[0.08em] text-ash">TRY A DIFFERENT FILTER OR LEG</p>
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

      {/* Quote */}
      <div className="border-t border-line py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="font-body text-2xl italic text-bone-dim md:text-3xl">
            "Dream big, work hard, and don't be an a**hole."{' '}
            <span className="text-ash">— Mike Shinoda</span>
          </p>
        </div>
      </div>

      {/* Modal */}
      {selectedSong && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedSong(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-line bg-ink-2 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedSong(null)}
              className="absolute right-4 top-4 z-10 text-2xl leading-none text-ash transition-colors hover:text-bone"
              aria-label="Close"
            >
              ×
            </button>
            <SongDetail song={selectedSong} />
          </div>
        </div>
      )}
    </div>
  );
}
