import ProductCard from "@/components/Product/ProductCard";
import MobileFilters from "@/components/Shop/MobileFilters";
import ShopFilters from "@/components/Shop/ShopFilters";
import ShopToolbar from "@/components/Shop/ShopToolbar";
import Pagination from "@/components/UI/Pagination";
import { getAttributes, getAttributeTerms, getFilteredProducts } from "@/lib/woocommerce";
import { buildProductParams } from "@/lib/product-filters";

export const metadata = { title: "Shop" };

export default async function ShopPage({ searchParams }) {
  const search = await searchParams;
  const params = buildProductParams(search);

  const selectedAttributes = [];
  if (search.color) selectedAttributes.push({ taxonomy: "pa_color", slug: search.color });
  if (search.size) selectedAttributes.push({ taxonomy: "pa_size", slug: search.size });

  const [{ products, total, totalPages }, attributes] = await Promise.all([
    getFilteredProducts(params, selectedAttributes),
    getAttributes()
  ]);

  const filterAttributes = await Promise.all(
    attributes.map(async (attribute) => ({
      ...attribute,
      terms: await getAttributeTerms(attribute.id)
    }))
  );

  return (
    <section className="container shop-page">
      <header className="page-heading">
        <h1>Shop</h1>
        <p>Browse the WooCommerce catalogue.</p>
      </header>

      <MobileFilters attributes={filterAttributes} />

      <div className="shop-layout">
        <ShopFilters attributes={filterAttributes} />
        <div>
          <ShopToolbar total={total} />

          {products.length ? (
            <div className="product-grid">
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="empty-state"><h2>No products found</h2><p>Try changing your filters.</p></div>
          )}

          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </section>
  );
}
