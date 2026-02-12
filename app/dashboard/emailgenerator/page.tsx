"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ColdMailPage() {
  const router = useRouter();

  const [contextText, setContextText] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [jd, setJd] = useState<File | null>(null);

  const [generatedSubject, setGeneratedSubject] = useState("");
  const [generatedMail, setGeneratedMail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ---------------------------
  // Generate Cold Email
  // ---------------------------
  const generateColdMail = async () => {
    try {
      setLoading(true);
      setError("");
      setGeneratedMail("");
      setGeneratedSubject("");

      const formData = new FormData();
      formData.append("context", contextText);
      if (resume) formData.append("resume", resume);
      if (jd) formData.append("jd", jd);

      const res = await fetch("/api/mail/coldmail", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to generate email");
      }

      setGeneratedSubject(data.subject || "");
      setGeneratedMail(data.email || "");
    } catch (err: any) {
      setError(err.message || "Failed to generate email");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Copy Email Body
  // ---------------------------
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedMail);
    alert("Copied to clipboard ✅");
  };

  // ---------------------------
  // Go to Send Mail Page
  // ---------------------------
  const goToSendPage = () => {
    localStorage.setItem(
      "generatedColdMailData",
      JSON.stringify({
        subject: generatedSubject,
        body: generatedMail,
      })
    );

    router.push("/dashboard/sendmail");
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] px-4 sm:px-6 py-8 text-white">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold">
          Cold Email Generator
        </h1>

        {/* Context */}
        <div className="bg-[#121212] rounded-2xl p-6 border border-gray-800/50 space-y-3">
          <label className="text-sm font-semibold text-gray-400">
            Context
          </label>
          <textarea
            value={contextText}
            onChange={(e) => setContextText(e.target.value)}
            placeholder="Your skills, experience, company info..."
            className="w-full min-h-[160px] sm:min-h-[200px]
            bg-[#1e1e1e] border border-gray-700 rounded-xl p-4
            text-white placeholder:text-gray-500
            outline-none focus:ring-2 focus:ring-[#9B99FF]/40
            focus:border-[#9B99FF]
            transition-all duration-200"
          />
        </div>

        {/* Uploads */}
        <div className="bg-[#121212] rounded-2xl p-6 border border-gray-800/50 grid grid-cols-1 sm:grid-cols-2 gap-6">

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Resume
            </label>
            <input
              type="file"
              accept=".pdf,image/*"
              className="text-sm text-gray-300 file:bg-[#1e1e1e] file:border file:border-gray-700 
            file:text-gray-300 file:px-3 file:py-2 file:rounded-lg file:cursor-pointer"
              onChange={(e) => setResume(e.target.files?.[0] || null)}
            />
            {resume && (
              <p className="text-xs text-gray-500 mt-2">
                {resume.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Job Description (optional)
            </label>
            <input
              type="file"
              accept=".pdf,image/*"
              className="text-sm text-gray-300 file:bg-[#1e1e1e] file:border file:border-gray-700 
            file:text-gray-300 file:px-3 file:py-2 file:rounded-lg file:cursor-pointer"
              onChange={(e) => setJd(e.target.files?.[0] || null)}
            />
            {jd && (
              <p className="text-xs text-gray-500 mt-2">
                {jd.name}
              </p>
            )}
          </div>

        </div>

        {/* Generate Button */}
        <button
          onClick={generateColdMail}
          disabled={loading}
          className="
          w-full sm:w-auto
          px-8 py-3 rounded-xl
          bg-[#9B99FF] text-black font-bold
          shadow-[0_0_20px_rgba(155,153,255,0.5)]
          hover:bg-white hover:shadow-[0_0_30px_rgba(155,153,255,0.7)]
          hover:-translate-y-1
          transition-all duration-300
          disabled:opacity-50 disabled:hover:translate-y-0
        "
        >
          {loading ? "Generating..." : "Generate Cold Email"}
        </button>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        {/* Result */}
        {generatedMail && (
          <div className="bg-[#121212] rounded-2xl p-6 border border-gray-800/50 space-y-5">

            {generatedSubject && (
              <input
                value={generatedSubject}
                readOnly
                className="
                w-full p-4 rounded-xl
                bg-[#1e1e1e] border border-gray-700
                text-white font-semibold
              "
              />
            )}

            <textarea
              value={generatedMail}
              readOnly
              className="
              w-full min-h-[220px] sm:min-h-[280px]
              p-4 rounded-xl
              bg-[#1e1e1e] border border-gray-700
              text-gray-300
              resize-none
            "
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={copyToClipboard}
                className="px-5 py-2 rounded-lg 
              border border-gray-700 
              hover:bg-[#1e1e1e] transition-all"
              >
                Copy
              </button>

              <button
                onClick={goToSendPage}
                className="px-5 py-2 rounded-lg 
              bg-green-500 text-black font-semibold
              hover:bg-green-400 transition-all"
              >
                Send
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );

}
