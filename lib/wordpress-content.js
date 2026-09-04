const WP_URL = process.env.WORDPRESS_URL;

export async function getPageBySlug(slug) {
  const response = await fetch(
    `${WP_URL}/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}`,
    { next: { revalidate: 300, tags: ["wp-pages"] } }
  );

  if (!response.ok) return null;
  const pages = await response.json();
  return pages[0] || null;
}

export async function getPosts(page = 1) {
  const response = await fetch(
    `${WP_URL}/wp-json/wp/v2/posts?per_page=12&page=${page}&_embed`,
    { next: { revalidate: 300, tags: ["wp-posts"] } }
  );

  if (!response.ok) return [];
  return response.json();
}

export async function getPostBySlug(slug) {
  const response = await fetch(
    `${WP_URL}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed`,
    { next: { revalidate: 300, tags: ["wp-posts"] } }
  );

  if (!response.ok) return null;
  const posts = await response.json();
  return posts[0] || null;
}

export async function getAllPosts() {
  const all = [];
  let page = 1;

  while (true) {
    const response = await fetch(
      `${WP_URL}/wp-json/wp/v2/posts?per_page=100&page=${page}&_fields=id,slug,modified`,
      { next: { revalidate: 300, tags: ["wp-posts"] } }
    );

    if (response.status === 400) break;
    if (!response.ok) break;

    const posts = await response.json();
    all.push(...posts);

    const totalPages = Number(response.headers.get("X-WP-TotalPages")) || 1;
    if (page >= totalPages) break;
    page += 1;
  }

  return all;
}
