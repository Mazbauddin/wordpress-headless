import { NextResponse } from "next/server";

const WP_URL = process.env.WORDPRESS_URL;

export async function POST(request) {
  const { email } = await request.json();

  await fetch(`${WP_URL}/wp-json/eis/v1/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: String(email || "").trim() }),
    cache: "no-store"
  }).catch(() => null);

  return NextResponse.json({
    success: true,
    message: "If an account exists, password reset instructions have been sent."
  });
}
