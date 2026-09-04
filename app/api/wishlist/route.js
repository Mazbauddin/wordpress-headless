import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getCustomer, updateCustomer } from "@/lib/wc-admin";

const META_KEY = "eis_wishlist";

function readWishlist(customer) {
  const meta = customer.meta_data?.find((item) => item.key === META_KEY);
  return Array.isArray(meta?.value) ? meta.value.map(Number) : [];
}

export async function GET() {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json([]);

  const customer = await getCustomer(session.userId);
  return NextResponse.json(readWishlist(customer));
}

export async function POST(request) {
  const session = await getSession();

  if (!session?.userId) {
    return NextResponse.json({ message: "Login required." }, { status: 401 });
  }

  const { productId } = await request.json();
  const id = Number(productId);

  if (!id) {
    return NextResponse.json({ message: "Invalid product." }, { status: 400 });
  }

  const customer = await getCustomer(session.userId);
  let wishlist = readWishlist(customer);

  wishlist = wishlist.includes(id)
    ? wishlist.filter((item) => item !== id)
    : [...wishlist, id];

  const existingMeta = customer.meta_data?.find((item) => item.key === META_KEY);

  await updateCustomer(session.userId, {
    meta_data: [
      existingMeta?.id
        ? { id: existingMeta.id, key: META_KEY, value: wishlist }
        : { key: META_KEY, value: wishlist }
    ]
  });

  return NextResponse.json({ wishlist });
}
