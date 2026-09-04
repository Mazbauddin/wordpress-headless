import Link from "next/link";
import { getPosts } from "@/lib/wordpress-content";

export const metadata = { title: "Blog" };

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <section className="container page-section">
      <h1>Blog</h1>
      <div className="blog-grid">
        {posts.map((post) => (
          <article className="blog-card" key={post.id}>
            <h2>
              <Link href={`/blog/${post.slug}`} dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            </h2>
            <div className="wp-content" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
          </article>
        ))}
      </div>
    </section>
  );
}
