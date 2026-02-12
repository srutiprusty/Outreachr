"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/utils/auth";

/* 🔹 USER INTERFACE (from your schema) */
export interface UserProfile {
  name: string;
  email: string;
  isVerified?: boolean;
  phone?: string;

  resume?: {
    url?: string;
    fileName?: string;
  };

  coverLetter?: {
    url?: string;
    fileName?: string;
  };

  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;

  createdAt?: string;
  updatedAt?: string;
}

/* 🔹 MAIL STATS */
interface MailStats {
  totalMails: number;
  totalSent: number;
  totalFailed: number;
}

/* 🔹 FINAL RESPONSE SHAPE */
interface MeResponse {
  user: UserProfile;
  mailStats: MailStats;
}

export function useMe() {
  const [data, setData] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = getToken();
        if (!token) {
          setError("Unauthorized");
          return;
        }

        const res = await fetch("/api/user/getUser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();

        if (!res.ok || !json.success) {
          setError(json.message || "Failed to fetch user");
          return;
        }

        // 👇 VERY IMPORTANT (correct shape)
        setData(json.data);
      } catch (err) {
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  return { data, loading, error };
}
