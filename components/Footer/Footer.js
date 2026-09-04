import Link from "next/link";
import { getMenu, getSiteSettings, convertWordPressUrl } from "@/lib/wordpress";

function Links({ title, items }) {
  return (
    <div className="footer-column">
      <h4>{title}</h4>
      <ul>
        {items.map((item) => (
          <li key={item.id}><Link href={convertWordPressUrl(item.url)}>{item.title}</Link></li>
        ))}
      </ul>
    </div>
  );
}

export default async function Footer() {
  const [one, two, three, site] = await Promise.all([
    getMenu("headless_footer_1"),
    getMenu("headless_footer_2"),
    getMenu("headless_footer_3"),
    getSiteSettings()
  ]);

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <h3>{site?.name || "Store"}</h3>
          <p>{site?.description || "A modern headless WooCommerce store."}</p>
        </div>
        <Links title="Customer Service" items={one} />
        <Links title="Information" items={two} />
        <Links title="Shop" items={three} />
      </div>
      <div className="container footer-bottom">
        © {new Date().getFullYear()} {site?.name || "Store"}. All rights reserved.
      </div>
    </footer>
  );
}
