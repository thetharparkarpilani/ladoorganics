import nodemailer from "nodemailer";

export function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/\x27/g, "&#39;");
}


export async function sendNotification(to: string, subject: string, htmlContent: string) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP credentials missing in .env.local. Mocking email to:", to);
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Lado Organics" <hello@ladoorganics.in>',
      to,
      subject,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error("Email delivery failed:", error);
    return false;
  }
}
