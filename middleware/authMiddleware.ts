import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export interface AuthPayload {
  userId: string;
  email?: string;
}

export const authMiddleware = (req: NextRequest): AuthPayload | NextResponse => {
  // 1️⃣ Get token (cookie OR header)
  const token =
    req.cookies.get("token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  // 2️⃣ Verify secret
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return NextResponse.json(
      { success: false, message: "Server configuration error" },
      { status: 500 }
    );
  }

  // 3️⃣ Verify token
  try {
    const decoded = jwt.verify(token, secret) as AuthPayload;
    return decoded;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid or expired token" },
      { status: 401 }
    );
  }
};
