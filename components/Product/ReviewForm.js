"use client";

import { useState } from "react";

export default function ReviewForm({ productId }) {
  const [rating, setRating] = useState("5");
  const [review, setReview] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);

    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating: Number(rating), review })
    });

    const data = await response.json();
    setMessage(
      response.ok
        ? "Thanks. Your review was submitted for moderation."
        : data.message || "Unable to submit review."
    );

    if (response.ok) setReview("");
    setLoading(false);
  }

  return (
    <form className="review-form" onSubmit={submit}>
      <h3>Write a review</h3>
      <label>
        Rating
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          {[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} / 5</option>)}
        </select>
      </label>
      <label>
        Review
        <textarea required minLength={3} value={review} onChange={(e) => setReview(e.target.value)} />
      </label>
      <button className="secondary-button" disabled={loading}>
        {loading ? "Submitting..." : "Submit review"}
      </button>
      {message && <p className="form-message">{message}</p>}
    </form>
  );
}
