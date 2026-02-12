"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/utils/auth";

type Mail = {
  _id: string;
  receiverEmail: string;
  subject: string;
  status: "sent" | "failed";
  createdAt: string;
  errorMessage?: string;
};

const ITEMS_PER_PAGE = 10;

export default function MailHistoryPage() {
  const [mails, setMails] = useState<Mail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchMails = async () => {
      try {
        const token = getToken();
        const res = await fetch("/api/mail/getMail", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const data = await res.json();
        if (!data.success) throw new Error(data.message);

        setMails(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMails();
  }, []);

  if (loading) return <p className="p-6 text-gray-600">Loading mails...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  const totalPages = Math.ceil(mails.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentMails = mails.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-[#1a1a1a] px-4 sm:px-6 py-8 text-white">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold">
          Mail History
        </h1>

        {/* Table Card */}
        <div className="bg-[#121212] rounded-2xl p-6 border border-gray-800/50">

          <div className="overflow-x-auto">
            <table className="min-w-[800px] w-full text-sm sm:text-base">

              {/* Table Head */}
              <thead>
                <tr className="text-gray-400 text-sm border-b border-gray-800">
                  <th className="text-left py-3 px-4 font-semibold">
                    To
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Subject
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Date
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>

                {currentMails.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-8 text-gray-500"
                    >
                      No emails found
                    </td>
                  </tr>
                )}

                {currentMails.map((mail) => (
                  <tr
                    key={mail._id}
                    className="border-b border-gray-800 hover:bg-[#1e1e1e] transition-all duration-200"
                  >
                    <td className="py-4 px-4 text-gray-300 whitespace-nowrap">
                      {mail.receiverEmail}
                    </td>

                    <td className="py-4 px-4 text-gray-400 max-w-[300px] truncate">
                      {mail.subject || "-"}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${mail.status === "failed"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-green-500/20 text-green-400 border border-green-500/30"
                          }`}
                      >
                        {mail.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-gray-500 whitespace-nowrap">
                      {new Date(mail.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center gap-3">

            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 rounded-lg border border-gray-700 
            hover:bg-[#1e1e1e] transition-all disabled:opacity-40"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg transition-all ${currentPage === i + 1
                  ? "bg-[#9B99FF] text-black font-semibold shadow-[0_0_15px_rgba(155,153,255,0.5)]"
                  : "border border-gray-700 hover:bg-[#1e1e1e]"
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 rounded-lg border border-gray-700 
            hover:bg-[#1e1e1e] transition-all disabled:opacity-40"
            >
              Next
            </button>

          </div>
        )}
      </div>
    </div>
  );

}
