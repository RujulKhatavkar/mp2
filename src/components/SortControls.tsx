export type SortKey = "name" | "id";

type Props = {
  sortBy: SortKey;
  setSortBy: (k: SortKey) => void;
  order: "asc" | "desc";
  setOrder: (o: "asc" | "desc") => void;
  className?: string;
};

export default function SortControls({
  sortBy,
  setSortBy,
  order,
  setOrder,
  className,
}: Props) {
  return (
    <div className={className ?? "sort-row"}>
      <label>
        Sort by{" "}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          aria-label="Sort key"
        >
          <option value="name">Name</option>
          <option value="id">ID</option>
        </select>
      </label>

      <button
        type="button"
        onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
        aria-label="Toggle sort order"
      >
        {order === "asc" ? "Asc ↑" : "Desc ↓"}
      </button>
    </div>
  );
}
