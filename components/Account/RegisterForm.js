"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(e) {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const r = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await r.json();

    if (!r.ok) {
      setError(data.message || "Unable to create account.");
      setLoading(false);
      return;
    }

    router.push("/my-account");
    router.refresh();
  }

  return (
    <section className="account-auth">
      <form className="auth-form" onSubmit={submit}>
        <h1>Create Account</h1>
        <input required name="firstName" placeholder="First name" value={form.firstName} onChange={update} />
        <input required name="lastName" placeholder="Last name" value={form.lastName} onChange={update} />
        <input required type="email" name="email" placeholder="Email" value={form.email} onChange={update} />
        <input required minLength={8} type="password" name="password" placeholder="Password (8+ characters)" value={form.password} onChange={update} />

        {error && <p className="form-error">{error}</p>}

        <button className="primary-button" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
    </section>
  );
}
