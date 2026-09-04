import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getCustomerOrders } from "@/lib/wc-admin";

export async function GET() {
  const session = await getSession();

  if (!session?.userId) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.json(await getCustomerOrders(session.userId));
}
