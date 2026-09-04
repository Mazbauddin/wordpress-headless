import { redirect } from "next/navigation";
import ProductCard from "@/components/Product/ProductCard";
import { getSession } from "@/lib/session";
import { getCustomer } from "@/lib/wc-admin";
import { getProducts } from "@/lib/woocommerce";

export const metadata = { title: "Wishlist", robots: { index: false, follow: false } };

export default async function WishlistPage() {
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  const customer = await getCustomer(session.userId);
  const meta = customer.meta_data?.find((item) => item.key === "eis_wishlist");
  const ids = Array.isArray(meta?.value) ? meta.value.map(Number) : [];

  const products = ids.length
    ? await getProducts({ include: ids, per_page: 100 })
    : [];

  return (
    <section className="container page-section">
      <h1>Wishlist</h1>
      {products.length ? (
        <div className="product-grid">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <p>Your wishlist is empty.</p>
      )}
    </section>
  );
}
