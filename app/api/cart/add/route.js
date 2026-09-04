import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const WP_URL = process.env.WORDPRESS_URL;

export async function POST(request) {
  const cookieStore = await cookies();
  let cartToken = cookieStore.get("cart_token")?.value;

  if (!cartToken) {
    const cartResponse = await fetch(`${WP_URL}/wp-json/wc/store/v1/cart`, { cache: "no-store" });
    cartToken = cartResponse.headers.get("Cart-Token");
  }

  const body = await request.json();
  const id = Number(body.id);
  const quantity = Math.max(1, Number(body.quantity) || 1);
  const variation = Array.isArray(body.variation) ? body.variation : [];

  if (!id) return NextResponse.json({ message: "Invalid product." }, { status: 400 });

  const response = await fetch(`${WP_URL}/wp-json/wc/store/v1/cart/add-item`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cart-Token": cartToken
    },
    body: JSON.stringify({ id, quantity, variation }),
    cache: "no-store"
  });

  const data = await response.json();
  const token = response.headers.get("Cart-Token") || cartToken;
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
