import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    await transporter.sendMail({
      from: `"Mailer App" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully to:", to);
  } catch (error) {
    console.error("Email send error:", error);
    throw new Error("Email could not be sent");
  }
};
