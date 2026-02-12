import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const resume = formData.get("resume") as File | null;
    const jd = formData.get("jd") as File | null;
    const context = (formData.get("context") as string) || "";

    let extractedText = context.trim();



    // ---------- OCR.space helper ----------
    const runOCR = async (file: File) => {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("language", "eng");
      fd.append("isOverlayRequired", "false");

      const res = await fetch("https://api.ocr.space/parse/image", {
        method: "POST",
        headers: {
          apikey: process.env.OCR_SPACE_KEY!,
        },
        body: fd,
      });

      const data = await res.json();

      return (
        data?.ParsedResults
          ?.map((r: any) => r.ParsedText)
          .join("\n")
          .trim() || ""
      );
    };

    // ---------- RESUME ----------
    if (resume) {
      try {
        extractedText += `\n\nResume:\n${await runOCR(resume)}`;
      } catch (err) {
        console.error("OCR failed for resume:", err);
      }
    }


    // ---------- JOB DESCRIPTION ----------
    if (jd) {
      extractedText += `\n\nJob Description:\n${await runOCR(jd)}`;
    }

    if (!extractedText.trim()) {
      return NextResponse.json(
        { success: false, message: "No text extracted" },
        { status: 400 }
      );
    }

    // ---------- PROMPT ----------
    const prompt = `
You are writing a cold job application email.

Using the information below, generate:

1. A concise, professional EMAIL SUBJECT (max 10 words)
2. A short, professional EMAIL BODY

Return output strictly in this format:

SUBJECT:
<subject here>

BODY:
<body here>

Information:
${extractedText}

Guidelines:
- Professional tone
- Concise
- Job application focused
- No emojis
`;


    let email = "";
    let subject = "";
    let body = "";


    // ===============================
    // 🔹 TRY GROQ FIRST
    // ===============================
    try {
      const groqRes = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
          }),
        }
      );

      const groqData = await groqRes.json();

      if (groqRes.ok) {
        email =
          groqData?.choices?.[0]?.message?.content ||
          groqData?.choices?.[0]?.text ||
          "";
      } else {
        console.warn("Groq failed, falling back to Gemini:", groqData);
      }
    } catch (err) {
      console.warn("Groq error, falling back to Gemini:", err);
    }

    // ===============================
    // 🔹 FALLBACK TO GEMINI
    // ===============================
    if (!email) {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );

      const geminiData = await geminiRes.json();

      if (!geminiRes.ok) {
        throw new Error(
          geminiData?.error?.message || "Gemini API failed"
        );
      }



      email =
        geminiData?.candidates?.[0]?.content?.parts
          ?.map((p: any) => p.text)
          .join("") || "";

    }


    // ---------- PARSE SUBJECT & BODY ----------
    body = email;

    const subjectMatch = email.match(/SUBJECT:\s*(.+)/i);
    const bodyMatch = email.match(/BODY:\s*([\s\S]*)/i);

    if (subjectMatch) subject = subjectMatch[1].trim();
    if (bodyMatch) body = bodyMatch[1].trim();

    // fallback subject (safety)
    if (!subject) {
      subject = "Job Application";
    }



    return NextResponse.json({
      success: true,
      subject,
      email: body,
    });

  } catch (err: any) {
    console.error("Coldmail error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
