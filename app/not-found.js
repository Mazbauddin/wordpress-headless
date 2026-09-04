import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found-page">
      <span className="not-found-code">404</span>
      <h1>Page not found</h1>
      <p>The page may have moved or no longer exists.</p>
      <div className="success-actions">
        <Link className="primary-button" href="/">Home</Link>
        <Link className="secondary-button" href="/shop">Shop</Link>
      </div>
    </section>
  );
}
