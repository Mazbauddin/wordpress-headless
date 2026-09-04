import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { updateCustomer } from "@/lib/wc-admin";

export async function PUT(request) {
  const session = await getSession();

  if (!session?.userId) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();

  const customer = await updateCustomer(session.userId, {
    first_name: body.first_name,
    last_name: body.last_name,
    billing: body.billing,
    shipping: body.shipping
  });

  return NextResponse.json(customer);
}
