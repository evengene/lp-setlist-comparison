type PropTypes = {
  legId: number;
  onClick: () => void;
  selectedLeg: number | null;
  region: string;
};

export const TourLeg = (props: PropTypes) => {
  const { legId, onClick, selectedLeg, region } = props;
  const active = selectedLeg === legId;

  return (
    <button
      onClick={onClick}
      className={`group relative aspect-square overflow-hidden rounded-sm transition-all ${
        active ? 'ring-2 ring-ember' : 'ring-1 ring-line hover:ring-ash-2'
      }`}
    >
      <img
        src={`/tour-images/leg-${legId}.jpg`}
        alt={`Leg ${legId} — ${region}`}
        className={`absolute inset-0 h-full w-full object-cover transition-all ${
          active ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'
        }`}
      />
      <div className="absolute inset-0 bg-ink/40 transition-all group-hover:bg-ink/20" />
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink to-transparent p-2">
        <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-bone">Leg {legId}</div>
        <div className="truncate text-[11px] text-bone-dim">{region}</div>
      </div>
    </button>
  );
};
