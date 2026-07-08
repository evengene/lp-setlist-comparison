import { useMemo } from 'react';
import { getTourData } from '../services/tourDataService';
import { songLegBreakdown } from '../utils/heatmap';
import type { SongStats } from '../utils/setlistStats';

const SHADES = ['#17140f', 'rgba(226,83,29,0.30)', 'rgba(226,83,29,0.55)', 'rgba(226,83,29,0.80)', '#e2531d'];

const BADGE: Record<string, string> = {
  staple: 'bg-ember text-ink',
  rotation: 'bg-ember/20 text-ember-bright',
  rare: 'border border-ember/50 text-ember',
  'deep-cut': 'border border-line text-ash',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function fmtDate(d?: string): string {
  if (!d) return '-';
  const [dd, mm, yyyy] = d.split('-');
  return `${parseInt(dd, 10)} ${MONTHS[parseInt(mm, 10) - 1] ?? mm} ${yyyy}`;
}

export function SongDetail({ song }: { song: SongStats }) {
  const data = getTourData();
  const bd = useMemo(() => songLegBreakdown(data, song.title), [data, song.title]);

  const totalShows = bd.showsPerLeg.reduce((a, b) => a + b, 0);
  const pct = totalShows ? Math.round((bd.total / totalShows) * 100) : 0;
  const everyShow = totalShows > 0 && bd.total >= totalShows;

  return (
    <div>
      {/* header */}
      <div className="flex items-end gap-5">
        {song.coverUrl ? (
          <img
            src={song.coverUrl}
            alt={song.album ?? song.title}
            className="h-24 w-24 shrink-0 rounded object-cover"
          />
        ) : (
          <div className="h-24 w-24 shrink-0 rounded bg-ink" />
        )}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-[3px] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] ${
                BADGE[song.category] ?? 'border border-line text-ash'
              }`}
            >
              {song.category.replace('-', ' ')}
            </span>
            {song.album && song.year && (
              <span className="font-mono text-[10px] tracking-[0.06em] text-ash">
                {song.album} · {song.year}
              </span>
            )}
          </div>
          <h2 className="mt-2 font-display text-4xl uppercase leading-[0.9] text-bone">{song.title}</h2>
        </div>
      </div>

      {/* stats */}
      <div className="mt-6 grid grid-cols-3 gap-px bg-line">
        <div className="bg-ink-2 px-4 py-4">
          <div className="font-display text-3xl leading-none text-bone">{bd.total}</div>
          <div className="mt-1.5 font-mono text-[10px] tracking-[0.1em] text-ash">PLAYS</div>
        </div>
        <div className="bg-ink-2 px-4 py-4">
          <div className="font-display text-3xl leading-none text-ember">{pct}%</div>
          <div className="mt-1.5 font-mono text-[10px] tracking-[0.1em] text-ash">OF SHOWS</div>
        </div>
        <div className="bg-ink-2 px-4 py-4">
          <div className="font-display text-3xl leading-none text-bone">{song.positionRange ?? '-'}</div>
          <div className="mt-1.5 font-mono text-[10px] tracking-[0.1em] text-ash">TYPICAL SLOT</div>
        </div>
      </div>

      {/* across the tour */}
      <div className="mt-6">
        <div className="mb-3 font-mono text-[11px] tracking-[0.14em] text-ash">
          <span className="text-ember">→</span>&nbsp;&nbsp;ACROSS THE TOUR
        </div>
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${bd.legIds.length}, minmax(0,1fr))` }}>
          {bd.intensity.map((v, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div
                className="h-8 w-full rounded-[2px]"
                style={{ background: SHADES[v], border: v === 0 ? '0.5px solid #2a241d' : undefined }}
                title={`Leg ${bd.legIds[i]} - ${bd.perLeg[i]}/${bd.showsPerLeg[i]} shows`}
              />
              <div className="font-mono text-[9px] text-ash-2">{bd.legLabels[i]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* footnote */}
      <div className="mt-5 font-mono text-[11px] tracking-[0.06em] text-bone-dim">
        {everyShow ? (
          <>
            PLAYED AT <span className="text-ember">EVERY</span> SHOW ON THE TOUR.
          </>
        ) : bd.lastCity ? (
          <>
            LAST PLAYED - <span className="text-bone">{bd.lastCity.toUpperCase()}</span> · {fmtDate(bd.lastDate)}
          </>
        ) : null}
      </div>
    </div>
  );
}
