import ProductCard from "@/components/Product/ProductCard";
import { getProducts } from "@/lib/woocommerce";

export const metadata = { title: "Search" };

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = params.q?.trim() || "";
  const products = query ? await getProducts({ search: query, per_page: 24 }) : [];

  return (
    <section className="container page-section">
      <h1>Search</h1>
      <form className="search-page-form" action="/search">
        <input type="search" name="q" defaultValue={query} placeholder="Search products..." />
        <button className="primary-button">Search</button>
      </form>
      {query && <p>{products.length} results for “{query}”</p>}
      <div className="product-grid">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  );
}
