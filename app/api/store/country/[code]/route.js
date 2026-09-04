import { NextResponse } from "next/server";
import { getCountry } from "@/lib/wc-admin";

export async function GET(request, { params }) {
  const { code } = await params;

  try {
    const country = await getCountry(String(code).toUpperCase());
    return NextResponse.json(country);
  } catch {
    return NextResponse.json({ states: [] }, { status: 404 });
  }
}
