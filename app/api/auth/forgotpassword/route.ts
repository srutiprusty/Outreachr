import { NextRequest, NextResponse } from "next/server";
import { forgotPassword } from "@/controllers/auth.controller";

export async function POST(req: NextRequest) {
  return forgotPassword(req);
}
