import { notFound } from "next/navigation";
import ProductCard from "@/components/Product/ProductCard";
import Breadcrumbs from "@/components/UI/Breadcrumbs";
import Pagination from "@/components/UI/Pagination";
import { getProductCategories, getProductsPage } from "@/lib/woocommerce";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const categories = await getProductCategories();
  const category = categories.find((item) => item.slug === slug);
  if (!category) return {};

  return {
    title: category.name,
    description: `Shop ${category.name} products.`,
    alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/product-category/${slug}` }
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const search = await searchParams;
  const categories = await getProductCategories();
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();

  const { products, total, totalPages } = await getProductsPage({
    category: category.id,
    per_page: 24,
    page: Math.max(1, Number(search.page) || 1),
    orderby: "date",
    order: "desc"
  });

  return (
    <section className="container page-section">
      <Breadcrumbs items={[{ label: "Shop", href: "/shop" }, { label: category.name }]} />
      <header className="page-heading"><h1>{category.name}</h1><p>{total} products</p></header>
      <div className="product-grid">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
      <Pagination totalPages={totalPages} />
    </section>
  );
}
