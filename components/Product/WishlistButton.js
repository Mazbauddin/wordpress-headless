"use client";

import { useEffect, useState } from "react";

export default function WishlistButton({ productId }) {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/wishlist", { cache: "no-store" })
      .then((r) => r.json())
      .then((items) => {
        if (Array.isArray(items)) setActive(items.includes(Number(productId)));
      })
      .catch(() => {});
  }, [productId]);

  async function toggle() {
    setLoading(true);

    const response = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId })
    });

    if (response.status === 401) {
      window.location.href = "/login";
      return;
    }

    const data = await response.json();
    setActive(data.wishlist?.includes(Number(productId)) || false);
    setLoading(false);
  }

  return (
    <button
      type="button"
      className={`wishlist-button ${active ? "active" : ""}`}
      onClick={toggle}
      disabled={loading}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
    >
      {active ? "♥" : "♡"}
    </button>
  );
}
