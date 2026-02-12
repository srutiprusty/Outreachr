"use client";

import { useMe } from "@/hooks/useMe";
import { Mail, Send, XCircle } from "lucide-react";

export default function DashboardPage() {
  const { data, loading, error } = useMe();

  if (loading)
    return <p className="text-gray-500">Loading dashboard...</p>;
  if (error)
    return <p className="text-red-500">{error}</p>;

  const stats = data?.mailStats;

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-6">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total Mails */}
        <div className="bg-[#121212] p-6 rounded-2xl border border-gray-800/50 
      shadow-lg hover:shadow-[#9B99FF]/10 hover:-translate-y-1 
      transition-all duration-300 flex items-center gap-4">

          <div className="p-3 rounded-full bg-[#9B99FF]/10 text-[#9B99FF]">
            <Mail size={24} />
          </div>

          <div>
            <p className="text-sm text-gray-400">Total Mails</p>
            <p className="text-3xl font-bold text-white">
              {stats?.totalMails ?? 0}
            </p>
          </div>
        </div>

        {/* Sent Mails */}
        <div className="bg-[#121212] p-6 rounded-2xl border border-gray-800/50 
      shadow-lg hover:shadow-green-500/10 hover:-translate-y-1 
      transition-all duration-300 flex items-center gap-4">

          <div className="p-3 rounded-full bg-green-500/10 text-green-400">
            <Send size={24} />
          </div>

          <div>
            <p className="text-sm text-gray-400">Sent</p>
            <p className="text-3xl font-bold text-green-400">
              {stats?.totalSent ?? 0}
            </p>
          </div>
        </div>

        {/* Failed Mails */}
        <div className="bg-[#121212] p-6 rounded-2xl border border-gray-800/50 
      shadow-lg hover:shadow-red-500/10 hover:-translate-y-1 
      transition-all duration-300 flex items-center gap-4">

          <div className="p-3 rounded-full bg-red-500/10 text-red-400">
            <XCircle size={24} />
          </div>

          <div>
            <p className="text-sm text-gray-400">Failed</p>
            <p className="text-3xl font-bold text-red-400">
              {stats?.totalFailed ?? 0}
            </p>
          </div>
        </div>

      </div>
    </div>
  );

}
