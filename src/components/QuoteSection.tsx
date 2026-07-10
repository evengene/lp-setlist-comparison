/**
 * Closing Mike Shinoda quote. Rendered site-wide before the footer.
 */
export function QuoteSection() {
  return (
    <div className="border-t border-line py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="font-body text-2xl italic text-bone-dim md:text-3xl">
          "Dream big, work hard, and don't be an a**hole."{' '}
          <br/>
          <span className="text-ash">- Mike Shinoda</span>
        </p>
      </div>
    </div>
  );
}
