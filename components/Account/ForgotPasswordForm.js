"use client";

import { useState } from "react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);

    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    setMessage("If an account exists for this email, password reset instructions have been sent.");
    setLoading(false);
  }

  return (
    <section className="account-auth">
      <form className="auth-form" onSubmit={submit}>
        <h1>Forgot Password</h1>
        <p>Enter your account email address.</p>
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" />
        <button className="primary-button" disabled={loading}>{loading ? "Sending..." : "Send Reset Link"}</button>
        {message && <p className="form-message">{message}</p>}
      </form>
    </section>
  );
}
