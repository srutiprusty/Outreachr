"use client";

import { useState } from "react";
import Link from "next/link";
import { useMe } from "@/hooks/useMe";
import { useRouter, usePathname } from "next/navigation";
import { removeToken } from "@/utils/auth";
import { toast } from "sonner";
import Image from "next/image";
import logoo from "@/public/logoo.png";
import { Menu, X, Home, Send, Clock, Sparkles, User, LogOut } from "lucide-react";

export default function Topbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data } = useMe();
  const router = useRouter();
  const pathname = usePathname();

  const name = data?.user?.name || "User";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    removeToken();
    toast.success("Logged out successfully");
    router.push("/login");
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/sendmail", label: "Send Mail", icon: Send },
    { href: "/dashboard/history", label: "Mail History", icon: Clock },
    { href: "/dashboard/emailgenerator", label: "Email Generator", icon: Sparkles },
    { href: "/dashboard/profile", label: "Profile", icon: User }
  ];

  return (
    <>
      <header className="h-16 bg-[#1a1a1a] text-white border-b border-gray-800/30 flex items-center justify-between px-4 md:px-6">
        {/* Logo for mobile */}
        <div className="md:hidden flex items-center gap-2">
          <Image
            src={logoo}
            alt="Mailer Logo"
            width={120}
            height={120}
            priority
          />
        </div>

        {/* Desktop Title */}
        <h1 className="hidden md:block text-xl font-bold text-white">Dashboard</h1>

        {/* Desktop Profile */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-[#2a2a2d] transition-all duration-300"
          >
            <span className="text-sm text-gray-300 font-medium">{name}</span>
            <div className="w-10 h-10 rounded-full bg-[#9B99FF] text-[#1a1a1d] flex items-center justify-center font-bold text-sm shadow-lg shadow-purple-500/30">
              {initials}
            </div>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 hover:bg-[#2a2a2d] rounded-xl transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Sidebar Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Slide-out Menu */}
          <div className="fixed top-0 left-0 h-full w-72 bg-[#1a1a1d] text-white z-50 md:hidden shadow-2xl border-r border-gray-800/30">
            {/* Header */}
            <div className="p-6 border-b border-gray-800/30 flex items-center justify-between">
              <Image
                src={logoo}
                alt="Mailer Logo"
                width={130}
                height={130}
                priority
              />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-[#2a2a2d] rounded-xl transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Profile Section - Mobile */}
            <div className="p-4 border-b border-gray-800/30">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-12 h-12 rounded-full bg-[#9B99FF] text-[#1a1a1d] flex items-center justify-center font-bold shadow-lg shadow-purple-500/30">
                  {initials}
                </div>
                <div>
                  <p className="font-semibold text-white">{name}</p>
                  <p className="text-xs text-gray-400">Manage your account</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-4 py-3.5 rounded-xl
                      transition-all duration-300 font-medium
                      ${active
                        ? 'bg-[#9B99FF] text-[#1a1a1d] shadow-lg shadow-purple-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-[#2a2a2d]'
                      }
                    `}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl w-full
                text-gray-400 hover:text-red-400
                hover:bg-red-500/10
                border-t border-gray-800/30 mt-4 pt-6
                transition-all duration-300 font-medium"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </>
      )}
    </>
  );
}