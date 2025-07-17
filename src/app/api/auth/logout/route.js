import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();

  const authCookie = process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token";

  cookieStore.set(authCookie, "", {
    path: "/",
    expires: new Date(0),
    secure: true, 
    httpOnly: true,
    sameSite: "lax", 
  });

  const url = new URL("/", process.env.NEXTAUTH_URL);

  return NextResponse.redirect(url);
}