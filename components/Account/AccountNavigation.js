"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AccountNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    ["/my-account", "Dashboard"],
    ["/my-account/orders", "Orders"],
    ["/my-account/addresses", "Addresses"],
    ["/wishlist", "Wishlist"]
  ];

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="account-navigation">
      <h2>My Account</h2>
      <nav>
        {links.map(([href, label]) => (
          <Link key={href} href={href} className={pathname === href ? "active" : ""}>{label}</Link>
        ))}
        <button type="button" onClick={logout}>Logout</button>
      </nav>
    </aside>
  );
}
