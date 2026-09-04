import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCustomer } from "@/lib/woocommerce";

export const dynamic = "force-dynamic";

export default async function AddressesPage() {

  const session = await getSession();

  if (!session?.userId) {
    redirect("/login");
  }

  const customer = await getCustomer(session.userId);


  return (
    <div>
      <h1>Addresses</h1>

      {customer && (
        <div>
          <h2>{customer.first_name} {customer.last_name}</h2>

          <div>
            <h3>Billing Address</h3>
            <p>
              {customer.billing?.address_1}
            </p>
          </div>

          <div>
            <h3>Shipping Address</h3>
            <p>
              {customer.shipping?.address_1}
            </p>
          </div>

        </div>
      )}

    </div>
  );
}