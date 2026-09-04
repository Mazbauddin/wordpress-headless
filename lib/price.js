export function formatMoney(amount, meta) {
  if (amount === undefined || amount === null || !meta) return "";
  const minor = Number(meta.currency_minor_unit ?? 2);
  const value = Number(amount) / Math.pow(10, minor);

  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: meta.currency_code || "AUD"
  }).format(value);
}

export function formatProductPrice(prices) {
  return prices ? formatMoney(prices.price, prices) : "";
}
