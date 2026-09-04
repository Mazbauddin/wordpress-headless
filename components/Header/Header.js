import Image from "next/image";
import Link from "next/link";
import { getMenu, getSiteSettings } from "@/lib/wordpress";
import Navigation from "./Navigation";
import HeaderActions from "./HeaderActions";
import HeaderClientShell from "./HeaderClientShell";

export default async function Header() {
  const [menu, site] = await Promise.all([
    getMenu("headless_header"),
    getSiteSettings()
  ]);

  return (
    <>
      <div className="announcement-bar">Welcome to our online store</div>
      <header className="site-header">
        <div className="container header-container">
          <HeaderClientShell menu={menu} />

          <Link href="/" className="header-logo">
            {site?.logo ? (
              <Image src={site.logo} alt={site.name || "Store"} width={180} height={60} priority sizes="180px" />
            ) : (
              <strong>{site?.name || "STORE"}</strong>
            )}
          </Link>

          <Navigation menu={menu} />
          <HeaderActions />
        </div>
      </header>
    </>
  );
}
