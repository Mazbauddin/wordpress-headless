"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatMoney } from "@/lib/price";
import CouponForm from "./CouponForm";

export default function CartPageClient() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState("");

  async function load() {
    try {
      const r = await fetch("/api/cart", { cache: "no-store" });
      setCart(await r.json());
    } finally {
      setLoading(false);
    }
  }

  async function updateQuantity(key, quantity) {
    setUpdating(key);

    const r = await fetch("/api/cart/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, quantity })
    });

    const data = await r.json();
    if (r.ok) {
      setCart(data);
      window.dispatchEvent(new Event("cart-updated"));
    }
    setUpdating("");
  }

  async function remove(key) {
    setUpdating(key);

    const r = await fetch("/api/cart/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key })
    });

    const data = await r.json();
    if (r.ok) {
      setCart(data);
      window.dispatchEvent(new Event("cart-updated"));
    }
    setUpdating("");
  }

  useEffect(() => { load(); }, []);

  if (loading) return <section className="container page-section">Loading cart...</section>;

  if (!cart?.items?.length) {
    return (
      <section className="container empty-state large-empty-state">
        <h1>Your cart is empty</h1>
        <Link className="primary-button" href="/shop">Continue shopping</Link>
      </section>
    );
  }

  return (
    <section className="container cart-page">
      <h1>Shopping Cart</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map((item) => {
            const image = item.images?.[0];
            const limits = item.quantity_limits || {
              minimum: 1, maximum: 9999, multiple_of: 1, editable: true
            };
            const step = Number(limits.multiple_of || 1);
            const canDecrease =
              limits.editable && Number(item.quantity) - step >= Number(limits.minimum);
            const canIncrease =
              limits.editable && Number(item.quantity) + step <= Number(limits.maximum);

            return (
              <article className="cart-item" key={item.key}>
                <div className="cart-item-image">
                  {image && (
                    <Image
                      src={image.thumbnail || image.src}
                      alt={image.alt || item.name}
                      width={120}
                      height={140}
                    />
                  )}
                </div>

                <div>
                  <Link href={`/product/${item.slug}`}><h3>{item.name}</h3></Link>

                  {item.variation?.length > 0 && (
                    <div className="cart-variations">
                      {item.variation.map((a) => (
                        <span key={`${a.attribute}-${a.value}`}>{a.attribute}: {a.value}</span>
                      ))}
                    </div>
                  )}

                  <p>{formatMoney(item.prices.price, item.prices)}</p>

                  {limits.editable !== false ? (
                    <div className="quantity-control">
                      <button
                        type="button"
                        disabled={updating === item.key || !canDecrease}
                        onClick={() => updateQuantity(item.key, item.quantity - step)}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        disabled={updating === item.key || !canIncrease}
                        onClick={() => updateQuantity(item.key, item.quantity + step)}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <p>Quantity: {item.quantity}</p>
                  )}

                  <button className="link-button" type="button" onClick={() => remove(item.key)}>
                    Remove
                  </button>
                </div>

                <strong className="cart-line-total">
                  {formatMoney(item.totals.line_total, item.totals)}
                </strong>
              </article>
            );
          })}
        </div>

        <aside className="cart-summary">
          <h2>Order Summary</h2>
          <CouponForm onUpdate={setCart} />

          <div className="summary-row">
            <span>Items</span>
            <strong>{formatMoney(cart.totals.total_items, cart.totals)}</strong>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>{formatMoney(cart.totals.total_shipping, cart.totals)}</span>
          </div>

          <div className="summary-row">
            <span>Tax</span>
            <span>{formatMoney(cart.totals.total_tax, cart.totals)}</span>
          </div>

          <div className="summary-row summary-total">
            <span>Total</span>
            <strong>{formatMoney(cart.totals.total_price, cart.totals)}</strong>
          </div>

          <Link className="primary-button block-button" href="/checkout">
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </section>
  );
}
