import lpSongDatabase from '../data/lpSongDatabase.json';
import { resolveCoverByAlbum } from './albumCovers';

import type { Setlist } from '../types/setlist';

type AlbumInfo = {
  album: string;
  year: number;
  coverUrl?: string;
};


// 3. Create a song-to-album map with type
const SONG_ALBUM_MAP: Record<string, AlbumInfo> =
  lpSongDatabase.songs.reduce((map, song) => {
    map[song.title] = {
      album: song.album,
      year: song.year,
    };
    return map;
  }, {} as Record<string, AlbumInfo>);

// 4. Helper function with type
function getAlbumInfo(songTitle: string): AlbumInfo | undefined {
  return SONG_ALBUM_MAP[songTitle];
}
export interface SongStats {
  title: string;
  timesPlayed: number;
  totalShows: number;
  percentage: number;
  lastPlayed?: string;
  lastPlayedDate?: string;
  showsSinceLastPlayed: number;
  category: 'staple' | 'rotation' | 'rare' | 'deep-cut' | 'prediction'
  album?: string;
  coverUrl?: string;
  year?: number;
  positionRange?: string | null;
}

export interface TourStats {
  allSongs?: SongStats[];
  totalShows: number;
  uniqueSongs: number;
  staple: SongStats[];
  rotation: SongStats[];
  rare: SongStats[];
  deepCut: SongStats[];
  nextShow?: {
    city: string;
    venue: string;
    date: string;
    daysUntil: number;
  };
  recentlyPlayed: string[];
  overdue: SongStats[];
}

/**
 * Process setlist data and calculate comprehensive tour statistics
 */
export function calculateTourStats(setlists: Setlist[]): TourStats {
  if (!setlists || setlists.length === 0) {
    return {
      allSongs: [],
      totalShows: 0,
      uniqueSongs: 0,
      staple: [],
      rotation: [],
      rare: [],
      deepCut: [],
      recentlyPlayed: [],
      overdue: [],
    };
  }

  const totalShows = setlists.length;
  
  const songPlayCount = new Map<string, {
    count: number;
    lastCity?: string;
    lastDate?: string;
    lastShowIndex: number;
  }>();

  // Sort setlists by date (newest first)
  const sortedSetlists = [...setlists].sort((a, b) => {
    const dateA = new Date(a.eventDate.split('-').reverse().join('-'));
    const dateB = new Date(b.eventDate.split('-').reverse().join('-'));
    return dateB.getTime() - dateA.getTime();
  });

  // Filter function using API properties
  const isLinkinParkSong = (song: any): boolean => {
    // Exclude tape/intros
    if (song.tape === true) return false;

    // Exclude covers, EXCEPT Fort Minor (Mike's project)
    if (song.cover) {
      const coverArtist = song.cover.name.toLowerCase();
      // Include Fort Minor songs even though they're technically covers
      if (coverArtist === 'fort minor') return true;
      // Exclude all other covers
      return false;
    }

    // Include everything else (real LP songs)
    return true;
  };

  // Precompute typical position ranges in ONE pass (instead of per-song scanning all setlists)
  const positionMinMaxByTitle = new Map<string, { min: number; max: number }>();

  sortedSetlists.forEach(setlist => {
    let position = 1;

    setlist.sets?.set?.forEach((set: any) => {
      set.song?.forEach((song: any) => {
        // Skip tape songs - they don't count as positions (and shouldn't increment)
        if (song.tape) return;

        const title = song.name as string;

        const existing = positionMinMaxByTitle.get(title);
        if (!existing) {
          positionMinMaxByTitle.set(title, { min: position, max: position });
        } else {
          existing.min = Math.min(existing.min, position);
          existing.max = Math.max(existing.max, position);
        }

        position++;
      });
    });
  });

  const getPositionRange = (songTitle: string): string | null => {
    const mm = positionMinMaxByTitle.get(songTitle);
    if (!mm) return null;
    if (mm.min === mm.max) return `${mm.min}`;
    return `${mm.min}-${mm.max}`;
  };

  // Count song plays and track last played info
  sortedSetlists.forEach((setlist, showIndex) => {
    const songs = setlist.sets?.set?.flatMap(s => s.song || []) || [];

    songs.forEach(song => {
      // Skip non-LP songs using API properties
      if (!isLinkinParkSong(song)) return;

      const title = song.name;

      const existing = songPlayCount.get(title);

      if (!existing) {
        songPlayCount.set(title, {
          count: 1,
          lastCity: setlist.venue.city.name,
          lastDate: setlist.eventDate,
          lastShowIndex: showIndex,
        });
      } else {
        existing.count += 1;
        // Only update last played if this show is more recent
        if (showIndex < existing.lastShowIndex) {
          existing.lastCity = setlist.venue.city.name;
          existing.lastDate = setlist.eventDate;
          existing.lastShowIndex = showIndex;
        }
      }
    });
  });

  // Convert to SongStats array (NO undefined entries)
  const allSongs: SongStats[] = [...songPlayCount].map(([title, data]) => {
    const percentage = (data.count / totalShows) * 100;

    // Always assign a category (removes the undefined-return issue entirely)
    const category: SongStats['category'] =
      percentage >= 80 ? 'staple'
        : percentage >= 40 ? 'rotation'
          : percentage >= 20 ? 'rare'
            : 'deep-cut';

    const albumInfo = getAlbumInfo(title);
    const coverUrl = resolveCoverByAlbum(albumInfo?.album, title);

    return {
      title,
      timesPlayed: data.count,
      totalShows,
      percentage,
      lastPlayed: data.lastCity,
      lastPlayedDate: data.lastDate,
      showsSinceLastPlayed: data.lastShowIndex,
      category,
      album: albumInfo?.album,
      year: albumInfo?.year,
      coverUrl,
      positionRange: getPositionRange(title),
    };
  });

  // Sort by play count (descending)
  allSongs.sort((a, b) => b.timesPlayed - a.timesPlayed);

  // Get recent setlist songs (last show)
  const recentlyPlayed = sortedSetlists[0]?.sets?.set
    ?.flatMap(s => s.song || [])
    .map(s => s.name) || [];

  // Find overdue songs (rotating songs that haven't been played in 3+ shows)
  const overdue = allSongs
    .filter(song => song.category === 'rotation' && song.showsSinceLastPlayed >= 3)
    .sort((a, b) => b.showsSinceLastPlayed - a.showsSinceLastPlayed);

  return {
    allSongs,
    totalShows,
    uniqueSongs: allSongs.length,
    staple: allSongs.filter(s => s.category === 'staple'),
    rotation: allSongs.filter(s => s.category === 'rotation'),
    rare: allSongs.filter(s => s.category === 'rare'),
    deepCut: allSongs.filter(s => s.category === 'deep-cut'),
    recentlyPlayed,
    overdue,
  };
}

