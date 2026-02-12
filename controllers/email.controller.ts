import nodemailer from "nodemailer";
import mongoose from "mongoose";
import Mail from "@/models/Mail";
import User from "@/models/User";
import { uploadDocument } from "@/lib/uploadDocument";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function sendMailController(
  formData: FormData,
  userCredentials: {
    userId: string;
    userEmail: string;
    emailAppPassword: string;
  }
) {
  const toRaw = formData.get("to") as string;
  const subject = formData.get("subject") as string;
  const content = formData.get("body") as string;

  if (!toRaw || !subject || !content) {
    throw new Error("Missing required fields");
  }

  const recipients = toRaw
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  if (!recipients.length) {
    throw new Error("No valid recipients");
  }

  // ---------- Sender name ----------
  const user = await User.findById(userCredentials.userId)
    .select("name")
    .lean();

  const senderName =
    user?.name ?? userCredentials.userEmail.split("@")[0];

  // ---------- Upload files ONCE ----------
  const resume = formData.get("resume") as File | null;
  const coverLetter = formData.get("coverLetter") as File | null;

  let resumeUrl: string | undefined;
  let coverLetterUrl: string | undefined;
  const attachments: any[] = [];

  if (resume && resume.size > 0) {
    const buffer = Buffer.from(await resume.arrayBuffer());
    const uploaded = await uploadDocument(
      buffer,
      "mails/resumes",
      resume.name
    );
    resumeUrl = uploaded.url;
    attachments.push({ filename: resume.name, path: resumeUrl });
  }

  if (coverLetter && coverLetter.size > 0) {
    const buffer = Buffer.from(await coverLetter.arrayBuffer());
    const uploaded = await uploadDocument(
      buffer,
      "mails/cover-letters",
      coverLetter.name
    );
    coverLetterUrl = uploaded.url;
    attachments.push({ filename: coverLetter.name, path: coverLetterUrl });
  }

  // ---------- Transporter ----------
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: userCredentials.userEmail,
      pass: userCredentials.emailAppPassword,
    },
  });

  // ---------- RESULT TRACKING ----------
  const summary = {
    sent: 0,
    failed: 0,
    details: [] as {
      email: string;
      status: "sent" | "failed";
      error?: string;
    }[],
  };

  // ---------- SEND + SAVE ----------
  for (const receiverEmail of recipients) {
    try {
      await transporter.sendMail({
        from: `"${senderName}" <${userCredentials.userEmail}>`,
        to: receiverEmail,
        subject,
        text: content,
        attachments,
      });

      await Mail.create({
        user: new mongoose.Types.ObjectId(userCredentials.userId),
        senderEmail: userCredentials.userEmail,
        receiverEmail,
        resumeUrl,
        coverLetterUrl,
        subject,
        content,
        sentAt: new Date(),
        status: "sent",
      });

      summary.sent++;
      summary.details.push({
        email: receiverEmail,
        status: "sent",
      });
    } catch (err: any) {
      await Mail.create({
        user: new mongoose.Types.ObjectId(userCredentials.userId),
        senderEmail: userCredentials.userEmail,
        receiverEmail,
        resumeUrl,
        coverLetterUrl,
        subject,
        content,
        sentAt: new Date(),
        status: "failed",
        errorMessage: err?.message || "Email send failed",
      });

      summary.failed++;
      summary.details.push({
        email: receiverEmail,
        status: "failed",
        error: err?.message || "Email send failed",
      });
    }
  }

  return {
    success: true,
    total: recipients.length,
    sent: summary.sent,
    failed: summary.failed,
    details: summary.details,
  };
}

export const getAllMailsController = async (userId: string) => {
  try {
    await connectDB();

    const mails = await Mail.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: mails,
    });
  } catch (error: any) {
    console.error("Get mails controller error:", error.message);
    return NextResponse.json(
      { success: false, message: "Failed to fetch mails" },
      { status: 500 }
    );
  }
}