import { db } from "@/lib/db";
import { sendNotification } from "@/lib/email";

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char] || char);
}

export async function sendTemplatedNotification(
  templateId: string,
  to: string,
  variables: Record<string, string | number>
): Promise<boolean> {
  if (!to || !process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return false;
  }

  try {
    const result = await db.query(
      "SELECT subject, html_content FROM email_templates WHERE id = $1 LIMIT 1",
      [templateId]
    );
    const template = result.rows[0];
    if (!template) {
      console.warn("Email notification template is missing:", templateId);
      return false;
    }

    const replace = (content: string) =>
      content.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_match, key: string) =>
        escapeHtml(variables[key] ?? "")
      );

    return await sendNotification(to, replace(template.subject), replace(template.html_content));
  } catch (error) {
    console.error("Templated customer notification failed:", templateId, error);
    return false;
  }
}
