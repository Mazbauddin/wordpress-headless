"use client";

import { formatMoney } from "@/lib/price";

export default function ShippingRates({ cart, onUpdate }) {
  if (!cart?.needs_shipping) return null;

  if (!cart.has_calculated_shipping) {
    return <p>Enter a complete shipping address, then calculate shipping.</p>;
  }

  async function select(packageId, rateId) {
    const r = await fetch("/api/cart/shipping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ package_id: packageId, rate_id: rateId })
    });

    const data = await r.json();
    if (r.ok) onUpdate(data);
  }

  return (
    <div className="shipping-rates">
      <h3>Shipping</h3>
      {cart.shipping_rates?.map((pkg) => (
        <div key={pkg.package_id}>
          {pkg.shipping_rates?.map((rate) => (
            <label className="shipping-rate" key={rate.rate_id}>
              <input
                type="radio"
                name={`shipping-${pkg.package_id}`}
                checked={Boolean(rate.selected)}
                onChange={() => select(pkg.package_id, rate.rate_id)}
              />
              <span>{rate.name}</span>
              <strong>{formatMoney(rate.price, rate)}</strong>
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}
