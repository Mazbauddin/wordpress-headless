import "server-only";

const WP_URL = process.env.WORDPRESS_URL;
const KEY = process.env.WC_CONSUMER_KEY;
const SECRET = process.env.WC_CONSUMER_SECRET;

function authHeader() {
  if (!KEY || !SECRET) {
    throw new Error("WooCommerce REST API credentials are not configured.");
  }

  return `Basic ${Buffer.from(`${KEY}:${SECRET}`).toString("base64")}`;
}

async function wcRequest(endpoint, options = {}) {
  const response = await fetch(
    `${WP_URL}/wp-json/wc/v3/${endpoint}`,
    {
      ...options,
      headers: {
        Authorization: authHeader(),
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      cache: "no-store"
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "WooCommerce request failed.");
  }

  return data;
}

export const createCustomer = (data) =>
  wcRequest("customers", { method: "POST", body: JSON.stringify(data) });

export const getCustomer = (id) => wcRequest(`customers/${id}`);

export const updateCustomer = (id, data) =>
  wcRequest(`customers/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const getCustomerOrders = (id) =>
  wcRequest(`orders?customer=${id}&per_page=50&orderby=date&order=desc`);

export const getOrder = (id) => wcRequest(`orders/${id}`);

export const attachOrderToCustomer = (orderId, customerId) =>
  wcRequest(`orders/${orderId}`, {
    method: "PUT",
    body: JSON.stringify({ customer_id: Number(customerId) })
  });

export const getCountry = (code) => wcRequest(`data/countries/${code}`);

export const getProductVariations = (productId) =>
  wcRequest(`products/${productId}/variations?per_page=100`);

export const createProductReview = (data) =>
  wcRequest("products/reviews", { method: "POST", body: JSON.stringify(data) });
