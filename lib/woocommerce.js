const BASE_URL = process.env.WORDPRESS_URL;

function buildQuery(params = {}) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;

    if (Array.isArray(value)) {
      value.forEach((item) => query.append(`${key}[]`, String(item)));
    } else {
      query.set(key, String(value));
    }
  }

  return query;
}

export async function getProducts(params = {}) {
  const response = await fetch(
    `${BASE_URL}/wp-json/wc/store/v1/products?${buildQuery(params)}`,
    { next: { revalidate: 120, tags: ["products"] } }
  );

  if (!response.ok) throw new Error("Unable to load products.");
  return response.json();
}

export async function getProductsPage(params = {}) {
  const response = await fetch(
    `${BASE_URL}/wp-json/wc/store/v1/products?${buildQuery(params)}`,
    { next: { revalidate: 120, tags: ["products"] } }
  );

  if (!response.ok) throw new Error("Unable to load products.");
  const products = await response.json();

  return {
    products,
    total: Number(response.headers.get("X-WP-Total")) || products.length,
    totalPages: Number(response.headers.get("X-WP-TotalPages")) || 1
  };
}

export async function getFilteredProducts(params = {}, attributes = []) {
  const query = buildQuery(params);

  attributes.forEach((attribute, index) => {
    query.set(`attributes[${index}][attribute]`, attribute.taxonomy);
    query.set(`attributes[${index}][slug]`, attribute.slug);
  });

  const response = await fetch(
    `${BASE_URL}/wp-json/wc/store/v1/products?${query}`,
    { next: { revalidate: 120, tags: ["products"] } }
  );

  if (!response.ok) throw new Error("Unable to load products.");
  const products = await response.json();

  return {
    products,
    total: Number(response.headers.get("X-WP-Total")) || products.length,
    totalPages: Number(response.headers.get("X-WP-TotalPages")) || 1
  };
}

export async function getProductBySlug(slug) {
  const response = await fetch(
    `${BASE_URL}/wp-json/wc/store/v1/products/${encodeURIComponent(slug)}`,
    { next: { revalidate: 120, tags: ["products", `product:${slug}`] } }
  );

  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Unable to load product.");
  return response.json();
}

export async function getProductCategories() {
  const response = await fetch(
    `${BASE_URL}/wp-json/wc/store/v1/products/categories?per_page=100`,
    { next: { revalidate: 600, tags: ["product-categories"] } }
  );

  if (!response.ok) return [];
  return response.json();
}

export async function getAttributes() {
  const response = await fetch(
    `${BASE_URL}/wp-json/wc/store/v1/products/attributes`,
    { next: { revalidate: 600 } }
  );

  if (!response.ok) return [];
  return response.json();
}

export async function getAttributeTerms(attributeId) {
  const response = await fetch(
    `${BASE_URL}/wp-json/wc/store/v1/products/attributes/${attributeId}/terms`,
    { next: { revalidate: 600 } }
  );

  if (!response.ok) return [];
  return response.json();
}

export async function getRelatedProducts(productId, limit = 4) {
  return getProducts({ related: productId, per_page: limit });
}

export async function getProductReviews(productId) {
  const response = await fetch(
    `${BASE_URL}/wp-json/wc/store/v1/products/reviews?product_id=${productId}&per_page=10&orderby=date&order=desc`,
    { next: { revalidate: 120, tags: [`reviews:${productId}`] } }
  );

  if (!response.ok) return [];
  return response.json();
}

export async function getAllProducts() {
  const all = [];
  let page = 1;

  while (true) {
    const result = await getProductsPage({ per_page: 100, page });
    all.push(...result.products);
    if (page >= result.totalPages) break;
    page += 1;
  }

  return all;
}
