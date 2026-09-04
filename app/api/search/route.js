import { NextResponse } from "next/server";

const WP_URL = process.env.WORDPRESS_URL;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query) return NextResponse.json([]);

  const response = await fetch(
    `${WP_URL}/wp-json/wc/store/v1/products?search=${encodeURIComponent(query)}&per_page=6`,
    { cache: "no-store" }
  );

  if (!response.ok) return NextResponse.json([], { status: response.status });
  return NextResponse.json(await response.json());
}
