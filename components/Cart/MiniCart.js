"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatMoney } from "@/lib/price";

export default function MiniCart({ open, onClose }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/cart", { cache: "no-store" });
      setCart(await r.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) load();
  }, [open]);

  useEffect(() => {
    const update = () => open && load();
    window.addEventListener("cart-updated", update);
    return () => window.removeEventListener("cart-updated", update);
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <aside className="drawer-panel">
        <div className="drawer-header">
          <h2>Your Cart</h2>
          <button type="button" onClick={onClose}>×</button>
        </div>

        {loading && <p>Loading...</p>}

        {!loading && !cart?.items?.length && (
          <div className="empty-state">
            <p>Your cart is empty.</p>
            <Link href="/shop" onClick={onClose}>Start shopping</Link>
          </div>
        )}

        {!loading && cart?.items?.length > 0 && (
          <>
            <div className="mini-cart-items">
              {cart.items.map((item) => {
                const image = item.images?.[0];
                return (
                  <div className="mini-cart-item" key={item.key}>
                    {image && (
                      <Image
                        src={image.thumbnail || image.src}
                        alt={image.alt || item.name}
                        width={80}
                        height={96}
                      />
                    )}
                    <div>
                      <Link href={`/product/${item.slug}`} onClick={onClose}>{item.name}</Link>
                      <p>{item.quantity} × {formatMoney(item.prices.price, item.prices)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mini-cart-footer">
              <div className="summary-row">
                <span>Total</span>
                <strong>{formatMoney(cart.totals.total_price, cart.totals)}</strong>
              </div>
              <Link className="secondary-button block-button" href="/cart" onClick={onClose}>View Cart</Link>
              <Link className="primary-button block-button" href="/checkout" onClick={onClose}>Checkout</Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
