"use client";

import { useEffect, useState } from "react";

export default function CartIcon({ onClick }) {
  const [count, setCount] = useState(0);

  async function load() {
    try {
      const r = await fetch("/api/cart", { cache: "no-store" });
      const data = await r.json();
      setCount(data.items_count || 0);
    } catch {
      setCount(0);
    }
  }

  useEffect(() => {
    load();
    window.addEventListener("cart-updated", load);
    return () => window.removeEventListener("cart-updated", load);
  }, []);

  return (
    <button type="button" className="cart-icon" onClick={onClick}>
      Cart <span className="cart-count">{count}</span>
    </button>
  );
}
