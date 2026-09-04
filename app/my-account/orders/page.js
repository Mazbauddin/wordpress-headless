import Link from "next/link";
import { getSession } from "@/lib/session";
import { getCustomerOrders } from "@/lib/wc-admin";

export const metadata = { title: "Orders", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default async function OrdersPage() {
  const session = await getSession();
  const orders = await getCustomerOrders(session.userId);

  return (
    <div>
      <h1>Orders</h1>
      {!orders.length ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="orders-table-wrap">
          <table className="orders-table">
            <thead>
              <tr><th>Order</th><th>Date</th><th>Status</th><th>Total</th><th></th></tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.number}</td>
                  <td>{new Date(order.date_created).toLocaleDateString()}</td>
                  <td>{order.status}</td>
                  <td>{order.currency_symbol}{order.total}</td>
                  <td><Link href={`/my-account/orders/${order.id}`}>View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
