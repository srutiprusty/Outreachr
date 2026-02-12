import { verifyEmail } from "@/controllers/auth.controller";
import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ token: string }> }
) {
    const { token } = await context.params;
    return verifyEmail(token);
}
