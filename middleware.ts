// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["en","fr","es","id","pt","sv","ar","zh","de","hu","hi"];

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // 1) redirect bare "/" to "/en"
  if (pathname === "/") {
    url.pathname = "/en";
    return NextResponse.redirect(url);
  }

  // 2) handle platform/locale rewrites:
  //    /facebook-video-downloader/pt  → /pt/facebook-video-downloader
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 2 && LOCALES.includes(parts[1])) {
    url.pathname = `/${parts[1]}/${parts[0]}`;
    return NextResponse.rewrite(url);
  }

  // 3) socket.io rule (if you still need it)
  if (pathname.startsWith("/socket.io")) {
    return NextResponse.rewrite(new URL("/api/socket", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",                                    // catch the root
    "/facebook-video-downloader/:locale",
    "/instagram-video-downloader/:locale",
    "/tiktok-video-downloader/:locale",
    "/snapchat-video-downloader/:locale",
    "/socket.io/:path*",
  ],
};
