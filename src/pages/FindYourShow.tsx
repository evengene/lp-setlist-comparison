import { useMemo, useState } from 'react';
import { toPng } from 'html-to-image';
import { Download, Link as LinkIcon, Check } from 'lucide-react';
import { getTourData } from '../services/tourDataService';
import { calculateTourStats } from '../utils/setlistStats';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function fmtDate(d: string): string {
  const [dd, mm, yyyy] = d.split('-');
  return `${parseInt(dd, 10)} ${MONTHS[parseInt(mm, 10) - 1] ?? mm} ${yyyy}`;
}

interface SetGroup {
  name: string;
  songs: string[];
}
function getSets(raw: unknown): SetGroup[] {
  const sets =
    (raw as { sets?: { set?: { name?: string; encore?: number; song?: { name: string; tape?: boolean }[] }[] } }).sets
      ?.set ?? [];
  return sets
    .map((set) => ({
      name: set.name || (set.encore ? 'Encore' : 'Set'),
      songs: (set.song ?? []).filter((s) => !s.tape).map((s) => s.name),
    }))
    .filter((g) => g.songs.length > 0);
}

export const FindYourShow = () => {
  const data = getTourData();

  const rareTitles = useMemo(() => {
    const stats = calculateTourStats(data.shows.map((s) => s.setlist as never));
    const set = new Set<string>();
    (stats.allSongs ?? []).forEach((s) => {
      if (s.category === 'rare' || s.category === 'deep-cut') set.add(s.title);
    });
    return set;
  }, [data]);

  const legs = useMemo(() => {
    const byLeg = new Map<number, typeof data.shows>();
    for (const s of data.shows) {
      if (!byLeg.has(s.legId)) byLeg.set(s.legId, []);
      byLeg.get(s.legId)!.push(s);
    }
    return data.legs.filter((l) => byLeg.has(l.id)).map((l) => ({ ...l, shows: byLeg.get(l.id)! }));
  }, [data]);

  const initial = new URLSearchParams(window.location.search).get('show');
  const [selectedId, setSelectedId] = useState<string>(
    initial && data.shows.some((s) => s.id === initial) ? initial : data.shows[0]?.id ?? '',
  );
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const show = data.shows.find((s) => s.id === selectedId);
  const region = data.legs.find((l) => l.id === show?.legId)?.region;
  const sets = show ? getSets(show.setlist) : [];
  const totalSongs = sets.reduce((a, s) => a + s.songs.length, 0);
  let counter = 0;

  const onSelect = (id: string) => {
    setSelectedId(id);
    window.history.pushState({}, '', `${window.location.pathname}?show=${id}`);
  };

  const handleDownload = async () => {
    if (!show) return;
    setDownloading(true);
    try {
      const el = document.getElementById('your-show-card');
      if (!el) return;
      const dataUrl = await toPng(el, { pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `lp-${show.city.replace(/[^a-z0-9]/gi, '-')}-${show.date}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to render card:', err);
      alert('Could not generate the image');
    } finally {
      setDownloading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?show=${selectedId}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert(`Failed to copy link: ${err}`);
    }
  };

  return (
    <div className="min-h-screen bg-ink font-body text-bone">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-grain opacity-[0.13] mix-blend-overlay" />
        <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-12">
          <p className="font-mono text-[11px] tracking-[0.22em] text-ash">
            <span className="text-ember">→</span>&nbsp;&nbsp;FROM ZERO WORLD TOUR · YOUR SHOW
          </p>
          <h1 className="mt-4 font-display text-5xl uppercase leading-[0.9] text-bone sm:text-7xl">Find your show</h1>
          <p className="mt-4 max-w-xl font-body italic text-bone-dim">
            Were you there? Pick your night and take home the setlist.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* Selector */}
        <label className="mb-3 block font-mono text-[11px] uppercase tracking-[0.14em] text-ash">Pick a show</label>
        <div className="relative">
          <select
            value={selectedId}
            onChange={(e) => onSelect(e.target.value)}
            className="w-full appearance-none rounded-md border border-line bg-ink-2 px-4 py-3 pr-12 font-body text-base font-semibold text-bone transition-colors hover:border-ash-2 focus:border-ember focus:outline-none"
          >
            {legs.map((leg) => (
              <optgroup key={leg.id} label={`Leg ${leg.id} · ${leg.region}`}>
                {leg.shows.map((s) => (
                  <option key={s.id} value={s.id} className="bg-ink text-bone">
                    {s.city} — {fmtDate(s.date)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
            <svg className="h-5 w-5 text-ash" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Recap card (downloadable) */}
        {show && (
          <div id="your-show-card" className="mt-8 overflow-hidden rounded-lg border border-line bg-ink p-8">
            <div className="font-mono text-[11px] tracking-[0.14em] text-ash">
              FROM ZERO WORLD TOUR · LEG {show.legId}
              {region ? ` · ${region.toUpperCase()}` : ''}
            </div>
            <h2 className="mt-3 font-display text-5xl uppercase leading-[0.9] text-bone sm:text-6xl">{show.city}</h2>
            <div className="mt-2 font-mono text-[12px] tracking-[0.06em] text-bone-dim">
              {show.venue} · {fmtDate(show.date)}
            </div>

            <div className="mt-6 [column-gap:2rem] [column-count:1] sm:[column-count:2]">
              {sets.map((set) => (
                <div key={set.name} className="mb-5 break-inside-avoid">
                  <div className="mb-2 font-mono text-[11px] tracking-[0.12em] text-ember">{set.name.toUpperCase()}</div>
                  {set.songs.map((song) => {
                    counter += 1;
                    const rare = rareTitles.has(song);
                    return (
                      <div key={`${set.name}-${counter}`} className="flex items-baseline gap-2.5 py-0.5 text-[13px]">
                        <span className="w-5 shrink-0 font-mono text-[10px] text-ash-2">
                          {counter < 10 ? `0${counter}` : counter}
                        </span>
                        <span className={rare ? 'text-ember' : 'text-bone-dim'}>{song}</span>
                        {rare && <span className="font-mono text-[8px] tracking-[0.06em] text-ember">RARE</span>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-line pt-4 font-mono text-[11px] tracking-[0.06em] text-ash-2">
              <span>{totalSongs} SONGS</span>
              <span>lpsetlists.com</span>
            </div>
          </div>
        )}

        {/* Actions */}
        {show && (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-2 rounded-md bg-ember px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] text-ink transition-colors hover:bg-ember-bright disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {downloading ? 'Generating…' : 'Download card'}
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-md border border-line px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] text-bone-dim transition-colors hover:border-ash-2 hover:text-bone"
            >
              {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
              {copied ? 'Link copied' : 'Copy link'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindYourShow;
