import React from 'react';
import type { SongStats } from "../utils/setlistStats.ts";

interface SongCardProps {
  song: SongStats;
  totalShows: number;
  onClick: (song: SongStats) => void;
}

// Rarity as ember intensity: common = solid, rare = faint.
const BADGE: Record<string, string> = {
  staple: 'bg-ember text-ink',
  rotation: 'bg-ember/20 text-ember-bright',
  rare: 'border border-ember/50 text-ember',
  'deep-cut': 'border border-line text-ash',
};

const SongCard: React.FC<SongCardProps> = ({ song, onClick, totalShows }) => {
  return (
    <div
      onClick={() => onClick(song)}
      className="group cursor-pointer rounded-lg border border-line bg-ink-2 p-4 transition-colors hover:border-ash-2"
    >
      <div className="flex items-center gap-4">
        {song.coverUrl ? (
          <img
            src={song.coverUrl}
            alt={`${song.album} cover`}
            className="h-14 w-14 shrink-0 rounded object-cover grayscale transition-all group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded bg-ink">
            <svg className="h-7 w-7 text-ash-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
            </svg>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="font-body text-base font-semibold text-bone group-hover:text-white">{song.title}</h3>
          {song.album && song.year && (
            <p className="mt-0.5 font-mono text-[11px] tracking-[0.04em] text-ash">
              {song.album} · {song.year}
            </p>
          )}
          <div className="mt-2 flex items-center gap-4 font-mono text-[11px] tracking-[0.04em]">
            <span className="text-bone-dim">
              {song.timesPlayed}/{totalShows} SHOWS
            </span>
            {song.positionRange && <span className="text-ash">SLOT {song.positionRange}</span>}
          </div>
        </div>

        <div className="ml-2 shrink-0">
          <span
            className={`rounded-[3px] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] ${
              BADGE[song.category] ?? 'border border-line text-ash'
            }`}
          >
            {song.category.replace('-', ' ')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
