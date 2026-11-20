import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

function isAuthorized(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  return token === process.env.ADMIN_ACCESS_TOKEN;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const res = await db.query("SELECT id, subject, html_content, updated_at FROM email_templates ORDER BY id");
    return NextResponse.json({ templates: res.rows });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, subject, html_content } = await req.json();
    
    await db.query(
      "UPDATE email_templates SET subject = $1, html_content = $2, updated_at = NOW() WHERE id = $3",
      [subject, html_content, id]
    );

    return NextResponse.json({ ok: true, message: "Template updated successfully." });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 });
  }
}
