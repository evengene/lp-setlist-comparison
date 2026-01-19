import React, { useState, useMemo } from 'react';
import { useLPSongData } from '../hooks/useLPSongData.ts';


export const LPSongs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { albumsWithSongs } = useLPSongData();

  const [viewMode, setViewMode] = useState<'album' | 'alphabetical'>('album');


  // Filter albums based on search query
  const filteredDiscography = useMemo(() => {
    if (!searchQuery) return albumsWithSongs;

    const query = searchQuery.toLowerCase();
    return albumsWithSongs.map(album => ({
      ...album,
      songs: album.songs.filter(song =>
        song.title.toLowerCase().includes(query) ||
        song.abbreviation.toLowerCase().includes(query)
      ),
    })).filter(album => album.songs.length > 0);
  }, [searchQuery, albumsWithSongs]);

  const alphabeticalSongs = useMemo(() => {
    const allSongs = albumsWithSongs.flatMap(album =>
      album.songs.map(song => ({
        ...song,
        album: album.name,
        year: album.year,
      }))
    );

    const filtered = searchQuery
      ? allSongs.filter(song =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.abbreviation.toLowerCase().includes(searchQuery.toLowerCase())
      )
      : allSongs;

    return filtered.sort((a, b) => a.title.localeCompare(b.title));
  }, [searchQuery]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Linkin Park Discography</h1>
        <p className="text-gray-600">Complete song collection with abbreviations</p>
      </div>

      {/* Controls */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Search by song title or abbreviation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'album'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-gray-600 hover:text-slate-900'
              }`}
              onClick={() => setViewMode('album')}
            >
              By Album
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'alphabetical'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-gray-600 hover:text-slate-900'
              }`}
              onClick={() => setViewMode('alphabetical')}
            >
              Alphabetical
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      {searchQuery && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 inline-block">
            Found {viewMode === 'album'
            ? filteredDiscography.reduce((sum, album) => sum + album.songs.length, 0)
            : alphabeticalSongs.length
          } song{(viewMode === 'album'
            ? filteredDiscography.reduce((sum, album) => sum + album.songs.length, 0)
            : alphabeticalSongs.length) !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Content */}
      <div className="space-y-8">
        {viewMode === 'album' ? (
          filteredDiscography.length > 0 ? (
            filteredDiscography.map((album, albumIndex) => (
              <div key={albumIndex} className="space-y-4">
                {/* Album Header Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                      {album?.coverUrl ? (
                        <img
                          src={album?.coverUrl}
                          alt={`${album.name} album cover`}
                          className="w-20 h-20 rounded-lg object-cover shadow-md"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/80x80/f3f4f6/9ca3af?text=LP';
                          }}
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-slate-900 mb-1">
                        {album.name}
                      </h2>
                      <p className="text-gray-600 mb-2">{album.year}</p>
                      <p className="text-sm text-gray-500">
                        {album.songs.length} tracks
                      </p>
                    </div>
                  </div>
                </div>

                {/* Songs Grid */}
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {album.songs.map((song, songIndex) => (
                    <div
                      key={songIndex}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                          {songIndex + 1}
                        </span>
                            <h3 className="font-semibold text-slate-900 text-sm group-hover:text-gray-700 truncate">
                              {song.title}
                            </h3>
                          </div>
                          <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 font-mono ">
                          {song.abbreviation}
                        </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.816-6.207-2.175.168-.288.327-.584.475-.888C7.25 11.205 9.51 11 12 11c2.49 0 4.75.205 5.732.937.148.304.307.6.475.888A7.962 7.962 0 0112 15z" />
              </svg>
              <h3 className="text-lg font-medium text-slate-900 mb-1">No songs found</h3>
              <p className="text-gray-500">No songs match your search for "{searchQuery}"</p>
            </div>
          )
        ) : (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">All Songs</h2>
              <p className="text-gray-600">Alphabetical listing</p>
            </div>

            {alphabeticalSongs.length > 0 ? (
              <div className="grid gap-3">
                {alphabeticalSongs.map((song, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Song Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-gray-700">
                          {song.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {song.album} • {song.year}
                        </p>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 font-mono">
                      {song.abbreviation}
                    </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.816-6.207-2.175.168-.288.327-.584.475-.888C7.25 11.205 9.51 11 12 11c2.49 0 4.75.205 5.732.937.148.304.307.6.475.888A7.962 7.962 0 0112 15z" />
                </svg>
                <h3 className="text-lg font-medium text-slate-900 mb-1">No songs found</h3>
                <p className="text-gray-500">No songs match your search for "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-slate-900">{albumsWithSongs.length}</span> albums •
            <span className="font-semibold text-slate-900 ml-1">
          {albumsWithSongs.reduce((sum, album) => sum + album.songs.length, 0)}
        </span> total songs
          </p>
        </div>
      </div>
    </div>
  );
};

export default LPSongs;
