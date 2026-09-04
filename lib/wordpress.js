const WP_URL = process.env.WORDPRESS_URL;

export async function getMenu(location) {
  try {
    const response = await fetch(
      `${WP_URL}/wp-json/eis/v1/menu/${location}`,
      { next: { revalidate: 300, tags: ["menus"] } }
    );
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}

export async function getSiteSettings() {
  try {
    const response = await fetch(
      `${WP_URL}/wp-json/eis/v1/site-settings`,
      { next: { revalidate: 600, tags: ["site-settings"] } }
    );
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export function convertWordPressUrl(url) {
  if (!url) return "/";
  const wp = process.env.WORDPRESS_URL;
  const frontend = process.env.NEXT_PUBLIC_SITE_URL;

  if (wp && url.startsWith(wp)) return url.slice(wp.length) || "/";
  if (frontend && url.startsWith(frontend)) return url.slice(frontend.length) || "/";
  return url;
}
