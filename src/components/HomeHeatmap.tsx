import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTourData } from '../services/tourDataService';
import { buildHeatmap } from '../utils/heatmap';
import { calculateTourStats, type SongStats } from '../utils/setlistStats';
import { SongDetail } from './SongDetail';

const SHADES = ['#17140f', 'rgba(226,83,29,0.30)', 'rgba(226,83,29,0.55)', 'rgba(226,83,29,0.80)', '#e2531d'];

// Short, readable column labels (the raw metadata regions are long / inconsistent)
const REGION_SHORT: Record<string, string> = {
  'From Zero World Tour': 'LAUNCH',
  'Mexico/Asia': 'MEX / ASIA',
  'North America Part 1': 'N. AMERICA',
  'North America Part 2': 'N. AMERICA',
  Europe: 'EUROPE',
  'South America': 'S. AMERICA',
  'Middle East/India': 'ME / INDIA',
  'Australia/New Zealand': 'AUS / NZ',
};
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
function monthYear(startDate?: string): string {
  if (!startDate) return '';
  const [y, m] = startDate.split('-');
  return `${MONTHS[parseInt(m, 10) - 1] ?? ''} '${y.slice(2)}`;
}

export function HomeHeatmap({
  limit = 16,
  index = '02.',
  heading = 'WHAT THEY PLAYED, LEG BY LEG',
  seeAll = true,
}: {
  limit?: number;
  index?: string;
  heading?: string;
  seeAll?: boolean;
} = {}) {
  const data = getTourData();
  const heatmap = useMemo(() => buildHeatmap(data, limit), [data, limit]);

  const statByTitle = useMemo(() => {
    const stats = calculateTourStats(data.shows.map((s) => s.setlist as never));
    const m = new Map<string, SongStats>();
    (stats.allSongs ?? []).forEach((s) => m.set(s.title, s));
    return m;
  }, [data]);

  const legHeaders = useMemo(
    () =>
      heatmap.legIds.map((id) => {
        const leg = data.legs.find((l) => l.id === id);
        return {
          region: leg ? REGION_SHORT[leg.region] ?? leg.region.toUpperCase() : `L${id}`,
          when: monthYear(leg?.startDate),
        };
      }),
    [heatmap.legIds, data.legs],
  );

  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [hoverRow, setHoverRow] = useState<number | null>(null);
  const [hoverCol, setHoverCol] = useState<number | null>(null);
  const [selectedSong, setSelectedSong] = useState<SongStats | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!selectedSong) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelectedSong(null);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [selectedSong]);

  const nLegs = heatmap.legIds.length;
  const cols = `minmax(120px,1.6fr) repeat(${nLegs}, minmax(0,1fr)) 44px`;
  const clearHover = () => {
    setHoverRow(null);
    setHoverCol(null);
  };

  return (
    <section className="relative overflow-hidden bg-ink font-body text-bone">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grain opacity-[0.13] mix-blend-overlay" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="font-mono text-[11px] tracking-[0.14em] text-ash">
            {index && (
              <>
                <span className="text-ember">{index}</span>&nbsp;&nbsp;
              </>
            )}
            {heading}
          </h2>
          {seeAll && (
            <Link
              to="/stats"
              className="font-mono text-[11px] tracking-[0.1em] text-ember transition-colors hover:text-ember-bright"
            >
              SEE ALL SONGS →
            </Link>
          )}
        </div>
        <p className="mb-6 font-mono text-[11px] tracking-[0.04em] text-ash-2">
          Each column is a tour leg, in order — hover to trace, click a song for its history.
        </p>

        <div className="overflow-x-auto">
          <div ref={ref} className={`min-w-[640px] ${revealed ? 'is-revealed' : ''}`} onMouseLeave={clearHover}>
            {/* leg headers */}
            <div className="grid items-end gap-[3px] pb-2" style={{ gridTemplateColumns: cols }}>
              <div />
              {legHeaders.map((h, c) => (
                <div key={c} className="text-center leading-tight">
                  <div className={`font-mono text-[10px] transition-colors ${hoverCol === c ? 'text-ember' : 'text-ash'}`}>
                    {h.region}
                  </div>
                  <div
                    className={`font-mono text-[9px] transition-colors ${hoverCol === c ? 'text-bone-dim' : 'text-ash-2'}`}
                  >
                    {h.when}
                  </div>
                </div>
              ))}
              <div className="text-right font-mono text-[9px] tracking-[0.05em] text-ash-2">PLAYS</div>
            </div>

            {/* rows */}
            <div className="flex flex-col gap-[3px]">
              {heatmap.rows.map((row, r) => {
                const stat = statByTitle.get(row.title);
                const rowActive = hoverRow === r;
                return (
                  <div
                    key={row.title}
                    onClick={stat ? () => setSelectedSong(stat) : undefined}
                    role={stat ? 'button' : undefined}
                    className={`grid items-center gap-[3px] ${stat ? 'cursor-pointer' : ''}`}
                    style={{ gridTemplateColumns: cols }}
                  >
                    <div
                      onMouseEnter={() => {
                        setHoverRow(r);
                        setHoverCol(null);
                      }}
                      className={`truncate text-[12px] transition-colors ${rowActive ? 'text-bone' : 'text-bone-dim'}`}
                    >
                      {row.title}
                    </div>
                    {row.intensity.map((v, c) => {
                      const dim = (hoverRow !== null || hoverCol !== null) && hoverRow !== r && hoverCol !== c;
                      return (
                        <div
                          key={c}
                          onMouseEnter={() => {
                            setHoverRow(r);
                            setHoverCol(c);
                          }}
                          className="hm-cell h-4 rounded-[2px]"
                          style={{
                            background: SHADES[v],
                            border: v === 0 ? '0.5px solid #2a241d' : undefined,
                            animationDelay: `${c * 45}ms`,
                            filter: dim ? 'opacity(0.3)' : 'opacity(1)',
                            transition: 'filter 0.15s ease',
                          }}
                        />
                      );
                    })}
                    <div
                      onMouseEnter={() => {
                        setHoverRow(r);
                        setHoverCol(null);
                      }}
                      className={`text-right font-mono text-[11px] transition-colors ${rowActive ? 'text-bone' : 'text-ash'}`}
                    >
                      {row.total}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* legend */}
        <div className="mt-7 flex items-center gap-2 font-mono text-[11px] text-ash">
          <span>RARELY</span>
          {SHADES.map((s, i) => (
            <span
              key={i}
              className="inline-block h-3 w-4 rounded-[2px]"
              style={{ background: s, border: i === 0 ? '0.5px solid #2a241d' : undefined }}
            />
          ))}
          <span>EVERY NIGHT</span>
        </div>
      </div>

      {/* deep-dive modal */}
      {selectedSong && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedSong(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-line bg-ink-2 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedSong(null)}
              className="absolute right-4 top-4 z-10 text-2xl leading-none text-ash transition-colors hover:text-bone"
              aria-label="Close"
            >
              ×
            </button>
            <SongDetail song={selectedSong} />
          </div>
        </div>
      )}
    </section>
  );
}
