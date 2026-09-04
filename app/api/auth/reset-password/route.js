import { NextResponse } from "next/server";

const WP_URL = process.env.WORDPRESS_URL;

export async function POST(request) {
  const body = await request.json();

  const response = await fetch(`${WP_URL}/wp-json/eis/v1/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key: body.key,
      login: body.login,
      password: body.password
    }),
    cache: "no-store"
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
