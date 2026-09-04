import { notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { getOrder } from "@/lib/wc-admin";

export const metadata = { title: "Order Details", robots: { index: false, follow: false } };

export default async function OrderDetailsPage({ params }) {
  const { id } = await params;
  const session = await getSession();

  let order;
  try {
    order = await getOrder(id);
  } catch {
    notFound();
  }

  if (Number(order.customer_id) !== Number(session.userId)) notFound();

  return (
    <article className="order-details">
      <h1>Order #{order.number}</h1>
      <p>Status: <strong>{order.status}</strong></p>
      <p>Date: {new Date(order.date_created).toLocaleDateString()}</p>

      <div className="order-products">
        {order.line_items.map((item) => (
          <div className="order-product" key={item.id}>
            <span>{item.name} × {item.quantity}</span>
            <strong>{order.currency_symbol}{item.total}</strong>
          </div>
        ))}
      </div>

      <div className="order-total">
        <span>Total</span>
        <strong>{order.currency_symbol}{order.total}</strong>
      </div>
    </article>
  );
}
