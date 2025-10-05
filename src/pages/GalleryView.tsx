import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import GalleryFilters from "../components/GalleryFilters";
import { fetchPokemonPage, fetchPokemon, Pokemon } from "../api/pokemon";

const officialImage = (p: Pokemon) =>
  p.sprites?.other?.["official-artwork"]?.front_default || p.sprites?.front_default || "";

type GalleryItem = { id: number; name: string; image: string; types: string[] };

async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, idx: number) => Promise<R>
): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const idx = i++;
      if (idx >= items.length) return;
      out[idx] = await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
  return out;
}

export default function GalleryView() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const page = await fetchPokemonPage(0, 48);
        const details = await mapLimit(page.results, 8, async (r) => fetchPokemon(r.name));
        setItems(
          details.map((p) => ({
            id: p.id,
            name: p.name,
            image: officialImage(p),
            types: p.types.map((t) => t.type.name),
          }))
        );
      } catch {
        setErr("Failed to load gallery.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const allTypes = useMemo(
    () => Array.from(new Set(items.flatMap((i) => i.types))).sort(),
    [items]
  );

  const toggle = (t: string) =>
    setSelected((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));

  const filtered = useMemo(() => {
    if (!selected.length) return items;
    const set = new Set(selected);
    return items.filter((i) => i.types.some((t) => set.has(t)));
  }, [items, selected]);

  if (loading) return <div className="container"><h1>Gallery View</h1><p>Loading…</p></div>;
  if (err)      return <div className="container"><h1>Gallery View</h1><p>{err}</p></div>;

  return (
    <div className="container">
      <h1 className="pk">PokéFinder</h1>
      <h1>Gallery View</h1>
      <p className="muted">Filter by type. Click a card to open details.</p>

      <GalleryFilters
        options={allTypes}
        selected={selected}
        toggle={toggle}
        onClear={() => setSelected([])}
        label="Types"
      />

      <div className="grid gallery-grid">
        {filtered.map((i) => (
          <Link key={i.id} to={`/detail/${i.id}`} className="card">
            <img src={i.image} alt={i.name} className="thumb" loading="lazy" />
            <div className="card-title capitalize">{i.name}</div>
            <div className="muted">{i.types.join(" / ")}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
