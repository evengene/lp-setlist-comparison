import React from 'react';
import type { SongStats } from "../utils/setlistStats.ts";

interface SongCardProps {
  song: SongStats;
  totalShows: number;
  onClick: (song: SongStats) => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, onClick, totalShows }) => {

  return (
    <div
      key={song.title}
      onClick={
        () => onClick(song)
      }
      className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-900
                         transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        {/* Album Cover or Placeholder */}
        {song.coverUrl ? (
          <img
            src={song.coverUrl}
            alt={`${song.album} cover`}
            className="w-14 h-14 rounded object-cover shrink-0 shadow-sm"
          />
        ) : (
          <div className="w-14 h-14 bg-gray-100 rounded flex items-center justify-center shrink-0">
            <svg className="w-7 h-7 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
            </svg>
          </div>
        )}
        {/* Left: Song Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-gray-700">
            {song.title}
          </h3>
          {song.album && song.album &&
          <p className="text-sm text-gray-500 mb-2">
            {song.album} • {song.year}
          </p>
          }
          <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-700 font-medium">
                        {song.timesPlayed}/{totalShows} shows played
                      </span>
            {song.positionRange && (
              <span className="text-gray-500">
                          {song.positionRange} typical position
                        </span>
            )}
          </div>
        </div>

        {/* Right: Badge */}
        <div className="ml-4 shrink-0">
          {song.category === 'staple' && (
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 ">
                        Staple
                      </span>
          )}
          {song.category === 'rotation' && (
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">
                        Rotation
                      </span>
          )}
          {song.category === 'rare' && (
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-700">
                        Rare
                      </span>
          )}
          {song.category === 'deep-cut' && (
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
                        Deep Cut
                      </span>
          )}
        </div>
      </div>
    </div>

  );
};

export default SongCard;
