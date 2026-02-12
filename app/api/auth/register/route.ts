import { register, login, verifyEmail } from "@/controllers/auth.controller";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    return register(req);
}
