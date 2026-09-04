import { formatMoney } from "@/lib/price";

export default function ProductPrice({ prices }) {
  if (!prices) return null;

  const onSale =
    prices.sale_price &&
    prices.regular_price &&
    String(prices.sale_price) !== String(prices.regular_price);

  if (!onSale) return <span>{formatMoney(prices.price, prices)}</span>;

  return (
    <div className="sale-price">
      <del>{formatMoney(prices.regular_price, prices)}</del>
      <strong>{formatMoney(prices.sale_price, prices)}</strong>
    </div>
  );
}
