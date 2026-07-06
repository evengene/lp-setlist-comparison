import { RefreshCw, Clock } from 'lucide-react';
import { setlistService } from '../services/setlistService.ts';

interface CacheStatusProps {
  onRefresh: () => void;
  loading?: boolean;
}

export function CacheStatus({ onRefresh, loading }: CacheStatusProps) {
  const cacheInfo = setlistService.getCacheInfo();

  if (!cacheInfo.exists) {
    return (
      <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.06em] text-ash">
        <Clock className="h-3 w-3" />
        <span>LOADING FRESH DATA…</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.06em]">
      <div className="flex items-center gap-1.5 text-ash">
        <Clock className="h-3 w-3" />
        <span>DATA FROM {String(cacheInfo.age).toUpperCase()}</span>
        {cacheInfo.valid ? (
          <span className="text-ember">✓ FRESH</span>
        ) : (
          <span className="text-bone-dim">⚠ STALE</span>
        )}
      </div>
      <button
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center gap-1.5 rounded px-2 py-1 text-ash transition-colors hover:text-bone disabled:opacity-50"
        title="Refresh data from Setlist.fm"
      >
        <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
        <span>REFRESH</span>
      </button>
    </div>
  );
}
