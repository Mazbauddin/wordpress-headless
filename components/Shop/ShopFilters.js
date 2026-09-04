"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ShopFilters({ attributes = [], afterChange }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(name, value) {
    const params = new URLSearchParams(searchParams.toString());

    if (value !== "" && value !== null && value !== undefined) params.set(name, String(value));
    else params.delete(name);

    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
    afterChange?.();
  }

  function clear() {
    router.push(pathname);
    afterChange?.();
  }

  return (
    <aside className="shop-filters">
      <div className="filter-heading">
        <h2>Filters</h2>
        <button className="link-button" type="button" onClick={clear}>Clear</button>
      </div>

      <div className="filter-group">
        <h3>Price</h3>
        <input type="number" min="0" placeholder="Min" defaultValue={searchParams.get("min") || ""} onBlur={(e) => update("min", e.target.value)} />
        <input type="number" min="0" placeholder="Max" defaultValue={searchParams.get("max") || ""} onBlur={(e) => update("max", e.target.value)} />
      </div>

      {attributes.map((attribute) => {
        const queryName =
          attribute.taxonomy === "pa_color"
            ? "color"
            : attribute.taxonomy === "pa_size"
              ? "size"
              : null;

        if (!queryName) return null;

        return (
          <div className="filter-group" key={attribute.id}>
            <h3>{attribute.name}</h3>
            {attribute.terms.map((term) => (
              <label className="filter-option" key={term.id}>
                <input
                  type="radio"
                  name={queryName}
                  checked={searchParams.get(queryName) === term.slug}
                  onChange={() => update(queryName, term.slug)}
                />
                <span>{term.name}</span>
              </label>
            ))}
          </div>
        );
      })}

      <div className="filter-group">
        <label className="filter-option">
          <input
            type="checkbox"
            checked={searchParams.get("sale") === "true"}
            onChange={(e) => update("sale", e.target.checked ? "true" : "")}
          />
          <span>On Sale</span>
        </label>
      </div>

      <div className="filter-group">
        <h3>Rating</h3>
        {[5,4,3].map((n) => (
          <label className="filter-option" key={n}>
            <input
              type="radio"
              name="rating"
              checked={searchParams.get("rating") === String(n)}
              onChange={() => update("rating", n)}
            />
            <span>{n}★ & up</span>
          </label>
        ))}
      </div>
    </aside>
  );
}
