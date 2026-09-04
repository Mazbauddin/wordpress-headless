import Link from "next/link";
import ProductCard from "@/components/Product/ProductCard";
import { getProducts, getProductCategories } from "@/lib/woocommerce";

export default async function HomePage() {
  const [latest, featured, categories] = await Promise.all([
    getProducts({ per_page: 8, orderby: "date", order: "desc" }),
    getProducts({ per_page: 8, featured: "true" }),
    getProductCategories()
  ]);

  return (
    <>
      <section className="hero">
        <div className="container hero-content">
          <p className="eyebrow">HEADLESS WOOCOMMERCE</p>
          <h1>A fast storefront controlled from WordPress.</h1>
          <p>Replace this starter hero with your own brand content and campaign creative.</p>
          <Link className="primary-button" href="/shop">Shop Now</Link>
        </div>
      </section>

      <section className="container home-section">
        <div className="section-heading"><h2>Shop by Category</h2></div>
        <div className="category-grid">
          {categories.slice(0, 8).map((category) => (
            <Link className="category-card" href={`/product-category/${category.slug}`} key={category.id}>
              <strong>{category.name}</strong>
              <span>{category.count} products</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container home-section">
        <div className="section-heading">
          <h2>New Arrivals</h2>
          <Link href="/shop">View all</Link>
        </div>
        <div className="product-grid">
          {latest.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="container home-section">
          <div className="section-heading"><h2>Featured Products</h2></div>
          <div className="product-grid">
            {featured.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      )}
    </>
  );
}
