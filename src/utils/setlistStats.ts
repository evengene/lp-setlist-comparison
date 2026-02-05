import type { Setlist } from '../types/setlist';
import lpSongDatabase from '../data/lpSongDatabase.json';
import { resolveCoverByAlbum } from './albumCovers';

type AlbumInfo = {
  album: string;
  year: number;
  coverUrl?: string;
};


// 3. Create song-to-album map with type
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

  // Count song plays and track last played info
  sortedSetlists.forEach((setlist, showIndex) => {
    const songs = setlist.sets?.set?.flatMap(s => s.song || []) || [];

    songs.forEach(song => {
      // Skip non-LP songs using API properties
      if (!isLinkinParkSong(song)) return;

      // calculate song typical position


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

  // Get typical position range for a song
  function calculatePositionRange(songTitle: string): string | null {
    const positions: number[] = [];

    // Loop through all setlists
    sortedSetlists.forEach(setlist => {
      let position = 1;

      // Loop through all sets
      setlist.sets?.set?.forEach((set: any) => {
        // Loop through songs in this set
        set.song?.forEach((song: any) => {
          // Skip tape songs - they don't count as positions
          if (song.tape) return;

          // If this is our song, record the position
          if (song.name === songTitle) {
            positions.push(position);
          }

          // Increment position counter
          position++;
        });
      });
    });

    // If song was never played, return null
    if (positions.length === 0) return null;

    // Calculate min and max
    const min = Math.min(...positions);
    const max = Math.max(...positions);

    // If always same position, return single number
    if (min === max) {
      return `${min}`;
    }

    // Return range
    return `${min}-${max}`;
  }

  // Convert to SongStats array
  const allSongs: SongStats[] = Array.from(songPlayCount.entries()).map(([title, data]) => {
    const percentage = (data.count / totalShows) * 100;
    let category: SongStats['category'];

    // Core setlist: 80%+ of shows
    if (percentage >= 80) category = 'staple';
    // Rotating: 40-79% of shows (every other show roughly)
    else if (percentage >= 40) category = 'rotation';
    // Rare: 20-39%
    else if (percentage >= 20) category = 'rare';
    // deepCut: <20%
    else if (percentage < 20) category = 'deep-cut';

    else return;

    // Get album info
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
      positionRange: calculatePositionRange(title),
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

/**
 * Get the next upcoming show (if available in setlist.fm data)
 * Note: This would need upcoming shows data from setlist.fm
 */
// export function getNextShow(setlists: Setlist[]) {
//   // For now, return null - you'll need to implement this
//   // when you have access to upcoming shows data
//   return null;
// }

/**
 * Get days until a future date
 */
export function getDaysUntil(dateString: string): number {
  const [day, month, year] = dateString.split('-');
  const targetDate = new Date(`${year}-${month}-${day}`);
  const today = new Date();
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
