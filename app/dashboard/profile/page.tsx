"use client";

import { useEffect, useState } from "react";
import { useMe } from "@/hooks/useMe";
import { getToken } from "@/utils/auth";
import { Edit } from "lucide-react"

export default function ProfilePage() {
  const { data, loading, error } = useMe();
  const user = data?.user;

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [phone, setPhone] = useState("");


  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      resetForm();
    }
  }, [user]);

  const resetForm = () => {
    setName(user?.name || "");
    setPhone(user?.phone || ""); // 👈 ADD THIS
    setPortfolioUrl(user?.portfolioUrl || "");
    setGithubUrl(user?.githubUrl || "");
    setLinkedinUrl(user?.linkedinUrl || "");
    setResume(null);
    setCoverLetter(null);
  };


  if (loading) return <p className="text-gray-700">Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const handleUpdate = async () => {
    try {
      setSaving(true);
      setMessage("");

      const token = getToken();
      if (!token) {
        setMessage("Unauthorized");
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone); // 👈 ADD THIS LINE
      formData.append("portfolioUrl", portfolioUrl);
      formData.append("githubUrl", githubUrl);
      formData.append("linkedinUrl", linkedinUrl);

      if (resume) formData.append("resume", resume);
      if (coverLetter) formData.append("coverLetter", coverLetter);

      const res = await fetch("/api/user/updateUser", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage(data.message || "Update failed");
        return;
      }

      setMessage("Profile updated successfully ✅");
      setIsEditing(false);
    } catch {
      setMessage("Server error");
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#1a1a1a] px-4 sm:px-6 py-8 text-white">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Profile
          </h1>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-[#9B99FF] font-semibold flex items-center gap-1 hover:underline">
              <Edit />Edit
            </button>
          )}
        </div>

        {/* Basic Info Card */}
        <div className="bg-[#121212] rounded-2xl p-6 border border-gray-800/50 space-y-6">

          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-400">Name</label>
            <input
              value={name}
              disabled={!isEditing}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-3 rounded-xl border outline-none transition-all
              ${isEditing
                  ? "bg-[#1e1e1e] border-gray-700 focus:ring-2 focus:ring-[#9B99FF]/40 focus:border-[#9B99FF]"
                  : "bg-[#1e1e1e] border-gray-800 text-gray-400"
                }`}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-400">Email</label>
            <input
              value={user?.email || ""}
              disabled
              className="w-full p-3 rounded-xl bg-[#1e1e1e] border border-gray-800 text-gray-500"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-400">Phone</label>
            <input
              type="tel"
              value={phone}
              disabled={!isEditing}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="Enter phone number"
              className={`w-full p-3 rounded-xl border outline-none transition-all
              ${isEditing
                  ? "bg-[#1e1e1e] border-gray-700 focus:ring-2 focus:ring-[#9B99FF]/40 focus:border-[#9B99FF]"
                  : "bg-[#1e1e1e] border-gray-800 text-gray-400"
                }`}
            />
          </div>

          {/* Portfolio */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-400">
              Portfolio
            </label>
            <input
              value={portfolioUrl}
              disabled={!isEditing}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              className={`w-full p-3 rounded-xl border outline-none transition-all
              ${isEditing
                  ? "bg-[#1e1e1e] border-gray-700 focus:ring-2 focus:ring-[#9B99FF]/40 focus:border-[#9B99FF]"
                  : "bg-[#1e1e1e] border-gray-800 text-gray-400"
                }`}
            />
          </div>

          {/* GitHub */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-400">GitHub</label>
            <input
              value={githubUrl}
              disabled={!isEditing}
              onChange={(e) => setGithubUrl(e.target.value)}
              className={`w-full p-3 rounded-xl border outline-none transition-all
              ${isEditing
                  ? "bg-[#1e1e1e] border-gray-700 focus:ring-2 focus:ring-[#9B99FF]/40 focus:border-[#9B99FF]"
                  : "bg-[#1e1e1e] border-gray-800 text-gray-400"
                }`}
            />
          </div>

          {/* LinkedIn */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-400">
              LinkedIn
            </label>
            <input
              value={linkedinUrl}
              disabled={!isEditing}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className={`w-full p-3 rounded-xl border outline-none transition-all
              ${isEditing
                  ? "bg-[#1e1e1e] border-gray-700 focus:ring-2 focus:ring-[#9B99FF]/40 focus:border-[#9B99FF]"
                  : "bg-[#1e1e1e] border-gray-800 text-gray-400"
                }`}
            />
          </div>

        </div>

        {/* Documents Card */}
        <div className="bg-[#121212] rounded-2xl p-6 border border-gray-800/50 space-y-6">
          <h2 className="font-semibold text-gray-300">Documents</h2>

          {/* Resume */}
          <div className="space-y-2 space-x-2">
            <label className="text-sm font-semibold text-gray-400">
              Resume
            </label>

            {isEditing && (
              <input
                type="file"
                className="text-sm text-gray-400 file:bg-[#1e1e1e] file:border file:border-gray-700 file:text-gray-300 file:px-3 file:py-2 file:rounded-lg file:cursor-pointer"
                onChange={(e) =>
                  setResume(e.target.files?.[0] || null)
                }
              />
            )}

            {user?.resume?.url && (
              <a
                href={`/api/user/documentView?url=${encodeURIComponent(
                  user.resume.url
                )}`}
                target="_blank"
                className="text-[#9B99FF] text-sm font-medium hover:underline"
              >
                View Resume
              </a>
            )}
          </div>

          {/* Cover Letter */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-400">
              Cover Letter
            </label>

            {isEditing && (
              <input
                type="file"
                className="text-sm text-gray-400 file:bg-[#1e1e1e] file:border file:border-gray-700 file:text-gray-300 file:px-3 file:py-2 file:rounded-lg file:cursor-pointer"
                onChange={(e) =>
                  setCoverLetter(e.target.files?.[0] || null)
                }
              />
            )}

            {user?.coverLetter?.url && (
              <a
                href={`/api/user/documentView?url=${encodeURIComponent(
                  user.coverLetter.url
                )}`}
                target="_blank"
                className="text-[#9B99FF] text-sm font-medium hover:underline"
              >
                View Cover Letter
              </a>
            )}
          </div>
        </div>

        {/* Actions */}
        {isEditing && (
          <div className="flex gap-4">
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="px-6 py-3 rounded-xl
              bg-[#9B99FF] text-black font-bold
              shadow-[0_0_20px_rgba(155,153,255,0.5)]
              hover:bg-white hover:shadow-[0_0_30px_rgba(155,153,255,0.7)]
              hover:-translate-y-1
              transition-all duration-300
              disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={() => {
                resetForm();
                setIsEditing(false);
              }}
              className="px-6 py-3 rounded-xl border border-gray-700 hover:bg-[#1e1e1e] transition-all"
            >
              Cancel
            </button>
          </div>
        )}

      </div>
    </div>
  );


}
