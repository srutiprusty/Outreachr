import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { sendEmail } from "@/lib/verificationEmail";
import { encryptPassword } from "@/lib/encryption";
import { NextRequest, NextResponse } from "next/server";

export const register = async (req: NextRequest) => {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, password, emailAppPassword } = body;
    if (!name || !email || !password || !emailAppPassword) {
      return NextResponse.json(
        { message: "Something is missing", success: false },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        {
          message: "User already exist with this email",
          success: false,
        },
        { status: 409 },
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const encryptedEmailAppPassword = encryptPassword(emailAppPassword);

    const JWT_SECRET = process.env.JWT_SECRET as string;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const verificationToken = jwt.sign({ email }, JWT_SECRET, {
      expiresIn: "24h",
    });

    await User.create({
      name,
      email,
      password: hashedPassword,
      emailAppPassword: encryptedEmailAppPassword,
      isVerified: false,
    });

    const verificationUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;
    const emailHtml = `
      <h1>Verify Your Email</h1>
      <p>Hi ${name},</p>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `;

    // Send verification email (await so errors surface)
    await sendEmail(email, "Email Verification", emailHtml);

    return NextResponse.json(
      {
        message: "Account created. Please verify your email",
        success: true,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        message: "Error creating account",
        success: false,
      },
      { status: 500 },
    );
  }
};

export const login = async (req: NextRequest) => {
  try {
    await connectDB();
    const body = await req.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json(
        { message: "", success: false },
        { status: 400 },
      );
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password", success: false },
        { status: 401 },
      );
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password", success: false },
        { status: 401 },
      );
    }
    if (!user.isVerified) {
      return NextResponse.json(
        {
          message: "Please verify your email first",
          success: false,
          isVerificationError: true,
        },
        { status: 403 },
      );
    }
    const JWT_SECRET = process.env.JWT_SECRET as string;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" },
    );
    return NextResponse.json(
      { message: "Login successful", success: true, token, user },
      { status: 200 },
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Server Error logging in", success: false },
      { status: 500 },
    );
  }
};

export const verifyEmail = async (token: string) => {
  try {
    await connectDB();

    if (!token) {
      return NextResponse.json(
        { message: "Verification token missing" },
        { status: 400 },
      );
    }

    const JWT_SECRET = process.env.JWT_SECRET as string;
    if (!JWT_SECRET) throw new Error("JWT_SECRET not defined");

    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    if (user.isVerified) {
      return NextResponse.json({
        message: "Email already verified",
        success: true,
      });
    }

    user.isVerified = true;
    await user.save();

    return NextResponse.json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 400 },
    );
  }
};

export const forgotPassword = async (req: NextRequest) => {
  try {
    await connectDB();
    const body = await req.json();
    const { email } = body;
    if (!email) {
      return NextResponse.json(
        { message: "Email is required", success: false },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          message:
            "If an account with that email exists, a reset link has been sent.",
          success: true,
        },
        { status: 200 },
      );
    }

    const JWT_SECRET = process.env.JWT_SECRET as string;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const resetToken = jwt.sign({ email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
    const emailHtml = `
      <h1>Reset Your Password</h1>
      <p>Hi ${user.name},</p>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    // Send reset email
    await sendEmail(email, "Password Reset", emailHtml);

    return NextResponse.json(
      {
        message:
          "If an account with that email exists, a reset link has been sent.",
        success: true,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      {
        message: "Error sending reset email",
        success: false,
      },
      { status: 500 },
    );
  }
};

export const resetPassword = async (token: string, password: string) => {
  try {
    await connectDB();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and password are required", success: false },
        { status: 400 },
      );
    }

    const JWT_SECRET = process.env.JWT_SECRET as string;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid token", success: false },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json(
      { message: "Password reset successfully", success: true },
      { status: 200 },
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "Invalid or expired token", success: false },
      { status: 400 },
    );
  }
};
