import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminActor } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  if (!(await getAdminActor(req, "communications"))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const result = await db.query("SELECT id, subject, html_content, updated_at FROM email_templates ORDER BY id");
    return NextResponse.json({ templates: result.rows }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Email template list failed:", error);
    return NextResponse.json({ error: "Failed to fetch templates." }, { status: 503 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await getAdminActor(req, "communications"))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid email template details." }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const htmlContent = typeof body.html_content === "string" ? body.html_content : "";

  if (!/^[a-z0-9_-]{1,50}$/i.test(id) || !subject || subject.length > 250 ||
      !htmlContent.trim() || htmlContent.length > 100000) {
    return NextResponse.json({ error: "Provide a valid template ID, subject (up to 250 characters) and HTML body (up to 100 KB)." }, { status: 400 });
  }

  try {
    const result = await db.query(
      "UPDATE email_templates SET subject = $1, html_content = $2, updated_at = NOW() WHERE id = $3 RETURNING id, updated_at",
      [subject, htmlContent, id]
    );
    if (!result.rowCount) {
      return NextResponse.json({ error: "Email template not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, template: result.rows[0] });
  } catch (error) {
    console.error("Email template update failed:", error);
    return NextResponse.json({ error: "Failed to update template." }, { status: 503 });
  }
}
