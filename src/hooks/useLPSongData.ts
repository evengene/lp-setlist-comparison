import { useMemo } from 'react';
import lpSongDatabase from '../data/lpSongDatabase.json';
import { resolveCoverByAlbum } from '../utils/albumCovers';

export interface Song {
  title: string;
  abbreviation: string;
  album: string;
  year: number;
  track: number | null;
}

export interface Album {
  name: string;
  year: number;
  coverUrl?: string;
  songs: Song[];
}

export function useLPSongData() {

  // Transform flat songs into a grouped albums structure
  const albumsWithSongs = useMemo(() => {
    const albumMap = new Map<string, Album>();

    // Group songs by album
    lpSongDatabase.songs.forEach(song => {
      if (!albumMap.has(song.album)) {
        // Create a new album entry
        albumMap.set(song.album, {
          name: song.album,
          year: song.year,
          coverUrl: resolveCoverByAlbum(song.album),
          songs: []
        });
      }

      // Add song to album
      albumMap.get(song.album)!.songs.push(song);
    });

    // Convert to array and sort by year (chronological)
    return Array.from(albumMap.values()).sort((a, b) => a.year - b.year);
  }, []);

  // Flat list of all songs (useful for search/stats)
  const allSongs = useMemo(() => lpSongDatabase.songs, []);

  // Quick lookup by title
  const songMap = useMemo(() => {
    return lpSongDatabase.songs.reduce((map, song) => {
      map[song.title] = song;
      return map;
    }, {} as Record<string, Song>);
  }, []);

  return {
    albumsWithSongs,  // For LPSongs page display
    allSongs,         // For search/filtering
    songMap,          // For quick lookups
    getSongByTitle: (title: string) => songMap[title],
  };
}
