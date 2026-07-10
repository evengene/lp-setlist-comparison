/**
 * Closing Mike Shinoda quote. Rendered site-wide before the footer.
 */
export function QuoteSection() {
  return (
    <div className="border-t border-line py-20">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <p className="font-mono text-base leading-[1.9] tracking-[0.02em] text-bone-dim sm:text-lg">
          "Dream big, work hard, and don't be an a**hole."
        </p>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-ash">
          <span className="text-ember">-</span> Mike Shinoda
        </p>
      </div>
    </div>
  );
}
