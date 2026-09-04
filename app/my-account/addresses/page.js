import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCustomer } from "@/lib/woocommerce";

export const dynamic = "force-dynamic";

export default async function AddressesPage() {

  const session = await getSession();

  console.log("ADDRESS PAGE SESSION:", session);

  if (!session || !session.userId) {
    redirect("/login");
  }

  const customer = await getCustomer(session.userId);

  return (
    <div>
      <h1>Addresses</h1>

      <pre>
        {JSON.stringify(customer, null, 2)}
      </pre>

    </div>
  );
}