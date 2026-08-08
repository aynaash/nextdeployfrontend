"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Drop-in "apps shipped" counter for the hero. Self-contained: fetches
 * /api/stats and animates a count-up. Renders nothing until the value loads, so
 * it never causes layout jank or an SSR/CSR mismatch.
 *
 * Usage (anywhere, incl. inside the client hero):
 *   <ShipCount className="text-sm text-muted-foreground" />
 */
export function ShipCount({ className }: { className?: string }) {
  const [display, setDisplay] = useState<number | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d: { shipped?: number }) => {
        if (!alive) return;
        const target = d.shipped ?? 0;
        const start = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / 800);
          setDisplay(Math.round(target * (1 - Math.pow(1 - p, 3)))); // easeOutCubic
          if (p < 1) raf.current = requestAnimationFrame(tick);
        };
        raf.current = requestAnimationFrame(tick);
      })
      .catch(() => {});
    return () => {
      alive = false;
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  if (display === null) return null;
  return (
    <p className={className}>
      🚀 {display.toLocaleString()} apps shipped with NextDeploy
    </p>
  );
}
