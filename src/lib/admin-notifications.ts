import { sendNotification } from "@/lib/email";

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char] || char);
}

export async function sendAdminRequestAlert(
  requestType: string,
  summary: Record<string, string | number | null | undefined>
): Promise<boolean> {
  const recipient = process.env.ADMIN_NOTIFICATION_EMAIL?.trim();
  if (!recipient || !process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return false;
  }

  const rows = Object.entries(summary)
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .map(([label, value]) =>
      `<tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">${escapeHtml(label)}</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(value)}</td></tr>`
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#30291f;">
      <h2 style="color:#8b4b32;">New Lado Organics ${escapeHtml(requestType)}</h2>
      <p>A new customer request has been recorded and is awaiting your review.</p>
      <table style="width:100%;border-collapse:collapse;">${rows}</table>
      <p style="margin-top:24px;"><a href="https://ladoorganics.vercel.app/admin" style="display:inline-block;padding:12px 18px;background:#68452f;color:#fff;text-decoration:none;border-radius:8px;">Open Admin Dashboard</a></p>
      <p style="font-size:12px;color:#777;">This is an operational alert, not confirmation of payment or booking.</p>
    </div>`;

  try {
    return await sendNotification(
      recipient,
      `New Lado Organics request: ${requestType}`,
      html
    );
  } catch (error) {
    console.error("Admin request alert failed:", error);
    return false;
  }
}
