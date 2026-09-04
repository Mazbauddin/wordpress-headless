import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const WP_URL = process.env.WORDPRESS_URL;

export async function POST(request) {
  const cookieStore = await cookies();
  const cartToken = cookieStore.get("cart_token")?.value;

  if (!cartToken) return NextResponse.json({ message: "Cart session not found." }, { status: 400 });

  const body = await request.json();

  const response = await fetch(`${WP_URL}/wp-json/wc/store/v1/cart/update-item`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cart-Token": cartToken
    },
    body: JSON.stringify({ key: body.key, quantity: Number(body.quantity) }),
    cache: "no-store"
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
