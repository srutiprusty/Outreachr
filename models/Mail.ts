import mongoose, { Schema, models, model } from "mongoose";

export interface IMail {
  user: mongoose.Types.ObjectId;
  senderEmail: string;
  receiverEmail: string;
  resumeUrl?: string;
  coverLetterUrl?: string;
  subject: string;
  content: string;
  sentAt: Date;
  status: "sent" | "failed";
  errorMessage?: string;
}

const MailSchema = new Schema<IMail>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    senderEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    receiverEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    resumeUrl: {
      type: String,
    },

    coverLetterUrl: {
      type: String,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    sentAt: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["sent", "failed"],
      default: "sent",
      index: true,
    },

    errorMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Mail = models.Mail || model<IMail>("Mail", MailSchema);
export default Mail;
