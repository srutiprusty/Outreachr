"use client";

import React, { useState } from "react";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";


export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        emailAppPassword: "",
    });

    const router = useRouter();
    const { name, email, password, emailAppPassword } = formData;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await api.post("/register", formData);
            toast.success(
                response.data.message ||
                "Registration successful. Please verify your email."
            );

            setTimeout(() => {
                router.push("/login");
            }, 2500);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#1a1a1a] relative overflow-hidden">

            {/* Background Glow */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#9B99FF] rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#9B99FF] rounded-full opacity-20 blur-3xl"></div>

            <div className="w-full max-w-md relative z-10">

                {/* Register Card */}
                <div className="bg-[#121212] rounded-3xl shadow-2xl p-10 border border-gray-800/50">

                    <h2 className="text-3xl font-extrabold text-white text-center mb-3">
                        Create Your Account
                    </h2>

                    <div className="flex justify-center mb-4">
                        <Image
                            src={logo}
                            alt="Mailer Logo"
                            width={150}
                            height={150}
                            priority
                        />
                    </div>

                    <p className="text-center text-[#B0B0B0] mb-8">
                        Start automating your emails with AI
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Full Name
                            </label>
                            <input
                                name="name"
                                type="text"
                                value={name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-[#1e1e1e] text-white
              border border-gray-700 focus:border-[#9B99FF]
              focus:ring-2 focus:ring-[#9B99FF]/30 outline-none
              transition-all duration-200"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Email Address
                            </label>
                            <input
                                name="email"
                                type="email"
                                value={email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-[#1e1e1e] text-white
              border border-gray-700 focus:border-[#9B99FF]
              focus:ring-2 focus:ring-[#9B99FF]/30 outline-none
              transition-all duration-200"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Password
                            </label>
                            <input
                                name="password"
                                type="password"
                                value={password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-[#1e1e1e] text-white
              border border-gray-700 focus:border-[#9B99FF]
              focus:ring-2 focus:ring-[#9B99FF]/30 outline-none
              transition-all duration-200"
                            />
                        </div>

                        {/* Email App Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Email App Password
                            </label>
                            <input
                                name="emailAppPassword"
                                type="password"
                                value={emailAppPassword}
                                onChange={handleChange}
                                placeholder="16-digit app password"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-[#1e1e1e] text-white
              border border-gray-700 focus:border-[#9B99FF]
              focus:ring-2 focus:ring-[#9B99FF]/30 outline-none
              transition-all duration-200"
                            />
                            <p className="mt-2 text-xs text-gray-500">
                                Required for sending emails securely from your account
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-3 rounded-lg bg-[#9B99FF] text-black
            font-bold shadow-[0_0_20px_rgba(155,153,255,0.5)]
            hover:bg-white hover:shadow-[0_0_30px_rgba(155,153,255,0.7)]
            hover:-translate-y-1 transition-all duration-300 mt-4"
                        >
                            Create Account
                        </button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-800"></div>
                            </div>
                            <div className="relative flex justify-center text-sm bg-[#121212] px-4 text-gray-400">
                                Already have an account?
                                <Link
                                    href="/login"
                                    className="ml-1 font-semibold text-[#9B99FF] hover:text-white"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );

}