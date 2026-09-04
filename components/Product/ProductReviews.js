export default function ProductReviews({ reviews = [] }) {
  if (!reviews.length) return <p>No reviews yet.</p>;

  return (
    <div className="reviews-list">
      {reviews.map((review) => (
        <article className="review-item" key={review.id}>
          <div className="review-heading">
            <strong>{review.reviewer}</strong>
            <span>{"★".repeat(Number(review.rating) || 0)}</span>
          </div>
          <div className="wp-content" dangerouslySetInnerHTML={{ __html: review.review }} />
          {review.verified && <small>Verified owner</small>}
        </article>
      ))}
    </div>
  );
}
