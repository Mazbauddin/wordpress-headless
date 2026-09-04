import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/wordpress-content";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return {};

  return {
    title: page.title.rendered.replace(/<[^>]*>/g, ""),
    description: page.excerpt?.rendered?.replace(/<[^>]*>/g, "").trim().slice(0, 155)
  };
}

export default async function WordPressPage({ params }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) notFound();

  return (
    <article className="container content-page">
      <h1 dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
      <div className="wp-content" dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
    </article>
  );
}
