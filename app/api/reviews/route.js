import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createProductReview, getCustomer } from "@/lib/wc-admin";

export async function POST(request) {
  const session = await getSession();

  if (!session?.userId) {
    return NextResponse.json(
      { message: "Please login to leave a review." },
      { status: 401 }
    );
  }

  const { productId, rating, review } = await request.json();

  if (
    !Number(productId) ||
    !String(review || "").trim() ||
    Number(rating) < 1 ||
    Number(rating) > 5
  ) {
    return NextResponse.json({ message: "Invalid review." }, { status: 400 });
  }

  const customer = await getCustomer(session.userId);

  const result = await createProductReview({
    product_id: Number(productId),
    reviewer:
      `${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
      customer.email ||
      "Customer",
    reviewer_email: customer.email,
    review: String(review).trim(),
    rating: Number(rating),
    status: "hold"
  });

  revalidateTag(`reviews:${Number(productId)}`, { expire: 0 });
  return NextResponse.json(result);
}
