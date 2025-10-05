import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { fetchPokemon, Pokemon } from "../api/pokemon";

const MIN_ID = 1;
const MAX_ID = 50; // set to the range you load in List/Gallery

const officialImage = (p: Pokemon) =>
  p.sprites?.other?.["official-artwork"]?.front_default || p.sprites?.front_default || "";

export default function DetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentId = Number(id);

  const [data, setData] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setErr(null);
    setData(null);
    (async () => {
      try {
        const p = await fetchPokemon(currentId);
        setData(p);
      } catch {
        setErr("Not found.");
      } finally {
        setLoading(false);
      }
    })();
  }, [currentId]);

  const prevId = useMemo(() => (currentId > MIN_ID ? currentId - 1 : null), [currentId]);
  const nextId = useMemo(() => (currentId < MAX_ID ? currentId + 1 : null), [currentId]);

  if (loading) return <div className="container"><h1>Details</h1><p>Loading…</p></div>;
  if (err || !data) return <div className="container"><h1>Details</h1><p>{err ?? "Error"}</p><Link to="/">Back</Link></div>;

  const img = officialImage(data);
  const typesArr = data.types.map((t) => t.type.name);

  return (
    <div className="container">
      <h1 className="capitalize">{data.name}</h1>

      <div className="detail">
        <img src={img} alt={data.name} className="detail-img" />
        <ul className="detail-list">
          <li><strong>ID:</strong> {data.id}</li>
          <li>
            <strong>Types:</strong>
            <div className="badges">
              {typesArr.map((t) => (
                <span key={t} className="badge capitalize">{t}</span>
              ))}
            </div>
          </li>
          <li><strong>Height:</strong> {data.height}</li>
          <li><strong>Weight:</strong> {data.weight}</li>
        </ul>
      </div>

      <div className="nav-row">
        <button disabled={!prevId} onClick={() => prevId && navigate(`/detail/${prevId}`)}>
          ← Previous
        </button>
        <Link to="/">Back to List</Link>
        <button disabled={!nextId} onClick={() => nextId && navigate(`/detail/${nextId}`)}>
          Next →
        </button>
      </div>
    </div>
  );
}
