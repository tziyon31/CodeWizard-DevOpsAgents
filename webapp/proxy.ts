import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/api/health") return NextResponse.next();
  const password = process.env.REVIEW_PASSWORD;
  if (!password) return new NextResponse("Access is not configured", { status: 503 });
  const expected = "Basic " + Buffer.from(`tziyon:${password}`).toString("base64");
  const digest = (value: string) => createHash("sha256").update(value).digest();
  if (!timingSafeEqual(digest(request.headers.get("authorization") || ""), digest(expected))) {
    return new NextResponse("Sign in", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Tziyon Jobs", charset="UTF-8"', "Cache-Control": "no-store" },
    });
  }
  if (request.nextUrl.pathname.startsWith("/api/whatsapp") || request.nextUrl.pathname.startsWith("/whatsapp") || request.nextUrl.pathname === "/agents/whatsapp") {
    return new NextResponse("WhatsApp is disabled on this deployment", { status: 404 });
  }
  return NextResponse.next();
}

export const config = { matcher: "/:path*" };
