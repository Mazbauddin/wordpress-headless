"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatProductPrice } from "@/lib/price";

export default function SearchDrawer({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setProducts([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        setProducts(await r.json());
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  if (!open) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <aside className="drawer-panel">
        <div className="drawer-header">
          <h2>Search</h2>
          <button type="button" onClick={onClose}>×</button>
        </div>

        <input
          className="search-input"
          autoFocus
          type="search"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {loading && <p>Searching...</p>}

        <div className="search-results">
          {products.map((product) => {
            const image = product.images?.[0];
            return (
              <Link
                className="search-result"
                key={product.id}
                href={`/product/${product.slug}`}
                onClick={onClose}
              >
                {image && (
                  <Image
                    src={image.thumbnail || image.src}
                    alt={image.alt || product.name}
                    width={70}
                    height={80}
                  />
                )}
                <div>
                  <strong>{product.name}</strong>
                  <span>{formatProductPrice(product.prices)}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {query && (
          <Link className="view-results-link" href={`/search?q=${encodeURIComponent(query)}`} onClick={onClose}>
            View all results
          </Link>
        )}
      </aside>
    </>
  );
}
