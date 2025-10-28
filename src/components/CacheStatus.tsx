import { RefreshCw, Clock } from 'lucide-react';
import { setlistFM } from '../services/setlistfm';

interface CacheStatusProps {
  onRefresh: () => void;
  loading?: boolean;
}

export function CacheStatus({ onRefresh, loading }: CacheStatusProps) {
  const cacheInfo = setlistFM.getCacheInfo();

  if (!cacheInfo.exists) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Clock className="w-3 h-3" />
        <span>Loading fresh data...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-xs">
      <div className="flex items-center gap-1 text-gray-500">
        <Clock className="w-3 h-3" />
        <span>Data from {cacheInfo.age}</span>
        {cacheInfo.valid ? (
          <span className="text-emerald-600 font-medium">✓ Fresh</span>
        ) : (
          <span className="text-amber-600 font-medium">⚠ Stale</span>
        )}
      </div>
      <button
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Refresh data from Setlist.fm"
      >
        <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
        <span>Refresh</span>
      </button>
    </div>
  );
}
