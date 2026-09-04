import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const WP_URL = process.env.WORDPRESS_URL;

export async function GET() {
  const cookieStore = await cookies();
  const existingToken = cookieStore.get("cart_token")?.value;

  const headers = {};
  if (existingToken) headers["Cart-Token"] = existingToken;

  const response = await fetch(
    `${WP_URL}/wp-json/wc/store/v1/cart`,
    { headers, cache: "no-store" }
  );

  const data = await response.json();
  const token = response.headers.get("Cart-Token") || existingToken;
  const result = NextResponse.json(data, { status: response.status });

  if (token) {
    result.cookies.set("cart_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/"
    });
  }

  return result;
}
