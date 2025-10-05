import { ChangeEvent } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
};

export default function SearchBar({ value, onChange, placeholder, className }: Props) {
  const handle = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value);
  return (
    <input
      type="text"
      value={value}
      onChange={handle}
      placeholder={placeholder ?? "Search…"}
      className={className ?? "input"}
      aria-label="Search"
    />
  );
}
