export default function ShopLoading() {
  return (
    <section className="container page-section">
      <div className="skeleton-heading" />
      <div className="product-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="product-skeleton" key={i}>
            <div className="skeleton-image" />
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
          </div>
        ))}
      </div>
    </section>
  );
}
