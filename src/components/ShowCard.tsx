import { MapPin, Calendar, Users } from 'lucide-react';
import type { Show, ProcessedSong } from '../types/setlist';
import { getLinkinpediaUrl } from '../utils/setlistHelpers.ts';

interface ShowCardProps {
  show: Show;
}

export function ShowCard( { show }: ShowCardProps ) {
  // Group songs by their set name
  const groupedSets = new Map<string, ProcessedSong[]>();

  show.setlist.songs.forEach(( song ) => {
    const setName = song.setName || 'Main Set';
    if (!groupedSets.has(setName)) {
      groupedSets.set(setName, []);
    }
    groupedSets.get(setName)!.push(song);
  });

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Venue Header */}
      <div className="border-b border-gray-100 p-6 bg-gray-50">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{show.name}</h3>
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{show.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{show.date}</span>
          </div>
          {show.capacity && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span>Capacity: {show.capacity}</span>
            </div>
          )}
        </div>

        {/* External Links */}
        <div className="flex flex-wrap gap-2 text-xs">

          <a
            href={show.setlistUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white text-blue-600 hover:bg-blue-50 rounded-full border border-gray-200 transition-all shadow-sm hover:shadow"
          >
            <span>View on Setlist.fm</span>
            <span className="text-[10px]">→</span>
          </a>

          <a
            href={getLinkinpediaUrl(show.rawDate)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white text-purple-600 hover:bg-purple-50 rounded-full border border-gray-200 transition-all shadow-sm hover:shadow"
          >
            <span>View on Linkinpedia</span>
            <span className="text-[10px]">→</span>
          </a>
        </div>
      </div>

      {/* Setlist */}
      <div className="p-6">
        {Array.from(groupedSets.entries()).map(( [setName, songs], setIdx ) => (
          <div
            key={setIdx}
            className="mb-8 last:mb-0"
          >
            {/* Set Header - Small Pill Badge */}
            <div className="mb-4 flex items-center gap-2">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700`}>
                {setName}
              </span>
              <span className="text-xs text-gray-400">
                {songs.length} {songs.length === 1 ? 'song' : 'songs'}
              </span>
            </div>

            {/* Songs in this set */}
            <div className="space-y-2">
              {songs.map(( song, idx ) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all hover:shadow-sm ${
                    song.status === 'shared'
                      ? 'bg-emerald-50 border border-emerald-200'
                      : 'bg-rose-50 border border-rose-200'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                      song.status === 'shared'
                        ? 'bg-emerald-200 text-emerald-800'
                        : 'bg-rose-200 text-rose-800'
                    }`}
                  >
                    {song.position}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="font-medium text-gray-900">{song.name}</div>
                    {song.info && (
                      <div className="text-xs text-gray-500 mt-0.5 italic">{song.info}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Stats Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
          <span className="text-gray-600">
            <span className="font-semibold text-rose-600">{show.setlist.uniqueCount}</span>
            {' '}unique {show.setlist.uniqueCount === 1 ? 'song' : 'songs'}
          </span>
          <span className="text-gray-400 text-xs">
            {show.setlist.totalSongs} total
          </span>
        </div>
      </div>
    </div>
  );
}
