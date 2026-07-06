import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTourData } from '../services/tourDataService';
import { buildHeatmap } from '../utils/heatmap';

const SHADES = ['#17140f', 'rgba(226,83,29,0.30)', 'rgba(226,83,29,0.55)', 'rgba(226,83,29,0.80)', '#e2531d'];

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

  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

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
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cols = `minmax(120px,1.6fr) repeat(${heatmap.legIds.length}, minmax(0,1fr)) 44px`;

  return (
    <section className="relative overflow-hidden bg-ink font-body text-bone">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grain opacity-[0.13] mix-blend-overlay" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="mb-6 flex items-baseline justify-between">
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

        <div ref={ref} className={revealed ? 'is-revealed' : undefined}>
          {/* leg labels */}
          <div className="grid items-center gap-[3px]" style={{ gridTemplateColumns: cols }}>
            <div />
            {heatmap.legLabels.map((l) => (
              <div key={l} className="text-center font-mono text-[10px] text-ash-2">
                {l}
              </div>
            ))}
            <div className="text-right font-mono text-[9px] tracking-[0.05em] text-ash-2">PLAYS</div>
          </div>

          {/* rows */}
          <div className="mt-1 flex flex-col gap-[3px]">
            {heatmap.rows.map((row) => (
              <div key={row.title} className="grid items-center gap-[3px]" style={{ gridTemplateColumns: cols }}>
                <div className="truncate text-[12px] text-bone-dim">{row.title}</div>
                {row.intensity.map((v, i) => (
                  <div
                    key={i}
                    className="hm-cell h-4 rounded-[2px]"
                    style={{
                      background: SHADES[v],
                      border: v === 0 ? '0.5px solid #2a241d' : undefined,
                      animationDelay: `${i * 45}ms`,
                    }}
                  />
                ))}
                <div className="text-right font-mono text-[11px] text-ash">{row.total}</div>
              </div>
            ))}
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
    </section>
  );
}
