import { Link } from 'react-router-dom';

const SHOWS = [
  { city: 'Denver', venue: 'Ball Arena', date: 'Sep 3, 2025', id: '3b5ef070' },
  { city: 'Seattle', venue: 'Climate Pledge Arena', date: 'Sep 24, 2025', id: '235ef043' },
];

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-ink font-body text-bone">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-grain opacity-[0.13] mix-blend-overlay" />
        <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-12">
          <p className="font-mono text-[11px] tracking-[0.22em] text-ash">
            <span className="text-ember">→</span>&nbsp;&nbsp;FROM ZERO WORLD TOUR · ABOUT
          </p>
          <h1 className="mt-4 font-display text-5xl uppercase leading-[0.9] text-bone sm:text-7xl">About</h1>
          <p className="mt-4 max-w-xl font-body italic text-bone-dim">A little about me - and the two shows that inspired it all</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* pass card */}
        <div className="flex flex-col gap-6 rounded-lg border border-line bg-ink-2 p-6 sm:flex-row sm:items-center">
          <div className="relative flex aspect-2/3 w-40 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-line bg-ink">
            <img
              src="/lpu_avatar.png"
              alt="Elina"
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>

          <div className="min-w-0">
            <div className="font-mono text-[10px] tracking-[0.14em] text-ash">// USER</div>
            <div className="font-display text-3xl uppercase leading-none text-bone">Elina S</div>
            <p className="mt-3 font-mono text-[11px] tracking-[0.06em] text-bone-dim">FRONT-END DEVELOPER · LPU MEMBER</p>
            <p className="mt-1 font-mono text-[11px] tracking-[0.06em] text-ash-2">
              <span className="text-ash">DISCORD</span> · @lina_s_55473
            </p>
          </div>
        </div>

        {/* blurb */}
        <p className="mt-8 text-base leading-relaxed text-bone-dim">
          I'm Elina - a front-end developer and LPU member. I caught the From Zero tour twice and built this
          retrospective to relive the whole run the way I wanted to: every setlist, every city, all in one place. Part
          portfolio piece, part love letter to a band I've followed for years.
        </p>

        {/* I was there */}
        <div className="mt-10">
          <h2 className="mb-4 font-mono text-[11px] tracking-[0.14em] text-ash">
            <span className="text-ember">→</span>&nbsp;&nbsp;I WAS THERE
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SHOWS.map((s) => (
              <Link
                key={s.id}
                to={`/your-show?show=${s.id}`}
                className="group flex items-center justify-between rounded-lg border border-line bg-ink-2 p-5 transition-colors hover:border-ember"
              >
                <div>
                  <div className="font-display text-2xl uppercase leading-none text-bone">{s.city}</div>
                  <div className="mt-1.5 font-mono text-[11px] tracking-[0.06em] text-ash">
                    {s.venue} · {s.date}
                  </div>
                </div>
                <span className="shrink-0 font-mono text-[11px] text-ember transition-transform group-hover:translate-x-0.5">
                  RECAP →
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* links */}
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="mailto:evengene@gmail.com"
            className="rounded-md bg-ember px-5 py-3 font-mono text-xs uppercase tracking-widest text-ink transition-colors hover:bg-ember-bright"
          >
            Message me ↗
          </a>
          <a
            href="https://github.com/evengene"
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-line px-5 py-3 font-mono text-xs uppercase tracking-widest text-bone-dim transition-colors hover:border-ember hover:text-ember"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
