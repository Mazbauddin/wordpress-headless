import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

function secret() {
  if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET is not configured.");
  }
  return new TextEncoder().encode(process.env.SESSION_SECRET);
}

export async function createSession(user) {
  const token = await new SignJWT({ userId: Number(user.id) })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());

  const cookieStore = await cookies();
  cookieStore.set("customer_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/"
  });
}

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("customer_session")?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secret());
    return payload;
  } catch {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("customer_session");
}
