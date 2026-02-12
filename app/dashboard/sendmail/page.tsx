"use client";

import { useState } from "react";
import { Send, Paperclip, Mail } from "lucide-react";
import { getToken } from "@/utils/auth";

export default function SendEmailPage() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const recipients = to
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  const sendEmail = async () => {
    if (!to || !subject || !body) {
      setMessage("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("to", to);
      formData.append("subject", subject);
      formData.append("body", body);
      if (resume) formData.append("resume", resume);
      if (coverLetter) formData.append("coverLetter", coverLetter);

      const token = getToken();
      const headers: any = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch("/api/mail/sentMail", {
        method: "POST",
        body: formData,
        headers,
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Email sent successfully");
        setTo("");
        setSubject("");
        setBody("");
        setResume(null);
        setCoverLetter(null);
      } else {
        setMessage(data.message || "Failed to send email");
      }
    } catch {
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] px-4 sm:px-6 lg:px-10 py-8 text-white">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="p-4 rounded-full bg-[#9B99FF] text-black w-fit shadow-[0_0_20px_rgba(155,153,255,0.5)]">
            <Mail size={26} />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Email Sender
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              Send emails to multiple recipients
            </p>
          </div>
        </div>

        {/* Recipients Card */}
        <div className="bg-[#121212] rounded-2xl p-6 border border-gray-800/50 space-y-4">
          <p className="text-sm font-semibold text-gray-400">
            Recipients
          </p>

          <input
            type="text"
            placeholder="john@company.com, jane@startup.io"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="
            w-full rounded-xl px-4 py-3
            bg-[#1e1e1e]
            border border-gray-700
            text-white
            placeholder:text-gray-500
            outline-none
            focus:ring-2 focus:ring-[#9B99FF]/40
            focus:border-[#9B99FF]
            transition-all
          "
          />

          {/* Recipient Chips */}
          <div className="flex flex-wrap gap-2">
            {recipients.map((email, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full 
              bg-[#9B99FF]/20 text-[#9B99FF] 
              border border-[#9B99FF]/30 
              text-xs sm:text-sm"
              >
                {email}
              </span>
            ))}
          </div>
        </div>

        {/* Subject & Body Card */}
        <div className="bg-[#121212] rounded-2xl p-6 border border-gray-800/50 space-y-5">
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="
            w-full rounded-xl px-4 py-3
            bg-[#1e1e1e]
            border border-gray-700
            text-white
            placeholder:text-gray-500
            outline-none
            focus:ring-2 focus:ring-[#9B99FF]/40
            focus:border-[#9B99FF]
            transition-all
          "
          />

          <textarea
            placeholder="Write your email here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="
            w-full rounded-xl px-4 py-4
            min-h-[160px] sm:min-h-[200px]
            bg-[#1e1e1e]
            border border-gray-700
            text-gray-300
            placeholder:text-gray-500
            outline-none
            resize-none
            focus:ring-2 focus:ring-[#9B99FF]/40
            focus:border-[#9B99FF]
            transition-all
          "
          />
        </div>

        {/* Attachments Card */}
        <div className="bg-[#121212] rounded-2xl p-6 border border-gray-800/50 space-y-5">
          <p className="text-sm font-semibold text-gray-400 flex items-center gap-2">
            <Paperclip size={16} />
            Attachments
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="file"
              className="text-sm text-gray-400 
            file:bg-[#1e1e1e] 
            file:border file:border-gray-700 
            file:text-gray-300 
            file:px-3 file:py-2 
            file:rounded-lg 
            file:cursor-pointer"
              onChange={(e) => setResume(e.target.files?.[0] || null)}
            />
            <input
              type="file"
              className="text-sm text-gray-400 
            file:bg-[#1e1e1e] 
            file:border file:border-gray-700 
            file:text-gray-300 
            file:px-3 file:py-2 
            file:rounded-lg 
            file:cursor-pointer"
              onChange={(e) => setCoverLetter(e.target.files?.[0] || null)}
            />
          </div>

          {(resume || coverLetter) && (
            <p className="text-sm text-gray-500">
              {resume?.name}
              {coverLetter && `, ${coverLetter.name}`}
            </p>
          )}
        </div>

        {/* Send Button */}
        <button
          onClick={sendEmail}
          disabled={loading}
          className="
          w-full py-4 rounded-xl
          font-bold text-lg
          text-black
          flex items-center justify-center gap-2
          bg-[#9B99FF]
          shadow-[0_0_20px_rgba(155,153,255,0.5)]
          hover:bg-white
          hover:shadow-[0_0_30px_rgba(155,153,255,0.7)]
          hover:-translate-y-1
          transition-all duration-300
          disabled:opacity-50 disabled:hover:translate-y-0
        "
        >
          <Send size={18} />
          {loading ? "Sending..." : "Send to All Recipients"}
        </button>

        {message && (
          <p className="text-center text-sm text-green-400">
            {message}
          </p>
        )}
      </div>
    </div>
  );


}
