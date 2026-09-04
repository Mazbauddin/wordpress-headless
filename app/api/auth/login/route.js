import { NextResponse } from "next/server";
import { createSession } from "@/lib/session";

const WP_URL = process.env.WORDPRESS_URL;

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    const response = await fetch(`${WP_URL}/wp-json/eis/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store"
    });

    const user = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    await createSession(user);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      }
    });
  } catch {
    return NextResponse.json({ message: "Login failed." }, { status: 500 });
  }
}
