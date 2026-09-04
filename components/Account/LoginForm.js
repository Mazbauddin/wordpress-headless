"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await r.json();

    if (!r.ok) {
      setError(data.message || "Login failed.");
      setLoading(false);
      return;
    }

    router.push("/my-account");
    router.refresh();
  }

  return (
    <section className="account-auth">
      <form className="auth-form" onSubmit={submit}>
        <h1>Login</h1>

        <label>
          Email
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label>
          Password
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button className="primary-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <Link href="/forgot-password">Forgot password?</Link>
        <p>Don't have an account? <Link href="/register">Register</Link></p>
      </form>
    </section>
  );
}
