// Setlist.fm API types
export interface SetlistSong {
  name: string;
  info?: string;
  tape?: boolean;
}

export interface SetlistSet {
  name?: string;
  encore?: number;
  song: SetlistSong[];
}

export interface Venue {
  id: string;
  name: string;
  city: {
    name: string;
    state?: string;
    stateCode?: string;
    country: {
      code: string;
      name: string;
    };
  };
}

export interface Artist {
  mbid: string;
  name: string;
  sortName: string;
  disambiguation?: string;
  url: string;
}

export interface Setlist {
  id: string;
  versionId: string;
  eventDate: string; // Format: dd-MM-yyyy
  artist: Artist;
  venue: Venue;
  tour?: {
    name: string;
  };
  sets: {
    set: SetlistSet[];
  };
  info?: string;
  url?: string;
}

export interface SetlistResponse {
  type: string;
  itemsPerPage: number;
  page: number;
  total: number;
  setlist: Setlist[];
}

// App-specific types
export interface Show {
  id: string;
  name: string;
  venue: string;
  date: string;
  rawDate: string;
  capacity?: string;
  setlistUrl?: string;
  setlist: ProcessedSetlist;
}

export interface ProcessedSong {
  name: string;
  position: number;
  status: 'shared' | 'unique';
  isEncore: boolean;
  setName?: string;
  info?: string;
}

export interface ProcessedSetlist {
  songs: ProcessedSong[];
  uniqueCount: number;
  totalSongs: number;
}

export interface ComparisonStats {
  similarityPercent: number;
  sharedCount: number;
  uniqueCount: number;
}
