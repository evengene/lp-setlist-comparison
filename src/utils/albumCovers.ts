import hybrid from '../images/albums/linkin-park-hybrid-theory-album-cover.jpeg';
import meteora from '../images/albums/linkin-park-meteora-album-cover.jpg';
import minutesToMidnight from '../images/albums/linkin-park-minutes-to-midnight.jpeg';
import aThousandSuns from '../images/albums/linkin-park-a-thousand-suns-album-cover.jpg';
import livingThings from '../images/albums/linkin-park-living-things-cover.jpg';
import theHuntingParty from '../images/albums/linkin-park-the-hunting-party.jpeg';
import oneMoreLight from '../images/albums/linkin-park-one-more-light.jpg';
import fromZero from '../images/albums/linkin-park-from-zero.jpg';
import fortMinor from '../images/albums/linkin-park-fort-minor.jpg';

const ALBUM_COVERS: Record<string, string> = {
  'Hybrid Theory': hybrid,
  'Meteora': meteora,
  'Minutes to Midnight': minutesToMidnight,
  'A Thousand Suns': aThousandSuns,
  'Living Things': livingThings,
  'The Hunting Party': theHuntingParty,
  'One More Light': oneMoreLight,
  'From Zero': fromZero,
  'From Zero (Deluxe)': fromZero,
  'Fort Minor - The Rising Tied': fortMinor,
};

export function resolveCoverByAlbum(album?: string): string | undefined {
  debugger;
  if (!album) return undefined;
  return ALBUM_COVERS[album];
}
