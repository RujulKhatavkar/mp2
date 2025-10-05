// simple localStorage cache with TTL
const TTL_MS = Number(process.env.REACT_APP_CACHE_TTL_MS ?? 6 * 60 * 60 * 1000); // 6h
const KEY = "http-cache:";

export function getCached<T>(fullUrl: string): T | null {
  try {
    const raw = localStorage.getItem(KEY + fullUrl);
    if (!raw) return null;
    const { t, d } = JSON.parse(raw) as { t: number; d: T };
    if (Date.now() - t > TTL_MS) return null;
    return d;
  } catch {
    return null;
  }
}

export function setCached(fullUrl: string, data: unknown) {
  try {
    localStorage.setItem(KEY + fullUrl, JSON.stringify({ t: Date.now(), d: data }));
  } catch {
    // ignore quota errors
  }
}
