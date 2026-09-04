import AddressForm from "@/components/Account/AddressForm";
import { getSession } from "@/lib/session";
import { getCustomer } from "@/lib/wc-admin";

export const metadata = { title: "Addresses", robots: { index: false, follow: false } };

export default async function AddressesPage() {
  const session = await getSession();
  const customer = await getCustomer(session.userId);

  return (
    <div>
      <h1>Addresses</h1>
      <AddressForm customer={customer} />
    </div>
  );
}
