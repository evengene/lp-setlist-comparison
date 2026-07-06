import { useEffect, useState } from 'react';

/**
 * Animates a number from 0 up to `target` once, using an ease-out curve.
 * Returns the current (rounded) value to render.
 *
 * No "already started" ref guard on purpose: under React StrictMode the effect
 * runs → cleans up → runs again, and a guard would let the first run's frame get
 * cancelled and then block the restart, freezing the value at 0.
 */
export function useCountUp(target: number, duration = 5000, enabled = true): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    let raf = 0;
    let t0: number | null = null;

    const tick = (t: number) => {
      if (t0 === null) t0 = t;
      const p = Math.min(1, (t - t0) / duration);
      // ease-out cubic
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, enabled]);

  return value;
}
