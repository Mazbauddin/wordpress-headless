import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { attachOrderToCustomer, getCustomer } from "@/lib/wc-admin";

const WP_URL = process.env.WORDPRESS_URL;
const ALLOWED_STARTER_GATEWAYS = new Set(["bacs", "cod"]);

export async function POST(request) {
  const cookieStore = await cookies();
  const cartToken = cookieStore.get("cart_token")?.value;

  if (!cartToken) return NextResponse.json({ message: "Cart session not found." }, { status: 400 });

  const body = await request.json();
  const billing = body.billing_address || {};
  const email = String(billing.email || "").trim().toLowerCase();

  if (!billing.first_name || !billing.last_name) {
    return NextResponse.json({ message: "Billing first and last name are required." }, { status: 400 });
  }

  if (!email || !email.includes("@")) {
    return NextResponse.json({ message: "Please enter a valid billing email." }, { status: 400 });
  }

  if (!ALLOWED_STARTER_GATEWAYS.has(body.payment_method)) {
    return NextResponse.json({ message: "Unsupported payment method in this starter." }, { status: 400 });
  }

  const cartResponse = await fetch(`${WP_URL}/wp-json/wc/store/v1/cart`, {
    headers: { "Cart-Token": cartToken },
    cache: "no-store"
  });

  if (!cartResponse.ok) {
    return NextResponse.json({ message: "Unable to validate the current cart." }, { status: 400 });
  }

  const currentCart = await cartResponse.json();

  if (!(currentCart.payment_methods || []).includes(body.payment_method)) {
    return NextResponse.json(
      { message: "The selected payment method is not available for this cart." },
      { status: 400 }
    );
  }

  const response = await fetch(`${WP_URL}/wp-json/wc/store/v1/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cart-Token": cartToken
    },
    body: JSON.stringify({
      billing_address: billing,
      shipping_address: body.shipping_address || {},
      customer_note: body.customer_note || "",
      payment_method: body.payment_method,
      payment_data: Array.isArray(body.payment_data) ? body.payment_data : [],
      expected_total: body.expected_total
    }),
    cache: "no-store"
  });

  const data = await response.json();

  if (response.ok && data.order_id) {
    const session = await getSession();

    if (session?.userId) {
      try {
        const customer = await getCustomer(session.userId);
        const customerEmail = String(customer.email || "").toLowerCase();

        if (customerEmail && customerEmail === email) {
          await attachOrderToCustomer(data.order_id, session.userId);
        }
      } catch (error) {
        console.error("Unable to attach order to customer:", error);
      }
    }
  }

  return NextResponse.json(data, { status: response.status });
}
