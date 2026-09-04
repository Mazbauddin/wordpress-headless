import { getAllProducts, getProductCategories } from "@/lib/woocommerce";
import { getAllPosts } from "@/lib/wordpress-content";

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  const [products, categories, posts] = await Promise.all([
    getAllProducts(),
    getProductCategories(),
    getAllPosts()
  ]);

  return [
    { url: `${base}/` },
    { url: `${base}/shop` },
    { url: `${base}/blog` },
    ...products.map((product) => ({ url: `${base}/product/${product.slug}` })),
    ...categories.map((category) => ({ url: `${base}/product-category/${category.slug}` })),
    ...posts.map((post) => ({ url: `${base}/blog/${post.slug}`, lastModified: post.modified }))
  ];
}
