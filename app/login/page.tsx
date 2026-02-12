"use client";

import React, { useEffect, useState, Suspense } from "react";
import api from "@/utils/api";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken } from "@/utils/auth";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";


function LoginContent() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");

  useEffect(() => {
    if (verified) {
      toast.success("Email verified successfully. Please login.");
    }
  }, [verified]);

  const { email, password } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", formData);
      setToken(response.data.token);
      toast.success(response.data.message);
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#1a1a1a] relative overflow-hidden">

      {/* Background Glow Effects */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#9B99FF] rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#9B99FF] rounded-full opacity-20 blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">

        {/* Login Card */}
        <div className="bg-[#121212] rounded-3xl shadow-2xl p-10 border border-gray-800/50">

          <h2 className="text-3xl font-extrabold text-white text-center mb-3">
            Welcome Back
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
            Sign in to continue your email automation journey
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email Address
              </label>
              <input
                id="email"
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                Password
              </label>
              <input
                id="password"
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

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                href="/forgotpassword"
                className="text-sm text-[#9B99FF] hover:text-white transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-[#9B99FF] text-black 
            font-bold shadow-[0_0_20px_rgba(155,153,255,0.5)]
            hover:bg-white hover:shadow-[0_0_30px_rgba(155,153,255,0.7)]
            hover:-translate-y-1 transition-all duration-300"
            >
              Sign In
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm bg-[#121212] px-4 text-gray-400">
                New to Mailer?
                <Link
                  href="/register"
                  className="ml-1 font-semibold text-[#9B99FF] hover:text-white"
                >
                  Create Account
                </Link>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );


}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
