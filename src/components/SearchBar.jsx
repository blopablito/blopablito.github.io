import { useCallback, useState } from "react";

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Buscar recetas o ingredientes",
  className = "",
}) {
  const [local, setLocal] = useState(value || "");

  const submit = useCallback((e) => {
    e.preventDefault();
    onSubmit?.(local);
  }, [local, onSubmit]);

  return (
    <form className={`searchbar ${className}`} onSubmit={submit} role="search">
      <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>

      <input
        type="search"
        value={local}
        onChange={(e) => { setLocal(e.target.value); onChange?.(e.target.value); }}
        placeholder={placeholder}
        aria-label="Buscar"
      />

      <button type="submit" className="btn" aria-label="Buscar">
        Buscar
      </button>
    </form>
  );
}
