import { NextRequest } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import { getAllMailsController } from "@/controllers/email.controller";

export async function GET(req: NextRequest) {
  // ---------- Auth ----------
  const auth = authMiddleware(req);
  if (auth instanceof Response) return auth;

  // ---------- Controller ----------
  return getAllMailsController(auth.userId);
}
