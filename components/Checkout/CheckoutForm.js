"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatMoney } from "@/lib/price";
import ShippingRates from "./ShippingRates";

const emptyBilling = {
  first_name: "", last_name: "", company: "",
  address_1: "", address_2: "", city: "",
  state: "", postcode: "", country: "AU",
  email: "", phone: ""
};

const emptyShipping = {
  first_name: "", last_name: "", company: "",
  address_1: "", address_2: "", city: "",
  state: "", postcode: "", country: "AU"
};

export default function CheckoutForm() {
  const router = useRouter();
  const [cart, setCart] = useState(null);
  const [billing, setBilling] = useState(emptyBilling);
  const [shipping, setShipping] = useState(emptyShipping);
  const [sameAddress, setSameAddress] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [notes, setNotes] = useState("");
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [error, setError] = useState("");

  const supportedPaymentMethods = (cart?.payment_methods || []).filter(
    (method) => ["bacs", "cod"].includes(method)
  );

  useEffect(() => {
    fetch("/api/cart", { cache: "no-store" })
      .then((r) => r.json())
      .then(setCart);
  }, []);

  useEffect(() => {
    if (!billing.country) return;

    fetch(`/api/store/country/${billing.country}`)
      .then((r) => r.json())
      .then((data) => setStates(Array.isArray(data.states) ? data.states : []))
      .catch(() => setStates([]));
  }, [billing.country]);

  useEffect(() => {
    if (!cart) return;

    if (!supportedPaymentMethods.includes(paymentMethod)) {
      setPaymentMethod(supportedPaymentMethods[0] || "");
    }
  }, [cart, paymentMethod, supportedPaymentMethods.join("|")]);

  function changeBilling(e) {
    setBilling((current) => ({ ...current, [e.target.name]: e.target.value }));
  }

  function changeShipping(e) {
    setShipping((current) => ({ ...current, [e.target.name]: e.target.value }));
  }

  function resolvedShipping() {
    if (!sameAddress) return shipping;

    return {
      first_name: billing.first_name,
      last_name: billing.last_name,
      company: billing.company,
      address_1: billing.address_1,
      address_2: billing.address_2,
      city: billing.city,
      state: billing.state,
      postcode: billing.postcode,
      country: billing.country
    };
  }

  async function calculateShipping() {
    setShippingLoading(true);
    setError("");

    const r = await fetch("/api/cart/customer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        billing_address: billing,
        shipping_address: resolvedShipping()
      })
    });

    const data = await r.json();

    if (r.ok) {
      setCart(data);
      window.dispatchEvent(new Event("cart-updated"));
    } else {
      setError(data.message || "Unable to calculate shipping.");
    }

    setShippingLoading(false);
  }

  async function submit(event) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    const r = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        billing_address: billing,
        shipping_address: resolvedShipping(),
        customer_note: notes,
        payment_method: paymentMethod,
        payment_data: [],
        expected_total: cart?.totals?.total_price
      })
    });

    const data = await r.json();

    if (!r.ok) {
      setError(data.message || "Checkout failed.");
      setLoading(false);
      return;
    }

    if (data.payment_result?.redirect_url) {
      window.location.href = data.payment_result.redirect_url;
      return;
    }

    router.push(`/order-success?order=${data.order_id || ""}`);
    router.refresh();
  }

  if (!cart) return <section className="container page-section">Loading checkout...</section>;
  if (!cart.items?.length) return <section className="container page-section"><h1>Your cart is empty.</h1></section>;

  return (
    <section className="container checkout-page">
      <form className="checkout-layout" onSubmit={submit}>
        <div className="checkout-fields">
          <h1>Checkout</h1>
          <h2>Billing details</h2>

          <div className="form-grid">
            <input required name="first_name" placeholder="First name" value={billing.first_name} onChange={changeBilling} />
            <input required name="last_name" placeholder="Last name" value={billing.last_name} onChange={changeBilling} />
            <input className="full" name="company" placeholder="Company (optional)" value={billing.company} onChange={changeBilling} />
            <input className="full" required name="address_1" placeholder="Street address" value={billing.address_1} onChange={changeBilling} />
            <input className="full" name="address_2" placeholder="Apartment, suite, etc." value={billing.address_2} onChange={changeBilling} />
            <input required name="city" placeholder="City / Suburb" value={billing.city} onChange={changeBilling} />

            {states.length ? (
              <select required name="state" value={billing.state} onChange={changeBilling}>
                <option value="">Select state</option>
                {states.map((state) => <option key={state.code} value={state.code}>{state.name}</option>)}
              </select>
            ) : (
              <input required name="state" placeholder="State / Region" value={billing.state} onChange={changeBilling} />
            )}

            <input required name="postcode" placeholder="Postcode" value={billing.postcode} onChange={changeBilling} />

            <select name="country" value={billing.country} onChange={changeBilling}>
              <option value="AU">Australia</option>
              <option value="BD">Bangladesh</option>
              <option value="GB">United Kingdom</option>
              <option value="US">United States</option>
            </select>

            <input className="full" required type="email" name="email" placeholder="Email" value={billing.email} onChange={changeBilling} />
            <input className="full" required type="tel" name="phone" placeholder="Phone" value={billing.phone} onChange={changeBilling} />
          </div>

          <label className="checkbox-row">
            <input type="checkbox" checked={sameAddress} onChange={(e) => setSameAddress(e.target.checked)} />
            Ship to billing address
          </label>

          {!sameAddress && (
            <>
              <h2>Shipping details</h2>
              <div className="form-grid">
                {Object.keys(emptyShipping).map((name) => (
                  <input
                    key={name}
                    name={name}
                    placeholder={name.replaceAll("_", " ")}
                    value={shipping[name]}
                    onChange={changeShipping}
                  />
                ))}
              </div>
            </>
          )}

          <button className="secondary-button" type="button" disabled={shippingLoading} onClick={calculateShipping}>
            {shippingLoading ? "Calculating..." : "Calculate / refresh shipping"}
          </button>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Order notes (optional)"
          />
        </div>

        <aside className="checkout-summary">
          <h2>Your Order</h2>

          {cart.items.map((item) => (
            <div className="summary-row" key={item.key}>
              <span>{item.name} × {item.quantity}</span>
              <strong>{formatMoney(item.totals.line_total, item.totals)}</strong>
            </div>
          ))}

          <ShippingRates cart={cart} onUpdate={setCart} />

          <div className="summary-row">
            <span>Tax</span>
            <span>{formatMoney(cart.totals.total_tax, cart.totals)}</span>
          </div>

          <div className="summary-row summary-total">
            <span>Total</span>
            <strong>{formatMoney(cart.totals.total_price, cart.totals)}</strong>
          </div>

          <div className="payment-methods">
            <h3>Payment</h3>

            {supportedPaymentMethods.includes("bacs") && (
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="bacs"
                  checked={paymentMethod === "bacs"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Direct Bank Transfer
              </label>
            )}

            {supportedPaymentMethods.includes("cod") && (
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Cash on Delivery
              </label>
            )}

            {!supportedPaymentMethods.length && (
              <p>No supported starter payment method is currently available for this cart.</p>
            )}
          </div>

          {error && <div className="form-error">{error}</div>}

          <button className="primary-button block-button" disabled={loading || !paymentMethod}>
            {loading ? "Processing Order..." : "Place Order"}
          </button>
        </aside>
      </form>
    </section>
  );
}
