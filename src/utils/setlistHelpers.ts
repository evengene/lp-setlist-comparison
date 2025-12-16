import type { Setlist, ProcessedSong, Show, ComparisonStats } from '../types/setlist';

/**
 * Convert Setlist.fm date format (dd-MM-yyyy) to readable format
 */
export function formatDate(dateString: string): string {
  const [day, month, year] = dateString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

/**
 * Process a setlist from Setlist.fm API into our app format
 */
export function processSetlist(setlist: Setlist): Show {
  const songs: ProcessedSong[] = [];
  let position = 1;

  setlist.sets.set.forEach((set) => {
    const isEncore = set.encore === 1;
    const setName = set.name || (isEncore ? 'Encore' : undefined);

    set.song.forEach((song) => {
      if (!song.tape) { // Skip tape/cover songs if needed
        songs.push({
          name: song.name,
          position,
          status: 'unique', // Will be updated during comparison
          isEncore,
          setName,
          info: song.info,
        });
        position++;
      }
    });
  });

  return {
    id: setlist.id,
    name: `${setlist.venue.city.name}, ${setlist.venue.city.stateCode || setlist.venue.city.country.code}`,
    venue: setlist.venue.name,
    date: formatDate(setlist.eventDate),
    rawDate: setlist.eventDate,
    setlistUrl: setlist.url,
    setlist: {
      songs,
      uniqueCount: 0,
      totalSongs: songs.length,
    },
  };
}

/**
 * Compare two shows and mark shared vs unique songs
 */
export function compareShows(show1: Show, show2: Show): {
  show1: Show;
  show2: Show;
  stats: ComparisonStats;
} {
  const show1Songs = new Set(show1.setlist.songs.map(s => s.name));
  const show2Songs = new Set(show2.setlist.songs.map(s => s.name));

  // Mark songs as shared or unique for show 1
  show1.setlist.songs.forEach(song => {
    song.status = show2Songs.has(song.name) ? 'shared' : 'unique';
  });

  // Mark songs as shared or unique for show 2
  show2.setlist.songs.forEach(song => {
    song.status = show1Songs.has(song.name) ? 'shared' : 'unique';
  });

  // Calculate unique counts
  show1.setlist.uniqueCount = show1.setlist.songs.filter(s => s.status === 'unique').length;
  show2.setlist.uniqueCount = show2.setlist.songs.filter(s => s.status === 'unique').length;

  // Calculate comparison stats
  const sharedCount = show1.setlist.songs.filter(s => s.status === 'shared').length;
  const similarityPercent = Math.round((sharedCount / show1.setlist.totalSongs) * 100);

  return {
    show1,
    show2,
    stats: {
      similarityPercent,
      sharedCount,
      uniqueCount: show1.setlist.uniqueCount + show2.setlist.uniqueCount,
    },
  };
}

/**
 * Create a simple ID from venue and date
 */
export function createShowId(venue: string, date: string): string {
  return `${venue}-${date}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

/**
 * Convert date to Linkinpedia URL format
 * Input: "dd-MM-yyyy" (e.g., "11-11-2024")
 * Output: "YYYYMMDD" (e.g., "20241111")
 */
export function getLinkinpediaUrl(rawDate: string): string {
  const [day, month, year] = rawDate.split('-');
  const dateCode = `${year}${month.padStart(2, '0')}${day.padStart(2, '0')}`;
  return `https://linkinpedia.com/wiki/Live:${dateCode}`;
}
