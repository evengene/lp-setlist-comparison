import React, { useState, useMemo, useEffect } from 'react';
import { useLPSongData } from '../hooks/useLPSongData.ts';
import { getTourData } from '../services/tourDataService';
import { calculateTourStats, type SongStats } from '../utils/setlistStats';
import { SongDetail } from '../components/SongDetail.tsx';

export const LPSongs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'album' | 'alphabetical'>('album');
  const [selectedSong, setSelectedSong] = useState<SongStats | null>(null);

  const { albumsWithSongs } = useLPSongData();

  // Tour-play data, keyed by song title
  const statByTitle = useMemo(() => {
    const data = getTourData();
    const stats = calculateTourStats(data.shows.map((s) => s.setlist as never));
    const map = new Map<string, SongStats>();
    (stats.allSongs ?? []).forEach((s) => map.set(s.title, s));
    return map;
  }, []);

  // Close the deep-dive on Escape
  useEffect(() => {
    if (!selectedSong) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelectedSong(null);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [selectedSong]);

  const filteredDiscography = useMemo(() => {
    if (!searchQuery) return albumsWithSongs;
    const q = searchQuery.toLowerCase();
    return albumsWithSongs
      .map((album) => ({
        ...album,
        songs: album.songs.filter(
          (song) => song.title.toLowerCase().includes(q) || song.abbreviation.toLowerCase().includes(q),
        ),
      }))
      .filter((album) => album.songs.length > 0);
  }, [searchQuery, albumsWithSongs]);

  const alphabeticalSongs = useMemo(() => {
    const all = albumsWithSongs.flatMap((album) =>
      album.songs.map((song) => ({ ...song, album: album.name, year: album.year })),
    );
    const q = searchQuery.toLowerCase();
    const filtered = searchQuery
      ? all.filter((s) => s.title.toLowerCase().includes(q) || s.abbreviation.toLowerCase().includes(q))
      : all;
    return filtered.sort((a, b) => a.title.localeCompare(b.title));
  }, [albumsWithSongs, searchQuery]);

  const totalSongs = albumsWithSongs.reduce((sum, a) => sum + a.songs.length, 0);
  const totalPlayed = albumsWithSongs.reduce(
    (sum, a) => sum + a.songs.filter((s) => statByTitle.has(s.title)).length,
    0,
  );
  const resultCount =
    viewMode === 'album'
      ? filteredDiscography.reduce((sum, album) => sum + album.songs.length, 0)
      : alphabeticalSongs.length;

  const Abbr = ({ text }: { text: string }) => (
    <span className="inline-flex items-center rounded-[3px] border border-line px-2 py-0.5 font-mono text-[10px] tracking-[0.04em] text-ash">
      {text}
    </span>
  );

  const PlayBadge = ({ stat }: { stat: SongStats }) => (
    <span className="shrink-0 font-mono text-[10px] tracking-[0.04em] text-ember">{stat.timesPlayed}×</span>
  );

  return (
    <div className="min-h-screen bg-ink font-body text-bone">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-grain opacity-[0.13] mix-blend-overlay" />
        <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-12">
          <p className="font-mono text-[11px] tracking-[0.22em] text-ash">
            <span className="text-ember">→</span>&nbsp;&nbsp;FROM ZERO WORLD TOUR · SONGS
          </p>
          <h1 className="mt-4 font-display text-5xl uppercase leading-[0.9] text-bone sm:text-7xl">The Songbook</h1>
          <p className="mt-4 max-w-xl font-body italic text-bone-dim">
            Every Linkin Park song and its abbreviation - tap any of the {totalPlayed} played on tour for a deep-dive.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Controls */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <input
            type="text"
            className="h-11 flex-1 rounded-md border border-line bg-ink-2 px-4 text-sm text-bone placeholder-ash transition-colors focus:border-ember focus:outline-none"
            placeholder="Search by song title or abbreviation…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex rounded-md border border-line p-1">
            {(['album', 'alphabetical'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`rounded px-4 py-2 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors ${
                  viewMode === mode ? 'bg-ember text-ink' : 'text-ash hover:text-bone'
                }`}
              >
                {mode === 'album' ? 'By Album' : 'A-Z'}
              </button>
            ))}
          </div>
        </div>

        {searchQuery && (
          <p className="mb-6 font-mono text-[11px] tracking-[0.06em] text-ash">
            {resultCount} SONG{resultCount !== 1 ? 'S' : ''} FOUND
          </p>
        )}

        {/* Album view */}
        {viewMode === 'album' ? (
          filteredDiscography.length > 0 ? (
            <div className="space-y-10">
              {filteredDiscography.map((album) => {
                const played = album.songs.filter((s) => statByTitle.has(s.title)).length;
                return (
                  <div key={album.name} className="space-y-4">
                    <div className="flex items-center gap-5 rounded-lg border border-line bg-ink-2 p-5">
                      {album.coverUrl ? (
                        <img
                          src={album.coverUrl}
                          alt={`${album.name} cover`}
                          className="h-20 w-20 shrink-0 rounded object-cover grayscale"
                        />
                      ) : (
                        <div className="h-20 w-20 shrink-0 rounded bg-ink" />
                      )}
                      <div className="min-w-0">
                        <h2 className="font-display text-2xl uppercase leading-none text-bone">{album.name}</h2>
                        <p className="mt-2 font-mono text-[11px] tracking-[0.06em] text-ash">
                          {album.year} · {album.songs.length} TRACKS
                          {played > 0 && <span className="text-ember"> · {played} ON TOUR</span>}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {album.songs.map((song) => {
                        const stat = statByTitle.get(song.title);
                        return (
                          <div
                            key={song.title}
                            onClick={stat ? () => setSelectedSong(stat) : undefined}
                            role={stat ? 'button' : undefined}
                            className={`rounded-lg border p-4 transition-colors ${
                              stat
                                ? 'cursor-pointer border-line bg-ink-2 hover:border-ash-2'
                                : 'border-line/60 bg-ink opacity-60'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="truncate text-sm font-semibold text-bone">{song.title}</h3>
                              {stat && <PlayBadge stat={stat} />}
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <Abbr text={song.abbreviation} />
                              {!stat && (
                                <span className="font-mono text-[9px] tracking-[0.06em] text-ash-2">NOT ON TOUR</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-line bg-ink-2 p-12 text-center">
              <h3 className="mb-2 font-body text-lg font-semibold text-bone">No songs found</h3>
              <p className="font-mono text-[11px] tracking-[0.06em] text-ash">NOTHING MATCHES "{searchQuery.toUpperCase()}"</p>
            </div>
          )
        ) : (
          /* Alphabetical view */
          <div className="flex flex-col gap-2">
            {alphabeticalSongs.map((song) => {
              const stat = statByTitle.get(song.title);
              return (
                <div
                  key={`${song.title}-${song.album}`}
                  onClick={stat ? () => setSelectedSong(stat) : undefined}
                  role={stat ? 'button' : undefined}
                  className={`flex items-center gap-4 rounded-lg border p-4 transition-colors ${
                    stat ? 'cursor-pointer border-line bg-ink-2 hover:border-ash-2' : 'border-line/60 bg-ink opacity-60'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-bone">{song.title}</h3>
                    <p className="mt-0.5 font-mono text-[11px] tracking-[0.04em] text-ash">
                      {song.album} · {song.year}
                    </p>
                  </div>
                  <Abbr text={song.abbreviation} />
                  {stat && <PlayBadge stat={stat} />}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer summary */}
        <div className="mt-12 border-t border-line pt-8 text-center font-mono text-[11px] tracking-[0.06em] text-ash">
          {albumsWithSongs.length} ALBUMS · {totalSongs} SONGS · <span className="text-ember">{totalPlayed} PLAYED ON THE TOUR</span>
        </div>
      </div>

      {/* Deep-dive modal */}
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
};

export default LPSongs;
