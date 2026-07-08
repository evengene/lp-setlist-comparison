import React from 'react';
import type { SongStats } from "../utils/setlistStats.ts";

interface SongCardProps {
  song: SongStats;
  totalShows: number;
  onClick: (song: SongStats) => void;
}

// Rarity as ember intensity: common = solid, rare = faint.
const BADGE: Record<string, string> = {
  staple: 'bg-ember/25 text-ember-bright',
  rotation: 'bg-ember/10 text-ember-bright',
  rare: 'border border-ember/50 text-ember',
  'deep-cut': 'border border-line text-ash',
};

const SongCard: React.FC<SongCardProps> = ({ song, onClick }) => {
  return (
    <div
      onClick={() => onClick(song)}
      className="group flex cursor-pointer items-center gap-3 rounded-lg border border-line bg-ink-2 p-3 transition-colors hover:border-ash-2"
    >
      {song.coverUrl ? (
        <img
          src={song.coverUrl}
          alt=""
          aria-hidden="true"
          className="h-12 w-12 shrink-0 rounded object-cover grayscale transition-all group-hover:grayscale-0"
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-ink">
          <svg className="h-6 w-6 text-ash-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
          </svg>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-bone group-hover:text-white">{song.title}</h3>
        {song.album && song.year && (
          <p className="mt-0.5 truncate font-mono text-[10px] tracking-[0.04em] text-ash">
            {song.album} · {song.year}
          </p>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span
          className={`rounded-[3px] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.06em] ${
            BADGE[song.category] ?? 'border border-line text-ash'
          }`}
        >
          {song.category.replace('-', ' ')}
        </span>
        <span className="font-mono text-[10px] tracking-[0.04em] text-bone-dim">Played {song.timesPlayed}x</span>
      </div>
    </div>
  );
};

export default SongCard;
