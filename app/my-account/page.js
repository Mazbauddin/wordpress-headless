import { getSession } from "@/lib/session";
import { getCustomer } from "@/lib/wc-admin";

export const metadata = { title: "My Account", robots: { index: false, follow: false } };

export default async function AccountPage() {
  const session = await getSession();
  const customer = await getCustomer(session.userId);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Hello {customer.first_name || customer.email}.</p>
      <p>Use the account menu to view orders, addresses and your wishlist.</p>
    </div>
  );
}
