import React, { useState, useMemo } from 'react';

import '../styles/LPSongs.css';


interface Song {
  title: string;
  abbreviation: string;
}

interface Album {
  name: string;
  year: number;
  songs: Song[];
}

const lpDiscography: Album[] = [
  {
    name: 'Hybrid Theory',
    year: 2000,
    songs: [
      { title: 'Papercut', abbreviation: 'PPC' },
      { title: 'One Step Closer', abbreviation: 'OSC' },
      { title: 'With You', abbreviation: 'WY' },
      { title: 'Points of Authority', abbreviation: 'POA' },
      { title: 'Crawling', abbreviation: 'CRWL' },
      { title: 'Runaway', abbreviation: 'RNA' },
      { title: 'By Myself', abbreviation: 'BM' },
      { title: 'In the End', abbreviation: 'ITE' },
      { title: 'A Place for My Head', abbreviation: 'APFMH' },
      { title: 'Forgotten', abbreviation: 'FGT' },
      { title: 'Cure for the Itch', abbreviation: 'CFTI' },
      { title: 'Pushing Me Away', abbreviation: 'PMA' },
    ],
  },
  {
    name: 'Meteora',
    year: 2003,
    songs: [
      { title: 'Foreword', abbreviation: 'FWD' },
      { title: "Don't Stay", abbreviation: 'DS' },
      { title: 'Somewhere I Belong', abbreviation: 'SIB' },
      { title: 'Lying from You', abbreviation: 'LFY' },
      { title: 'Hit the Floor', abbreviation: 'HTF' },
      { title: 'Easier to Run', abbreviation: 'ETR' },
      { title: 'Faint', abbreviation: 'FNT' },
      { title: 'Figure.09', abbreviation: 'F09' },
      { title: 'Breaking the Habit', abbreviation: 'BTH' },
      { title: 'From the Inside', abbreviation: 'FTI' },
      { title: 'Nobody\'s Listening', abbreviation: 'NL' },
      { title: 'Session', abbreviation: 'SSN' },
      { title: 'Numb', abbreviation: 'NMB' },
    ],
  },
  {
    name: 'Minutes to Midnight',
    year: 2007,
    songs: [
      { title: 'Wake', abbreviation: 'WK' },
      { title: 'Given Up', abbreviation: 'GU' },
      { title: 'Leave Out All the Rest', abbreviation: 'LOATR' },
      { title: 'Bleed It Out', abbreviation: 'BIO' },
      { title: 'Shadow of the Day', abbreviation: 'SOTD' },
      { title: "What I've Done", abbreviation: 'WID' },
      { title: 'Hands Held High', abbreviation: 'HHH' },
      { title: 'No More Sorrow', abbreviation: 'NMS' },
      { title: 'Valentine\'s Day', abbreviation: 'VD' },
      { title: 'In Between', abbreviation: 'IB' },
      { title: 'In Pieces', abbreviation: 'IP' },
      { title: 'The Little Things Give You Away', abbreviation: 'TLTGYA' },
    ],
  },
  {
    name: 'A Thousand Suns',
    year: 2010,
    songs: [
      { title: 'The Requiem', abbreviation: 'TR' },
      { title: 'The Radiance', abbreviation: 'TRD' },
      { title: 'Burning in the Skies', abbreviation: 'BITS' },
      { title: 'Empty Spaces', abbreviation: 'ES' },
      { title: 'When They Come for Me', abbreviation: 'WTCFM' },
      { title: 'Robot Boy', abbreviation: 'RB' },
      { title: 'Jornada del Muerto', abbreviation: 'JDM' },
      { title: 'Waiting for the End', abbreviation: 'WFTE' },
      { title: 'Blackout', abbreviation: 'BO' },
      { title: 'Wretches and Kings', abbreviation: 'WAK' },
      { title: 'Wisdom, Justice, and Love', abbreviation: 'WJAL' },
      { title: 'Iridescent', abbreviation: 'IRD' },
      { title: 'Fallout', abbreviation: 'FO' },
      { title: 'The Catalyst', abbreviation: 'TC' },
      { title: 'The Messenger', abbreviation: 'TM' },
    ],
  },
  {
    name: 'Living Things',
    year: 2012,
    songs: [
      { title: 'Lost in the Echo', abbreviation: 'LITE' },
      { title: 'In My Remains', abbreviation: 'IMR' },
      { title: 'Burn It Down', abbreviation: 'BID' },
      { title: 'Lies Greed Misery', abbreviation: 'LGM' },
      { title: "I'll Be Gone", abbreviation: 'IBG' },
      { title: 'Castle of Glass', abbreviation: 'COG' },
      { title: 'Victimized', abbreviation: 'VCT' },
      { title: 'Roads Untraveled', abbreviation: 'RU' },
      { title: 'Skin to Bone', abbreviation: 'STB' },
      { title: 'Until It Breaks', abbreviation: 'UIB' },
      { title: 'Tinfoil', abbreviation: 'TF' },
      { title: 'Powerless', abbreviation: 'PWR' },
    ],
  },
  {
    name: 'The Hunting Party',
    year: 2014,
    songs: [
      { title: 'Keys to the Kingdom', abbreviation: 'KTTK' },
      { title: 'All for Nothing', abbreviation: 'AFN' },
      { title: 'Guilty All the Same', abbreviation: 'GATS' },
      { title: 'The Summoning', abbreviation: 'TS' },
      { title: 'War', abbreviation: 'WAR' },
      { title: 'Wastelands', abbreviation: 'WL' },
      { title: 'Until It\'s Gone', abbreviation: 'UIG' },
      { title: 'Rebellion', abbreviation: 'RBL' },
      { title: 'Mark the Graves', abbreviation: 'MTG' },
      { title: 'Drawbar', abbreviation: 'DB' },
      { title: 'Final Masquerade', abbreviation: 'FM' },
      { title: 'A Line in the Sand', abbreviation: 'ALITS' },
    ],
  },
  {
    name: 'One More Light',
    year: 2017,
    songs: [
      { title: 'Nobody Can Save Me', abbreviation: 'NCSM' },
      { title: 'Good Goodbye', abbreviation: 'GG' },
      { title: 'Talking to Myself', abbreviation: 'TTM' },
      { title: 'Battle Symphony', abbreviation: 'BS' },
      { title: 'Invisible', abbreviation: 'INV' },
      { title: 'Heavy', abbreviation: 'HVY' },
      { title: 'Sorry for Now', abbreviation: 'SFN' },
      { title: 'Halfway Right', abbreviation: 'HR' },
      { title: 'One More Light', abbreviation: 'OML' },
      { title: 'Sharp Edges', abbreviation: 'SE' },
    ],
  },
];

export const LPSongs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'album' | 'alphabetical'>('album');

  const filteredDiscography = useMemo(() => {
    if (!searchQuery) return lpDiscography;

    const query = searchQuery.toLowerCase();
    return lpDiscography.map(album => ({
      ...album,
      songs: album.songs.filter(song =>
        song.title.toLowerCase().includes(query) ||
        song.abbreviation.toLowerCase().includes(query)
      ),
    })).filter(album => album.songs.length > 0);
  }, [searchQuery]);

  const alphabeticalSongs = useMemo(() => {
    const allSongs = lpDiscography.flatMap(album =>
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
    <div className="lp-discography-container">
      <header className="lp-header">
        <h1 className="lp-title">Linkin Park Discography</h1>
        <p className="lp-subtitle">Complete list of studio albums and song abbreviations</p>
      </header>

      <div className="lp-controls">
        <input
          type="text"
          className="lp-search-input"
          placeholder="Search by song title or abbreviation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="lp-view-toggle">
          <button
            className={`lp-toggle-btn ${viewMode === 'album' ? 'lp-toggle-active' : ''}`}
            onClick={() => setViewMode('album')}
          >
            By Album
          </button>
          <button
            className={`lp-toggle-btn ${viewMode === 'alphabetical' ? 'lp-toggle-active' : ''}`}
            onClick={() => setViewMode('alphabetical')}
          >
            Alphabetical
          </button>
        </div>
      </div>

      {searchQuery && (
        <div className="lp-results-count">
          Found {viewMode === 'album'
          ? filteredDiscography.reduce((sum, album) => sum + album.songs.length, 0)
          : alphabeticalSongs.length
        } song{(viewMode === 'album'
          ? filteredDiscography.reduce((sum, album) => sum + album.songs.length, 0)
          : alphabeticalSongs.length) !== 1 ? 's' : ''}
        </div>
      )}

      <div className="lp-content">
        {viewMode === 'album' ? (
          filteredDiscography.length > 0 ? (
            filteredDiscography.map((album, albumIndex) => (
              <section key={albumIndex} className="lp-album-section">
                <h2 className="lp-album-title">
                  {album.name} <span className="lp-year">({album.year})</span>
                </h2>
                <table className="lp-table">
                  <thead>
                  <tr>
                    <th className="lp-th-track">#</th>
                    <th className="lp-th-title">Title</th>
                    <th className="lp-th-abbr">Abbreviation</th>
                  </tr>
                  </thead>
                  <tbody>
                  {album.songs.map((song, songIndex) => (
                    <tr key={songIndex} className="lp-table-row">
                      <td className="lp-track-number">
                        {lpDiscography.find(a => a.name === album.name)?.songs.findIndex(s => s.title === song.title)! + 1}
                      </td>
                      <td className="lp-song-title">{song.title}</td>
                      <td className="lp-abbreviation">{song.abbreviation}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </section>
            ))
          ) : (
            <div className="lp-no-results">No songs found matching "{searchQuery}"</div>
          )
        ) : (
          <section className="lp-album-section">
            <h2 className="lp-album-title">All Songs (A-Z)</h2>
            {alphabeticalSongs.length > 0 ? (
              <table className="lp-table">
                <thead>
                <tr>
                  <th className="lp-th-title">Title</th>
                  <th className="lp-th-abbr">Abbreviation</th>
                  <th className="lp-th-album">Album</th>
                </tr>
                </thead>
                <tbody>
                {alphabeticalSongs.map((song, index) => (
                  <tr key={index} className="lp-table-row">
                    <td className="lp-song-title">{song.title}</td>
                    <td className="lp-abbreviation">{song.abbreviation}</td>
                    <td className="lp-album-name">{song.album} ({song.year})</td>
                  </tr>
                ))}
                </tbody>
              </table>
            ) : (
              <div className="lp-no-results">No songs found matching "{searchQuery}"</div>
            )}
          </section>
        )}
      </div>

      <footer className="lp-footer">
        <p>Total: {lpDiscography.length} albums, {lpDiscography.reduce((sum, album) => sum + album.songs.length, 0)} songs</p>
      </footer>
    </div>
  );
};

export default LPSongs;
