import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import SortControls, { SortKey } from "../components/SortControls";
import { fetchPokemonPage, PokemonListItem } from "../api/pokemon";

const idFromUrl = (url: string) => Number(url.split("/").filter(Boolean).pop());

export default function ListView() {
  const [rows, setRows] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const page = await fetchPokemonPage(0, 50);
        setRows(page.results);
      } catch {
        setErr("Failed to load data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);



  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const items = useMemo(() => {
    const base = rows
      .filter(r => r.name.toLowerCase().includes(q.toLowerCase()))
      .map(r => ({ id: idFromUrl(r.url), name: r.name }));
    base.sort((a, b) => {
      const A = sortBy === "name" ? a.name : a.id;
      const B = sortBy === "name" ? b.name : b.id;
      const cmp = A > B ? 1 : A < B ? -1 : 0;
      return order === "asc" ? cmp : -cmp;
    });
    return base;
  }, [rows, q, sortBy, order]);

  if (loading) return <div className="container"><h1>List View</h1><p>Loading…</p></div>;
  if (err)      return <div className="container"><h1>List View</h1><p>{err}</p></div>;

  return (
    <div className="container">
      <h1 className="pk">PokéFinder</h1>
      <h1>List View</h1>
      <SearchBar value={q} onChange={setQ} />
      <SortControls sortBy={sortBy} setSortBy={setSortBy} order={order} setOrder={setOrder} />
      <ul className="list">
        {items.map(i => (<li key={i.id}><Link to={`/detail/${i.id}`}>{i.name}</Link></li>))}
      </ul>
    </div>
  );
}
