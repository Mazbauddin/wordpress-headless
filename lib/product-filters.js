export function buildProductParams(searchParams = {}) {
  const params = {
    page: Math.max(1, Number(searchParams.page) || 1),
    per_page: 24
  };

  if (searchParams.q) params.search = searchParams.q;
  if (searchParams.sale === "true") params.on_sale = "true";

  // Starter assumes a normal two-decimal currency for URL-entered prices.
  if (searchParams.min) params.min_price = Math.round(Number(searchParams.min) * 100);
  if (searchParams.max) params.max_price = Math.round(Number(searchParams.max) * 100);

  if (searchParams.rating) {
    params.rating = Array.from({ length: 6 - Number(searchParams.rating) }, (_, i) => String(Number(searchParams.rating) + i));
  }

  switch (searchParams.sort) {
    case "price-low":
      params.orderby = "price";
      params.order = "asc";
      break;
    case "price-high":
      params.orderby = "price";
      params.order = "desc";
      break;
    case "rating":
      params.orderby = "rating";
      params.order = "desc";
      break;
    case "popular":
      params.orderby = "popularity";
      params.order = "desc";
      break;
    default:
      params.orderby = "date";
      params.order = "desc";
  }

  return params;
}
