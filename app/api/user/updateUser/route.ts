import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import { updateUserController } from "@/controllers/user.controller";

export async function PUT(req: NextRequest) {
  const auth = authMiddleware(req);
  if (auth instanceof Response) return auth;

  return updateUserController(req, auth.userId);
}
