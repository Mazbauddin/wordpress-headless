export default function ProductSchema({ product }) {
  if (!product?.prices) return null;

  const minor = Number(product.prices.currency_minor_unit ?? 2);
  const price = Number(product.prices.price) / Math.pow(10, minor);
  const site = process.env.NEXT_PUBLIC_SITE_URL;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    url: `${site}/product/${product.slug}`,
    image: product.images?.map((i) => i.src) || [],
    description: product.short_description?.replace(/<[^>]*>/g, "").trim(),
    sku: product.sku || undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: product.prices.currency_code,
      price: String(price),
      availability: product.is_in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${site}/product/${product.slug}`
    }
  };

  if (Number(product.review_count) > 0 && Number(product.average_rating) > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.average_rating,
      reviewCount: product.review_count
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
    />
  );
}
