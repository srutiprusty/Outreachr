"use client";

import React, { useState } from "react";
import api from "@/utils/api";
import { toast } from "sonner";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post("/forgotpassword", { email });
            toast.success(response.data.message);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to send reset email");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#1a1a1a]">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#9B99FF] rounded-full opacity-10 blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#9B99FF] rounded-full opacity-10 blur-3xl"></div>
            </div>

            <div className="w-full max-w-md relative">
                {/* Forgot Password Card */}
                <div className="bg-[#121212] rounded-3xl shadow-2xl p-8 border border-gray-800/50">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <svg className="w-8 h-8 text-[#9B99FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-white">
                            Forgot Password
                        </h2>
                    </div>

                    <p className="text-[#B0B0B0] text-center mb-6">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full px-4 py-3.5 rounded-xl bg-[#1a1a1a] text-white placeholder-gray-500
                                border border-gray-800 focus:border-[#9B99FF] focus:ring-2 focus:ring-[#9B99FF]/20
                                outline-none transition-all duration-200"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl bg-[#9B99FF]
                            text-black font-semibold shadow-[0_0_20px_rgba(155,153,255,0.3)]
                            hover:shadow-[0_0_30px_rgba(155,153,255,0.5)] hover:bg-white hover:scale-[1.02]
                            active:scale-[0.98] transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>

                    {/* Back to Login Link */}
                    <div className="text-center mt-6">
                        <Link
                            href="/login"
                            className="text-sm text-[#9B99FF] hover:text-white font-medium transition-colors duration-200"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}