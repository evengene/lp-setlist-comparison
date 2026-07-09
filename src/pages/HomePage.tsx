import { useEffect, useMemo, useState } from 'react';
import { getTourData } from '../services/tourDataService';
import { calculateTourStats, type SongStats } from '../utils/setlistStats';
import SongCard from "../components/SongCard.tsx";
import { TourHero } from "../components/TourHero.tsx";
import { HomeHeatmap } from "../components/HomeHeatmap.tsx";
import { TourLeg } from "../components/TourLeg.tsx";
import { SongDetail } from "../components/SongDetail.tsx";
import { AudioLines } from "lucide-react";

const SORTS = [
  { key: 'plays', label: 'Most played' },
  { key: 'az', label: 'A-Z' },
  { key: 'rare', label: 'Rarest' },
];

const RARITY_RANK: Record<string, number> = { staple: 3, rotation: 2, rare: 1, 'deep-cut': 0, prediction: 0 };

export default function HomePage() {
  const tourData = getTourData();
  const [selectedLeg, setSelectedLeg] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('plays');
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

  const displayedSongs = useMemo(() => stats?.allSongs ?? [], [stats]);

  const sortedSongs = useMemo(() => {
    const arr = [...displayedSongs];
    if (sortBy === 'az') return arr.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === 'rare') {
      return arr.sort(
        (a, b) => (RARITY_RANK[a.category] ?? 0) - (RARITY_RANK[b.category] ?? 0) || a.timesPlayed - b.timesPlayed,
      );
    }
    return arr.sort((a, b) => b.timesPlayed - a.timesPlayed);
  }, [displayedSongs, sortBy]);

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
                <div className="font-mono text-[11px] uppercase tracking-widest text-bone">All Legs</div>
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

        {/* Songs */}
        {displayedSongs.length > 0 && (
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h3 className="font-display text-3xl uppercase leading-none text-bone">Songs played</h3>
              <p className="mt-2 font-mono text-[11px] tracking-[0.08em] text-ash">
                {displayedSongs.length} SONGS · {filteredShows.length} SHOWS
                {selectedLeg ? ` · LEG ${selectedLeg}` : ''}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 font-mono text-[11px] tracking-[0.14em] text-ash">SORT</span>
              {SORTS.map((s) => {
                const active = sortBy === s.key;
                return (
                  <button
                    key={s.key}
                    onClick={() => setSortBy(s.key)}
                    className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors ${
                      active ? 'bg-ember text-ink' : 'border border-line text-ash hover:border-ash-2 hover:text-bone'
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {displayedSongs.length === 0 ? (
          <div className="rounded-lg border border-line bg-ink-2 p-12 text-center">
            <h3 className="mb-2 font-body text-lg font-semibold text-bone">No songs found</h3>
            <p className="font-mono text-[11px] tracking-[0.08em] text-ash">TRY A DIFFERENT FILTER OR LEG</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {sortedSongs.map((song) => (
              <SongCard
                key={song.title}
                song={song}
                totalShows={filteredShows.length}
                onClick={() => setSelectedSong(song)}
              />
            ))}
          </div>
        )}
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
