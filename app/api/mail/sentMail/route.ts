import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import { sendMailController } from "@/controllers/email.controller";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { decryptPassword } from "@/lib/encryption";

export async function POST(req: NextRequest) {
  // ---------- AUTH ----------
  const auth = authMiddleware(req);
  if (auth instanceof Response) return auth;

  try {
    await connectDB();

    // ---------- USER ----------
    const user = await User.findById(auth.userId).select("+emailAppPassword");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const formData = await req.formData();

    // ---------- CALL YOUR EXISTING CONTROLLER ----------
    const result = await sendMailController(formData, {
      userId: auth.userId,
      userEmail: user.email,
      emailAppPassword: decryptPassword(user.emailAppPassword),
    });

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      result,
    });
  } catch (err: any) {
    console.error("Send mail error:", err.message);
    return NextResponse.json(
      { success: false, message: err.message || "Email sending failed" },
      { status: 500 }
    );
  }
}
