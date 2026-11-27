/**
 * Closing Mike Shinoda quote. Rendered site-wide before the footer.
 */
export function QuoteSection() {
  return (
    <div className="border-t border-line py-20">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <p className="font-display text-4xl uppercase text-bone" >
          "Dream big, work hard, <br/> and don't be an a**hole."
        </p>
        <p className="mt-6 font-body text-[11px] uppercase tracking-[0.18em] text-ash">
          <span className="text-ember">-</span> Mike Shinoda
        </p>
      </div>
    </div>
  );
}
