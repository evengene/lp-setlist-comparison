import { useState, useEffect, useMemo } from 'react';

import { getTourData } from '../services/tourDataService';
import { processSetlist, compareShows } from '../utils/setlistHelpers.ts';

import { ShowCard } from "../components/ShowCard.tsx";
import { ShareButton } from "../components/ShareButton.tsx";

import type { ComparisonStats, Setlist, Show } from "../types/setlist.ts";

function ShowSelect({
  label,
  value,
  onChange,
  shows,
  venue,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  shows: Show[];
  venue?: string;
}) {
  return (
    <div className="rounded-lg border border-line bg-ink-2 p-6">
      <label className="mb-3 block font-mono text-[11px] uppercase tracking-[0.14em] text-ash">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-md border border-line bg-ink px-4 py-3 pr-12 font-body text-base font-semibold text-bone transition-colors hover:border-ash-2 focus:border-ember focus:outline-none"
        >
          {shows.map((show) => (
            <option key={show.id} value={show.id} className="bg-ink text-bone">
              {show.name} - {show.date}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
          <svg className="h-5 w-5 text-ash" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {venue && <div className="mt-2 font-mono text-[11px] tracking-[0.04em] text-ash">{venue}</div>}
    </div>
  );
}

function StatCard({ value, label, accent = false }: { value: string | number; label: string; accent?: boolean }) {
  return (
    <div className="bg-ink px-8 py-10 text-center">
      <div className={`font-display text-5xl leading-none ${accent ? 'text-ember' : 'text-bone'}`}>{value}</div>
      <div className="mt-3 font-mono text-[11px] tracking-[0.1em] text-ash">{label}</div>
    </div>
  );
}

export const ComparisonPage = () => {
  // Every From Zero show, straight from bundled local data — no API, no key.
  const shows = useMemo<Show[]>(() => {
    const data = getTourData();
    return data.shows
      .map((s) => processSetlist(s.setlist as unknown as Setlist))
      .filter((show) => show.setlist.totalSongs > 0);
  }, []);

  const [selectedShow1, setSelectedShow1] = useState<string>(() => shows[1]?.id ?? '');
  const [selectedShow2, setSelectedShow2] = useState<string>(() => shows[0]?.id ?? '');

  // Keep the URL in sync so a comparison is shareable
  useEffect(() => {
    if (selectedShow1 && selectedShow2) {
      window.history.pushState({}, '', `${window.location.pathname}?show1=${selectedShow1}&show2=${selectedShow2}`);
    }
  }, [selectedShow1, selectedShow2]);

  const { show1, show2, comparisonStats } = useMemo(() => {
    const s1 = shows.find((s) => s.id === selectedShow1);
    const s2 = shows.find((s) => s.id === selectedShow2);
    let stats: ComparisonStats | null = null;
    if (s1 && s2) stats = compareShows(s1, s2).stats;
    return { show1: s1, show2: s2, comparisonStats: stats };
  }, [shows, selectedShow1, selectedShow2]);

  return (
    <div className="min-h-screen bg-ink font-body text-bone">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-grain opacity-[0.13] mix-blend-overlay" />
        <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-12">
          <p className="font-mono text-[11px] tracking-[0.22em] text-ash">
            <span className="text-ember">→</span>&nbsp;&nbsp;FROM ZERO WORLD TOUR · COMPARE
          </p>
          <h1 className="mt-4 font-display text-5xl uppercase leading-[0.9] text-bone sm:text-7xl">Setlist Comparison</h1>
          <p className="mt-4 max-w-xl font-body italic text-bone-dim">
            Compare any two shows side by side to see what stayed the same - and what made each night unique.          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Selectors */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ShowSelect label="First Show" value={selectedShow1} onChange={setSelectedShow1} shows={shows} venue={show1?.venue} />
          <ShowSelect label="Second Show" value={selectedShow2} onChange={setSelectedShow2} shows={shows} venue={show2?.venue} />
        </div>

        {/* Stats */}
        {comparisonStats && (
          <div className="mt-10 grid grid-cols-1 gap-px bg-line md:grid-cols-3">
            <StatCard value={`${comparisonStats.similarityPercent}%`} label="SETLIST SIMILARITY" accent />
            <StatCard value={comparisonStats.sharedCount} label="SONGS IN BOTH" />
            <StatCard value={comparisonStats.uniqueCount} label="UNIQUE SONGS TOTAL" />
          </div>
        )}

        {show1 && show2 && (
          <>
            {/* Downloadable container */}
            <div id="comparison-container" className="mt-10 rounded-lg bg-ink p-6">
              <div className="mb-6 text-center">
                <h2 className="font-display text-2xl uppercase text-bone">Linkin Park · Setlist Comparison</h2>
                <p className="mt-1 font-mono text-[11px] tracking-[0.1em] text-ash">FROM ZERO WORLD TOUR</p>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ShowCard show={show1} />
                <ShowCard show={show2} />
              </div>

              <div className="mt-6 text-center font-mono text-[11px] tracking-[0.1em] text-ash-2">lpsetlists.com</div>
            </div>

            <div className="mt-8 text-center">
              <ShareButton show1={show1} show2={show2} />
            </div>
          </>
        )}

        {/* Legend */}
        <div className="mt-12 rounded-lg border border-line bg-ink-2 p-8">
          <h4 className="mb-6 font-mono text-[11px] uppercase tracking-[0.14em] text-ash">Color guide</h4>
          <div className="flex flex-wrap gap-10">
            <div className="flex min-w-[240px] flex-1 items-center gap-4">
              <div className="h-10 w-10 shrink-0 rounded border border-ember/40 bg-ember/10" />
              <div>
                <div className="font-semibold text-bone">Unique to this show</div>
                <div className="text-sm text-ash">Rotating songs and special moments</div>
              </div>
            </div>
            <div className="flex min-w-[240px] flex-1 items-center gap-4">
              <div className="h-10 w-10 shrink-0 rounded border border-line bg-ink" />
              <div>
                <div className="font-semibold text-bone-dim">Played in both shows</div>
                <div className="text-sm text-ash">Tour staples and shared songs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
