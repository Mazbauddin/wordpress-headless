"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordForm() {
  const params = useSearchParams();
  const key = params.get("key") || "";
  const login = params.get("login") || "";
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);

    const r = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, login, password })
    });

    const data = await r.json();
    setSuccess(r.ok);
    setMessage(r.ok ? "Password updated. You can now log in." : data.message || "Reset failed.");
    setLoading(false);
  }

  if (!key || !login) {
    return (
      <section className="account-auth">
        <div className="auth-form">
          <h1>Invalid reset link</h1>
          <Link href="/forgot-password">Request a new reset link</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="account-auth">
      <form className="auth-form" onSubmit={submit}>
        <h1>Set New Password</h1>

        {!success && (
          <>
            <input
              required
              minLength={8}
              type="password"
              placeholder="New password (8+ characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="primary-button" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </>
        )}

        {message && <p className="form-message">{message}</p>}
        {success && <Link href="/login">Go to login</Link>}
      </form>
    </section>
  );
}
