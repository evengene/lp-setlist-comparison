import { getTourData } from '../services/tourDataService';
import { calculateTourStats } from '../utils/setlistStats';
import { HomeHeatmap } from '../components/HomeHeatmap';

function Metric({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="bg-ink px-5 py-6">
      <div className="font-display text-4xl leading-none text-bone sm:text-5xl">{value}</div>
      <div className="mt-2 font-mono text-[10px] tracking-[0.1em] text-ash">{label}</div>
    </div>
  );
}

export const StatsPage = () => {
  const data = getTourData();
  const stats = calculateTourStats(data.shows.map((s) => s.setlist as never));

  const shows = data.shows.length;
  const legs = data.legs.length;
  const countries = new Set(data.shows.map((s) => s.country).filter((c) => c && c !== 'Unknown')).size;

  const allSongs = stats.allSongs ?? [];
  const songsPerformed = allSongs.reduce((a, s) => a + s.timesPlayed, 0);
  const oneOffs = allSongs.filter((s) => s.timesPlayed === 1);
  const mostPlayed = allSongs.slice(0, 8);
  const maxPlayed = mostPlayed[0]?.timesPlayed ?? 1;

  return (
    <div className="min-h-screen bg-ink font-body text-bone">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-grain opacity-[0.13] mix-blend-overlay" />
        <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-12">
          <p className="font-mono text-[11px] tracking-[0.22em] text-ash">
            <span className="text-ember">→</span>&nbsp;&nbsp;FROM ZERO WORLD TOUR · STATS
          </p>
          <h1 className="mt-4 font-display text-5xl uppercase leading-[0.9] text-bone sm:text-7xl">Stats</h1>
          <p className="mt-4 max-w-xl font-body italic text-bone-dim">
            Every song, every stop - the whole tour, counted.
          </p>
        </div>
      </div>

      {/* By the numbers */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-6">
          <Metric value={shows} label="SHOWS" />
          <Metric value={legs} label="LEGS" />
          <Metric value={countries} label="COUNTRIES" />
          <Metric value={stats.uniqueSongs} label="UNIQUE SONGS" />
          <Metric value={songsPerformed} label="SONGS PERFORMED" />
          <Metric value={oneOffs.length} label="SONGS PLAYED ONCE" />
        </div>
      </div>

      {/* Full heatmap */}
      <HomeHeatmap limit={999} index="01." heading="EVERY SONG, EVERY STOP" seeAll={false} />

      {/* Superlatives */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Most played */}
          <div>
            <h2 className="mb-5 font-mono text-[11px] tracking-[0.14em] text-ash">
              <span className="text-ember">02.</span>&nbsp;&nbsp;MOST PLAYED
            </h2>
            <div className="flex flex-col gap-2.5">
              {mostPlayed.map((s) => (
                <div key={s.title} className="flex items-center gap-3">
                  <span className="w-40 shrink-0 truncate text-[13px] text-bone-dim">{s.title}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-ink-2">
                    <span
                      className="block h-full bg-ember"
                      style={{ width: `${Math.round((s.timesPlayed / maxPlayed) * 100)}%` }}
                    />
                  </span>
                  <span className="w-10 text-right font-mono text-[12px] text-ash">{s.timesPlayed}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Played once */}
          <div>
            <h2 className="mb-5 font-mono text-[11px] tracking-[0.14em] text-ash">
              <span className="text-ember">03.</span>&nbsp;&nbsp;PLAYED JUST ONCE{' '}
              <span className="text-ash-2">({oneOffs.length})</span>
            </h2>
            {oneOffs.length ? (
              <div className="flex flex-wrap gap-2">
                {oneOffs.map((s) => (
                  <span
                    key={s.title}
                    className="rounded-[3px] border border-ember/40 px-2.5 py-1 font-mono text-[11px] text-ember"
                  >
                    {s.title}
                  </span>
                ))}
              </div>
            ) : (
              <p className="font-mono text-[11px] tracking-[0.06em] text-ash">NONE - EVERY SONG CAME BACK.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
