"use client";

import { useMemo, useState } from "react";

export default function AddToCart({ product, variations = [] }) {
  const [variationId, setVariationId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const selected = useMemo(
    () => variations.find((v) => String(v.id) === String(variationId)),
    [variations, variationId]
  );

  async function add() {
    if (product.has_options && !selected) {
      setMessage("Please choose a variation.");
      return;
    }

    const id = product.has_options ? Number(selected.id) : Number(product.id);

    const variation = product.has_options
      ? (selected.attributes || []).map((attribute) => {
          const parentAttribute = (product.attributes || []).find(
            (item) =>
              Number(item.id) === Number(attribute.id) ||
              item.name === attribute.name
          );

          const key = parentAttribute?.taxonomy || attribute.name;
          let value = attribute.option;

          if (parentAttribute?.taxonomy && parentAttribute?.terms?.length) {
            const term = parentAttribute.terms.find(
              (item) =>
                item.name === attribute.option ||
                item.slug === attribute.option
            );

            if (term?.slug) value = term.slug;
          }

          return { attribute: key, value };
        })
      : [];

    setLoading(true);
    setMessage("");

    const response = await fetch("/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, quantity, variation })
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Product added to cart.");
      window.dispatchEvent(new Event("cart-updated"));
      window.dispatchEvent(new Event("open-mini-cart"));
    } else {
      setMessage(data.message || "Unable to add product.");
    }

    setLoading(false);
  }

  return (
    <div className="add-to-cart">
      {product.has_options && (
        <label className="variation-field">
          <span>Option</span>
          <select value={variationId} onChange={(e) => setVariationId(e.target.value)}>
            <option value="">Choose an option</option>
            {variations.map((v) => {
              const label =
                v.attributes?.map((a) => a.option).filter(Boolean).join(" / ") ||
                `Variation #${v.id}`;

              return (
                <option
                  key={v.id}
                  value={v.id}
                  disabled={v.stock_status === "outofstock"}
                >
                  {label}{v.stock_status === "outofstock" ? " — Out of stock" : ""}
                </option>
              );
            })}
          </select>
        </label>
      )}

      <div className="product-quantity">
        <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
        <span>{quantity}</span>
        <button type="button" onClick={() => setQuantity(quantity + 1)}>+</button>
      </div>

      <button
        className="primary-button block-button"
        type="button"
        onClick={add}
        disabled={loading || !product.is_in_stock}
      >
        {!product.is_in_stock ? "Out of Stock" : loading ? "Adding..." : "Add to Cart"}
      </button>

      {message && <p className="form-message">{message}</p>}
    </div>
  );
}
