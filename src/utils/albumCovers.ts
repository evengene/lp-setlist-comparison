import hybrid from '../images/albums/linkin-park-hybrid-theory-album-cover.jpeg';
import meteora from '../images/albums/linkin-park-meteora-album-cover.jpg';
import meteora20 from '../images/albums/linkin-park-meteora-20-album-cover.jpg';
import minutesToMidnight from '../images/albums/linkin-park-minutes-to-midnight.jpeg';
import aThousandSuns from '../images/albums/linkin-park-a-thousand-suns-album-cover.jpg';
import livingThings from '../images/albums/linkin-park-living-things-cover.jpg';
import theHuntingParty from '../images/albums/linkin-park-the-hunting-party.jpeg';
import oneMoreLight from '../images/albums/linkin-park-one-more-light.jpg';
import fromZero from '../images/albums/linkin-park-from-zero.jpg';
import fortMinor from '../images/albums/linkin-park-fort-minor.jpg';
import mrHanh from "../images/albums/mr_hanh.jpg";
import mikeS from "../images/albums/mike-shinoda.jpg";
import defaultCover from "../../public/tour-images/default.jpg";

const SPECIAL_TITLE_COVERS: Readonly<Record<string, string>> = {
  "Joe Hahn Solo": mrHanh,
  "When They Come for Me / Remember the Name": mikeS
};

export function resolveCoverByAlbum(album?: string, title?: string): string {
  if (title) {
    const special = SPECIAL_TITLE_COVERS[title];
    if (special && !album) return special;
  }

  if (!album) return defaultCover;

  return ALBUM_COVERS[album] ?? defaultCover;
}

// ... existing code ...
const ALBUM_COVERS: Record<string, string> = {
  "Hybrid Theory": hybrid,
  "Meteora": meteora,
  "Meteora 20": meteora20,
  "Minutes to Midnight": minutesToMidnight,
  "A Thousand Suns": aThousandSuns,
  "Living Things": livingThings,
  "The Hunting Party": theHuntingParty,
  "One More Light": oneMoreLight,
  "One More Light (Bonus)": oneMoreLight,
  "From Zero": fromZero,
  "From Zero (Deluxe)": fromZero,
  "Fort Minor - The Rising Tied": fortMinor,
  "Joe Hanh Solo": mrHanh,
  default: defaultCover
};
// ... existing code ...
