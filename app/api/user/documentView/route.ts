import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";

export async function GET(req: NextRequest) {
  

  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { success: false, message: "URL missing" },
      { status: 400 }
    );
  }

  // Fetch from Cloudinary
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
    },
  });
}
