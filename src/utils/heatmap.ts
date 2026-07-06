import type { TourData } from '../services/tourDataService';

export interface SongLegRow {
  title: string;
  total: number;
  intensity: number[]; // 0..4 per leg column
}

export interface HeatmapData {
  legIds: number[];
  legLabels: string[];
  rows: SongLegRow[];
}

interface RawSong {
  name: string;
  tape?: boolean;
  cover?: { name?: string };
}

// Same rule the tour stats use: drop tapes/intros and covers, but keep Fort Minor.
function isLinkinParkSong(song: RawSong): boolean {
  if (song.tape === true) return false;
  if (song.cover) return (song.cover.name ?? '').toLowerCase() === 'fort minor';
  return true;
}

/**
 * Builds a song × leg matrix: for each song, how often it appeared in each leg,
 * as an intensity bucket (0 = never … 4 = every night of that leg).
 * Returns the top `topN` songs by total plays.
 */
export function buildHeatmap(data: TourData, topN = 16, sort: 'plays' | 'variation' = 'plays'): HeatmapData {
  const showsByLeg = new Map<number, number>();
  for (const s of data.shows) {
    showsByLeg.set(s.legId, (showsByLeg.get(s.legId) ?? 0) + 1);
  }
  const legIds = [...showsByLeg.keys()].sort((a, b) => a - b);
  const legIndex = new Map(legIds.map((id, i) => [id, i]));

  const counts = new Map<string, number[]>();
  for (const show of data.shows) {
    const li = legIndex.get(show.legId);
    if (li === undefined) continue;
    const sets = (show.setlist as { sets?: { set?: { song?: RawSong[] }[] } }).sets?.set ?? [];
    for (const set of sets) {
      for (const song of set.song ?? []) {
        if (!isLinkinParkSong(song)) continue;
        let arr = counts.get(song.name);
        if (!arr) {
          arr = new Array(legIds.length).fill(0);
          counts.set(song.name, arr);
        }
        arr[li] += 1;
      }
    }
  }

  const rows: SongLegRow[] = [...counts.entries()].map(([title, perLeg]) => {
    const total = perLeg.reduce((a, b) => a + b, 0);
    const intensity = perLeg.map((plays, i) => {
      const inLeg = showsByLeg.get(legIds[i]) ?? 0;
      if (plays <= 0 || inLeg <= 0) return 0;
      const ratio = Math.min(1, plays / inLeg);
      if (ratio >= 0.999) return 4;
      if (ratio >= 0.66) return 3;
      if (ratio >= 0.34) return 2;
      return 1;
    });
    return { title, total, intensity };
  });

  if (sort === 'variation') {
    // spread of per-leg intensity — surfaces songs that came/went/grew, not flat staples
    const spread = (arr: number[]) => {
      const mean = arr.reduce((x, y) => x + y, 0) / arr.length;
      return Math.sqrt(arr.reduce((x, y) => x + (y - mean) ** 2, 0) / arr.length);
    };
    rows.sort((a, b) => spread(b.intensity) - spread(a.intensity) || b.total - a.total);
  } else {
    rows.sort((a, b) => b.total - a.total);
  }

  return {
    legIds,
    legLabels: legIds.map((id) => `L${id}`),
    rows: rows.slice(0, topN),
  };
}

function dateKey(ddmmyyyy: string): string {
  const [dd, mm, yyyy] = ddmmyyyy.split('-');
  return `${yyyy}${mm}${dd}`;
}

export interface SongLegBreakdown {
  legIds: number[];
  legLabels: string[];
  perLeg: number[];
  showsPerLeg: number[];
  intensity: number[];
  total: number;
  lastCity?: string;
  lastDate?: string;
}

/** Per-leg play breakdown for a single song, plus its most recent performance. */
export function songLegBreakdown(data: TourData, title: string): SongLegBreakdown {
  const showsByLeg = new Map<number, number>();
  for (const s of data.shows) {
    showsByLeg.set(s.legId, (showsByLeg.get(s.legId) ?? 0) + 1);
  }
  const legIds = [...showsByLeg.keys()].sort((a, b) => a - b);
  const legIndex = new Map(legIds.map((id, i) => [id, i]));

  const perLeg = new Array(legIds.length).fill(0);
  let total = 0;
  let lastKey = '';
  let lastCity: string | undefined;
  let lastDate: string | undefined;

  for (const show of data.shows) {
    const li = legIndex.get(show.legId);
    if (li === undefined) continue;

    const sets = (show.setlist as { sets?: { set?: { song?: RawSong[] }[] } }).sets?.set ?? [];
    let played = false;
    for (const set of sets) {
      for (const song of set.song ?? []) {
        if (isLinkinParkSong(song) && song.name === title) {
          played = true;
          break;
        }
      }
      if (played) break;
    }

    if (played) {
      perLeg[li] += 1;
      total += 1;
      const k = dateKey(show.date);
      if (k > lastKey) {
        lastKey = k;
        lastCity = show.city;
        lastDate = show.date;
      }
    }
  }

  const showsPerLeg = legIds.map((id) => showsByLeg.get(id) ?? 0);
  const intensity = perLeg.map((plays, i) => {
    const inLeg = showsPerLeg[i];
    if (plays <= 0 || inLeg <= 0) return 0;
    const ratio = Math.min(1, plays / inLeg);
    if (ratio >= 0.999) return 4;
    if (ratio >= 0.66) return 3;
    if (ratio >= 0.34) return 2;
    return 1;
  });

  return {
    legIds,
    legLabels: legIds.map((id) => `L${id}`),
    perLeg,
    showsPerLeg,
    intensity,
    total,
    lastCity,
    lastDate,
  };
}
