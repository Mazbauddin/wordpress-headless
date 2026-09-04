"use client";

import { useState } from "react";

export default function CouponForm({ onUpdate }) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setMessage("");

    const response = await fetch("/api/cart/coupon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code.trim() })
    });

    const data = await response.json();

    if (response.ok) {
      onUpdate?.(data);
      setMessage("Coupon applied.");
      window.dispatchEvent(new Event("cart-updated"));
    } else {
      setMessage(data.message || "Unable to apply coupon.");
    }

    setLoading(false);
  }

  return (
    <form className="coupon-form" onSubmit={submit}>
      <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" />
      <button className="secondary-button" disabled={loading}>
        {loading ? "Applying..." : "Apply"}
      </button>
      {message && <small>{message}</small>}
    </form>
  );
}
