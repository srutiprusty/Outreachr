import User from "@/models/User";
import Mail from "@/models/Mail";
import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { uploadDocument } from "@/lib/uploadDocument";

export const getMeController = async (userId: string) => {
  try {
    await connectDB();

    // ---------- User ----------
    const user = await User.findById(userId).select(
      "-password -emailAppPassword"
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // ---------- Mail Stats ----------
    const totalMails = await Mail.countDocuments({ user: userId });

    const totalSent = await Mail.countDocuments({
      user: userId,
      status: "sent",
    });

    const totalFailed = await Mail.countDocuments({
      user: userId,
      status: "failed",
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          user,
          mailStats: {
            totalMails,
            totalSent,
            totalFailed,
          },
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get me controller error:", error.message);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
};



export const updateUserController = async (
  req: NextRequest,
  userId: string
) => {
  try {
    await connectDB();

    const formData = await req.formData();

    const name = formData.get("name") as string | null;
    const phone = formData.get("phone") as string | null; // 👈 added
    const portfolioUrl = formData.get("portfolioUrl") as string | null;
    const githubUrl = formData.get("githubUrl") as string | null;
    const linkedinUrl = formData.get("linkedinUrl") as string | null;

    const resumeFile = formData.get("resume") as File | null;
    const coverFile = formData.get("coverLetter") as File | null;

    const updateData: any = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone; // 👈 added
    if (portfolioUrl) updateData.portfolioUrl = portfolioUrl;
    if (githubUrl) updateData.githubUrl = githubUrl;
    if (linkedinUrl) updateData.linkedinUrl = linkedinUrl;

    // ---------- Resume Upload ----------
    if (resumeFile) {
      const bytes = await resumeFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploaded = await uploadDocument(
        buffer,
        "user-documents/resume",
        resumeFile.name
      );

      updateData.resume = {
        url: uploaded.url,
        fileName: resumeFile.name,
      };
    }

    // ---------- Cover Letter Upload ----------
    if (coverFile) {
      const bytes = await coverFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploaded = await uploadDocument(
        buffer,
        "user-documents/cover-letter",
        coverFile.name
      );

      updateData.coverLetter = {
        url: uploaded.url,
        fileName: coverFile.name,
      };
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      {
        new: true,
        select: "-password -emailAppPassword",
      }
    );

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    console.error("Update user error:", error.message);
    return NextResponse.json(
      { success: false, message: "Update failed" },
      { status: 500 }
    );
  }
};

