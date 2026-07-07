import { useMemo } from 'react';
import { getTourData } from '../services/tourDataService';
import { calculateTourStats } from '../utils/setlistStats';
import { useCountUp } from '../hooks/useCountUp';

function Stat({ target, label, accent = false }: { target: number; label: string; accent?: boolean }) {
  const value = useCountUp(target);
  return (
    <div className="bg-ink px-5 py-6">
      <div className={`font-display text-5xl leading-none ${accent ? 'text-ember' : 'text-bone'}`}>
        {value}
      </div>
      <div className="mt-2 font-mono text-[11px] tracking-[0.12em] text-ash">{label}</div>
    </div>
  );
}

export function TourHero() {
  const data = getTourData();

  const { shows, legs, countries, songs } = useMemo(() => {
    const showCount = data.shows.length;
    const legCount = data.legs.length;
    const countryCount = new Set(
      data.shows.map((s) => s.country).filter((c) => c && c !== 'Unknown'),
    ).size;
    const stats = calculateTourStats(data.shows.map((s) => s.setlist as never));

    return {
      shows: showCount,
      legs: legCount,
      countries: countryCount,
      songs: stats.uniqueSongs,
    };
  }, [data]);

  const ghost = Array.from({ length: 12 });

  return (
    <header className="relative overflow-hidden bg-ink font-body text-bone">
      <img
        src="/lp-transparent.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 select-none object-cover object-right opacity-40 [mask-image:linear-gradient(to_right,transparent,black_45%)] md:block"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grain opacity-[0.13] mix-blend-overlay" />

      <div className="relative">
        {/* the one moving element — a slow ghost watermark of the tour name */}
        <div className="overflow-hidden border-b border-line py-3">
          <div
            className="marquee-anim inline-flex whitespace-nowrap will-change-transform"
            style={{ animation: 'marquee 90s linear infinite' }}
          >
            {ghost.map((_, i) => (
              <span
                key={i}
                className="font-display text-[32px] uppercase leading-none tracking-wide text-bone/8"
              >
                From Zero World Tour
                <span className="px-5 text-ember">✷</span>
              </span>
            ))}
          </div>
        </div>

        {/* headline */}
        <div className="mx-auto max-w-7xl px-6 pt-12">
          <p className="font-mono text-[11px] tracking-[0.22em] text-ash">
            <span className="text-ember">①</span>&nbsp;&nbsp;AN INTERACTIVE RETROSPECTIVE · 2024–26
          </p>

          <h1 className="mt-4 font-display text-[64px] uppercase leading-[0.82] tracking-[0.01em] text-bone sm:text-[104px]">
            Linkin<br />Park
          </h1>

          <p className="mt-5 max-w-xl font-body text-lg font-semibold italic text-bone-dim">
            Every setlist, every city, one era —{' '}
            <span className="text-ember">the whole From Zero World Tour, mapped.</span>
          </p>
        </div>

        {/* stats */}
        <div className="mx-auto mt-12 mb-12 grid max-w-7xl grid-cols-2 gap-px bg-line md:grid-cols-4">
          <Stat target={shows} label="SHOWS" />
          <Stat target={legs} label="LEGS" />
          <Stat target={countries} label="COUNTRIES" />
          <Stat target={songs} label="SONGS" accent />
        </div>
      </div>
    </header>
  );
}
