import { NextResponse } from "next/server";
import { createSession } from "@/lib/session";
import { createCustomer } from "@/lib/wc-admin";

export async function POST(request) {
  try {
    const { firstName, lastName, email, password } = await request.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    if (String(password).length < 8) {
      return NextResponse.json(
        { message: "Password must contain at least 8 characters." },
        { status: 400 }
      );
    }

    const customer = await createCustomer({
      email,
      first_name: firstName,
      last_name: lastName,
      password,
      billing: { first_name: firstName, last_name: lastName, email },
      shipping: { first_name: firstName, last_name: lastName }
    });

    await createSession({
      id: customer.id,
      email: customer.email,
      first_name: customer.first_name,
      last_name: customer.last_name
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Unable to create account." },
      { status: 400 }
    );
  }
}
