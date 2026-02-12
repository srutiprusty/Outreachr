import mongoose, { Schema, models, model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  emailAppPassword: string;
  isVerified?: boolean;

  phone?: string; 

  resume: {
    url: string;
    fileName?: string;
  };

  coverLetter?: {
    url: string;
    fileName?: string;
  };

  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}


const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    emailAppPassword: {
      type: String,
      required: true,
      select: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    resume: {
      url: {
        type: String,
      },
      fileName: {
        type: String,
      },
    },

    coverLetter: {
      url: {
        type: String,
      },
      fileName: {
        type: String,
      },
    },

    portfolioUrl: {
      type: String,
      trim: true,
    },

    githubUrl: {
      type: String,
      trim: true,
    },

    linkedinUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);


const User = models.User || model<IUser>("User", UserSchema);
export default User;
