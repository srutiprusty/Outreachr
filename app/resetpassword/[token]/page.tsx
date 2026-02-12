"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
    const { token } = useParams();
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error">("error");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            setMessageType("error");
            return;
        }
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch("/api/auth/resetpassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, password }),
            });
            if (res.ok) {
                setMessage("Password reset successfully! Redirecting to login...");
                setMessageType("success");
                setTimeout(() => router.push("/login"), 2000);
            } else {
                const data = await res.json();
                setMessage(data.message || "Failed to reset password");
                setMessageType("error");
            }
        } catch (error) {
            setMessage("Something went wrong. Please try again.");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#1a1a1a] relative overflow-hidden">

            {/* Background Glow */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#9B99FF] rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#9B99FF] rounded-full opacity-20 blur-3xl"></div>

            <div className="w-full max-w-md relative z-10">

                {/* Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Mailer</h1>
                    <p className="text-[#B0B0B0] mt-2 text-sm">
                        AI-Powered Email Automation
                    </p>
                </div>

                {/* Card */}
                <div className="bg-[#121212] rounded-3xl shadow-2xl p-10 border border-gray-800/50">

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white">
                            Reset Password
                        </h2>
                        <p className="text-[#B0B0B0] mt-2 text-sm">
                            Enter your new password below
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                New Password
                            </label>
                            <input
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl bg-[#1e1e1e] text-white
              border border-gray-700 focus:border-[#9B99FF]
              focus:ring-2 focus:ring-[#9B99FF]/30 outline-none
              transition-all duration-200"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Confirm New Password
                            </label>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl bg-[#1e1e1e] text-white
              border border-gray-700 focus:border-[#9B99FF]
              focus:ring-2 focus:ring-[#9B99FF]/30 outline-none
              transition-all duration-200"
                            />
                        </div>

                        {/* Message */}
                        {message && (
                            <div
                                className={`p-4 rounded-xl text-sm font-medium border ${messageType === "success"
                                        ? "bg-green-900/30 text-green-400 border-green-700"
                                        : "bg-red-900/30 text-red-400 border-red-700"
                                    }`}
                            >
                                {message}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg bg-[#9B99FF] text-black
            font-bold shadow-[0_0_20px_rgba(155,153,255,0.5)]
            hover:bg-white hover:shadow-[0_0_30px_rgba(155,153,255,0.7)]
            hover:-translate-y-1 transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {loading ? "Resetting Password..." : "Reset Password"}
                        </button>

                        {/* Back to Login */}
                        <div className="text-center pt-4">
                            <Link
                                href="/login"
                                className="text-sm text-[#9B99FF] hover:text-white transition-colors"
                            >
                                ← Back to Login
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Security Tip */}
                <div className="mt-6 p-5 bg-[#121212] rounded-2xl border border-gray-800/50">
                    <p className="text-sm font-semibold text-white mb-2">
                        Security Tip
                    </p>
                    <p className="text-xs text-[#B0B0B0] leading-relaxed">
                        Choose a strong password with at least 8 characters including
                        uppercase, lowercase, numbers, and special characters.
                    </p>
                </div>

            </div>
        </div>
    );

}