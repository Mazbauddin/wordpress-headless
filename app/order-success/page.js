import Link from "next/link";
export const metadata = { title: "Order Confirmed", robots: { index: false, follow: false } };

export default async function OrderSuccessPage({ searchParams }) {
  const params = await searchParams;
  const order = params.order || "";

  return (
    <section className="container order-success">
      <div className="success-box">
        <div className="success-icon">✓</div>
        <h1>Thank you for your order</h1>
        {order && <p>Order reference: #{order}</p>}
        <p>Your order has been submitted. Check your email for confirmation details.</p>
        <div className="success-actions">
          <Link className="primary-button" href="/shop">Continue Shopping</Link>
          <Link className="secondary-button" href="/my-account/orders">My Orders</Link>
        </div>
      </div>
    </section>
  );
}
