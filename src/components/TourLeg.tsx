

type PropTypes = {
  legId: number;
  onClick: () => void;
  selectedLeg: number | null;
}

export const TourLeg = (props: PropTypes) => {

  const { legId, onClick, selectedLeg } = props;

  return (
    <button
      onClick={onClick}
      className={`group relative aspect-square rounded-xl overflow-hidden transition-all ${
        selectedLeg === legId
          ? 'ring-4 ring-slate-600 shadow-lg'
          : 'hover:ring-2 hover:ring-gray-300'
      }`}
    >
      {/* Image with grayscale → color effect */}
      <img
        src={`/tour-images/leg-${legId}.jpg`}
        alt={`Leg ${legId}`}
        className={`absolute inset-0 w-full h-full object-cover transition-all ${
          selectedLeg === legId
            ? 'grayscale-0'
            : 'grayscale group-hover:grayscale-0'
        }`}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all"></div>
      {/* Label */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-linear-to-t from-black/80 to-transparent">
        <div className="text-white text-xs font-bold">Leg {legId}</div>
        <div className="text-white/80 text-xs">{legId}</div>
      </div>
    </button>
  )
}