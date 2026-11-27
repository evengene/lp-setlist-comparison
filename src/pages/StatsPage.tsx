import { getTourData } from '../services/tourDataService';
import { calculateTourStats } from '../utils/setlistStats';
import { HomeHeatmap } from '../components/HomeHeatmap';
import { PageHeader } from '../components/PageHeader';

function Metric({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="bg-ink px-5 py-6">
      <div className="font-display text-4xl leading-none text-bone sm:text-5xl">{value}</div>
      <div className="mt-2 font-mono text-[10px] tracking-widest text-ash">{label}</div>
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

  // Rarely played
  const rarest = [...allSongs]
    .filter((s) => s.timesPlayed > 1)
    .sort((a, b) => a.timesPlayed - b.timesPlayed)
    .slice(0, 5);
  const rarestMax = rarest.length ? rarest[rarest.length - 1].timesPlayed : 1;

  return (
    <div className="min-h-screen bg-ink font-body text-bone">
      <PageHeader
        eyebrow="From Zero World Tour · Stats"
        title="Stats"
        description="A more detailed look at the tour."
      />

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
      <HomeHeatmap limit={999} index="01." heading="ALL SONGS" seeAll={false} />

      {/* Superlatives */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Most played */}
          <div>
            <h2 className="type-section-title mb-5 text-bone-dim">
              <span className="mr-1 text-ember">02.</span>{' '}MOST PLAYED{' '}
              <span className="text-ash-2">({mostPlayed.length})</span>
            </h2>
            <div className="flex flex-col gap-2.5">
              {mostPlayed.map((s) => (
                <div key={s.title} className="flex items-center gap-3">
                  <span className="w-32 shrink-0 truncate text-[13px] text-bone-dim">{s.title}</span>
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

          {/* Rarely played */}
          <div>
            <h2 className="type-section-title mb-5 text-bone-dim">
              <span className="mr-1 text-ember">03.</span>{' '}RARELY PLAYED{' '}
              <span className="text-ash-2">({rarest.length})</span>
            </h2>
            <div className="flex flex-col gap-2.5">
              {rarest.map((s) => (
                <div key={s.title} className="flex items-center gap-3">
                  <span className="w-32 shrink-0 truncate text-[13px] text-bone-dim">{s.title}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-ink-2">
                    <span
                      className="block h-full bg-ember"
                      style={{ width: `${Math.round((s.timesPlayed / rarestMax) * 100)}%` }}
                    />
                  </span>
                  <span className="w-10 text-right font-mono text-[12px] text-ash">{s.timesPlayed}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Played once */}
          <div>
            <h2 className="type-section-title mb-5 text-bone-dim">
              <span className="mr-1 text-ember">04.</span>{' '}PLAYED JUST ONCE{' '}
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
