import React from "react";
import styles from "./GalleryFilters.module.css";

type Props = {
  options: string[];
  selected: string[];
  toggle: (v: string) => void;
  onClear?: () => void; // optional: show a Clear button if provided
  label?: string;       // optional: section label (e.g., "Types")
};

export default function GalleryFilters({
  options,
  selected,
  toggle,
  onClear,
  label = "Filters",
}: Props) {
  return (
    <section className={styles.wrapper} aria-label={label}>
      <div className={styles.row}>
        <h2 className={styles.title}>{label}</h2>
        {onClear && selected.length > 0 && (
          <button type="button" className={styles.clearBtn} onClick={onClear}>
            Clear
          </button>
        )}
      </div>

      <div className={styles.filters} role="group" aria-label={label}>
        {options.map((opt) => {
          const checked = selected.includes(opt);
          const id = `filter-${opt}`;
          return (
            <label
              key={opt}
              htmlFor={id}
              className={`${styles.chip} ${checked ? styles.active : ""}`}
            >
              <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={() => toggle(opt)}
                className={styles.checkbox}
              />
              <span className={styles.text}>{opt}</span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
