import { Link } from 'react-router-dom';

/**
 * "Who made this" credit and call-to-action linking to the About page.
 * Rendered site-wide before the footer (see App), except on /about itself,
 * where it would be a circular link and duplicates the identity card there.
 */
export function AboutSection() {
  return (
    <div className="border-t border-line">
      <Link
        to="/about"
        aria-label="Behind the project"
        className="group mx-auto flex max-w-7xl flex-col items-center gap-5 px-6 py-12 sm:flex-row sm:justify-between"
      >
        <div className="flex items-center gap-4">
          <img
            src="/lpu_avatar.png"
            alt=""
            aria-hidden="true"
            className="h-16 w-16 shrink-0 rounded-md object-cover"
          />
          <div>
            <div className="font-mono text-[11px] tracking-[0.14em] text-ash">"I couldn't let the tour end."</div>
            <p className="mt-1 text-sm text-bone-dim">
              A developer and LPU member who caught the tour twice - Denver and Seattle.
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-md border border-line px-5 py-3 font-mono text-xs uppercase tracking-widest text-bone-dim transition-colors group-hover:border-ember group-hover:text-ember">
          Behind the project →
        </span>
      </Link>
    </div>
  );
}
