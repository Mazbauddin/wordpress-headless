export default function robots() {
  const site = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/cart",
        "/checkout",
        "/my-account",
        "/login",
        "/register",
        "/wishlist",
        "/forgot-password",
        "/reset-password"
      ]
    },
    sitemap: `${site}/sitemap.xml`
  };
}
