"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { removeToken } from "@/utils/auth";
import { toast } from "sonner";
import Image from "next/image";
import logoo from "@/public/logoo.png";
import { Home, Send, Clock, Sparkles, User, LogOut } from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    removeToken();
    toast.success("Logged out successfully");
    router.push("/login");
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
    <aside className="w-64  bg-[#121212] text-white hidden md:flex flex-col border-r border-gray-800/30">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800/30 flex items-center justify-center">
        <Image
          src={logoo}
          alt="Mailer Logo"
          width={140}
          height={140}
          priority
        />
      </div>

      <nav className="flex-1 p-4 space-y-1.5 flex flex-col">
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
            >
              <Icon className="w-5 h-5" />
              <span className="font-bold">{item.label}</span>
            </Link>
          );
        })}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl
          text-gray-400 hover:text-red-400
          hover:bg-red-500/10
          border-t border-gray-800/30 mt-4 pt-6
          transition-all duration-300 font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-bold">Logout</span>
        </button>
      </nav>
    </aside>
  );
}