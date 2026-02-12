import { NextRequest } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import { getMeController } from "@/controllers/user.controller";

export async function GET(req: NextRequest) {
  const auth = authMiddleware(req);

  // If auth failed → response already returned
  if (auth instanceof Response) return auth;

  // auth contains decoded payload
  return getMeController(auth.userId);
}
