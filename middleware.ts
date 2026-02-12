import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Middleware is now handled in individual route handlers
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
//disabled middleware
