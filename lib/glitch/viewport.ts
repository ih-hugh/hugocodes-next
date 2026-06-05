/**
 * Pick up to `count` distinct items using an injected RNG (Fisher–Yates partial
 * shuffle on a copy). Deterministic given a deterministic `rng`.
 */
export function pickRandom<T>(items: T[], count: number, rng: () => number): T[] {
  if (count <= 0 || items.length === 0) return [];
  const pool = items.slice();
  const n = Math.min(count, pool.length);
  for (let i = 0; i < n; i++) {
    const j = i + Math.floor(rng() * (pool.length - i));
    const tmp = pool[i];
    pool[i] = pool[j];
    pool[j] = tmp;
  }
  return pool.slice(0, n);
}
