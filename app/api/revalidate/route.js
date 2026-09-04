import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request) {
  const secret = request.headers.get("x-revalidate-secret");

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));

  if (body.type === "menu") {
    revalidateTag("menus", { expire: 0 });
    revalidatePath("/", "layout");
  }

  if (body.type === "product") {
    revalidateTag("products", { expire: 0 });

    if (body.slug) {
      revalidateTag(`product:${body.slug}`, { expire: 0 });
      revalidatePath(`/product/${body.slug}`);
    }

    revalidatePath("/");
    revalidatePath("/shop");
  }

  return NextResponse.json({ revalidated: true });
}
