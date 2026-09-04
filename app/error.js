"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => console.error(error), [error]);

  return (
    <section className="error-page">
      <h1>Something went wrong</h1>
      <p>We couldn't load this page right now.</p>
      <button className="primary-button" type="button" onClick={() => reset()}>Try Again</button>
    </section>
  );
}
