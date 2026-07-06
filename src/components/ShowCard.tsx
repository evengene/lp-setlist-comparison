import { MapPin, Calendar, Users } from 'lucide-react';
import type { Show, ProcessedSong } from '../types/setlist';
import { getLinkinpediaUrl } from '../utils/setlistHelpers.ts';

interface ShowCardProps {
  show: Show;
}

export function ShowCard({ show }: ShowCardProps) {
  // Group songs by their set name
  const groupedSets = new Map<string, ProcessedSong[]>();
  show.setlist.songs.forEach((song) => {
    const setName = song.setName || 'Main Set';
    if (!groupedSets.has(setName)) groupedSets.set(setName, []);
    groupedSets.get(setName)!.push(song);
  });

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-ink-2">
      {/* Venue header */}
      <div className="border-b border-line bg-ink p-6">
        <h3 className="font-display text-xl uppercase leading-none text-bone">{show.name}</h3>
        <div className="mt-3 space-y-1.5 font-mono text-[11px] tracking-[0.04em] text-ash">
          <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-ash-2" /><span>{show.venue}</span></div>
          <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-ash-2" /><span>{show.date}</span></div>
          {show.capacity && (
            <div className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-ash-2" /><span>CAPACITY: {show.capacity}</span></div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.06em]">
          <a
            href={show.setlistUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-bone-dim transition-colors hover:border-ember hover:text-ember"
          >
            Setlist.fm <span>→</span>
          </a>
          <a
            href={getLinkinpediaUrl(show.rawDate)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-bone-dim transition-colors hover:border-ember hover:text-ember"
          >
            Linkinpedia <span>→</span>
          </a>
        </div>
      </div>

      {/* Setlist */}
      <div className="p-6">
        {Array.from(groupedSets.entries()).map(([setName, songs], setIdx) => (
          <div key={setIdx} className="mb-8 last:mb-0">
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-block rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-ash">
                {setName}
              </span>
              <span className="font-mono text-[10px] text-ash-2">
                {songs.length} {songs.length === 1 ? 'SONG' : 'SONGS'}
              </span>
            </div>

            <div className="space-y-2">
              {songs.map((song, idx) => {
                const shared = song.status === 'shared';
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 rounded-md p-3 transition-colors ${
                      shared ? 'border border-line bg-ink' : 'border border-ember/40 bg-ember/10'
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded font-mono text-[11px] font-semibold ${
                        shared ? 'bg-line text-ash' : 'bg-ember text-ink'
                      }`}
                    >
                      {song.position}
                    </div>
                    <div className="min-w-0 grow">
                      <div className={`font-medium ${shared ? 'text-bone-dim' : 'text-bone'}`}>{song.name}</div>
                      {song.info && <div className="mt-0.5 text-xs italic text-ash">{song.info}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="mt-6 flex items-center justify-between border-t border-line pt-4 font-mono text-[11px] tracking-[0.04em]">
          <span className="text-ash">
            <span className="text-ember">{show.setlist.uniqueCount}</span> UNIQUE{' '}
            {show.setlist.uniqueCount === 1 ? 'SONG' : 'SONGS'}
          </span>
          <span className="text-ash-2">{show.setlist.totalSongs} TOTAL</span>
        </div>
      </div>
    </div>
  );
}
