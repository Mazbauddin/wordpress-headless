import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/UI/Breadcrumbs";
import { getPostBySlug } from "@/lib/wordpress-content";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title.rendered.replace(/<[^>]*>/g, ""),
    description: post.excerpt.rendered.replace(/<[^>]*>/g, "").trim().slice(0, 155)
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="container content-page">
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: post.title.rendered.replace(/<[^>]*>/g, "") }]} />
      <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
      <div className="wp-content" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
    </article>
  );
}
