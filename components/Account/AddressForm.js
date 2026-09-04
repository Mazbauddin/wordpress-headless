"use client";

import { useState } from "react";

export default function AddressForm({ customer }) {
  const [billing, setBilling] = useState(customer.billing || {});
  const [shipping, setShipping] = useState(customer.shipping || {});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function update(setter, event) {
    const { name, value } = event.target;
    setter((current) => ({ ...current, [name]: value }));
  }

  function fields(value, setter) {
    const list = [
      ["first_name", "First name"],
      ["last_name", "Last name"],
      ["company", "Company"],
      ["address_1", "Address"],
      ["address_2", "Address line 2"],
      ["city", "City"],
      ["state", "State"],
      ["postcode", "Postcode"],
      ["country", "Country code"]
    ];

    return (
      <div className="form-grid">
        {list.map(([name, label]) => (
          <label key={name}>
            {label}
            <input
              name={name}
              value={value?.[name] || ""}
              onChange={(e) => update(setter, e)}
            />
          </label>
        ))}
      </div>
    );
  }

  async function save(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const r = await fetch("/api/account/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: customer.first_name,
        last_name: customer.last_name,
        billing,
        shipping
      })
    });

    const data = await r.json();
    setMessage(r.ok ? "Addresses updated." : data.message || "Unable to save addresses.");
    setLoading(false);
  }

  return (
    <form className="address-form" onSubmit={save}>
      <h2>Billing address</h2>
      {fields(billing, setBilling)}

      <h2>Shipping address</h2>
      {fields(shipping, setShipping)}

      <button className="primary-button" disabled={loading}>{loading ? "Saving..." : "Save Addresses"}</button>
      {message && <p className="form-message">{message}</p>}
    </form>
  );
}
