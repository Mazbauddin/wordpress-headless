import { redirect } from "next/navigation";
import AccountNavigation from "@/components/Account/AccountNavigation";
import { getSession } from "@/lib/session";

export default async function AccountLayout({ children }) {
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  return (
    <section className="container account-layout">
      <AccountNavigation />
      <div className="account-content">{children}</div>
    </section>
  );
}
