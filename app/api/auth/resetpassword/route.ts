import { resetPassword } from "@/controllers/auth.controller";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { token, password } = body;
  return resetPassword(token, password);
}
