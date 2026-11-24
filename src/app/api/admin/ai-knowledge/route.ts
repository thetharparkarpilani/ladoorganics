import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminActor } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await getAdminActor(req, "content"))) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const [result, siteContent] = await Promise.all([
      db.query("SELECT id::text,category,title,question_patterns,answer,is_published,sort_order,updated_at FROM ai_knowledge ORDER BY category,title"),
      db.query("SELECT COUNT(*)::int AS published_count FROM site_content WHERE is_published=TRUE AND body <> ''"),
    ]);
    return NextResponse.json({ items: result.rows, publishedSiteContentCount: Number(siteContent.rows[0]?.published_count || 0) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("AI knowledge read failed:", error);
    return NextResponse.json({ error: "Run database migration 018 before using the AI Knowledge Library." }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await getAdminActor(req, "content"))) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const body = await req.json().catch(() => null);
  const category = typeof body?.category === "string" ? body.category.trim().toLowerCase().slice(0, 40) : "general";
  const title = typeof body?.title === "string" ? body.title.trim().slice(0, 160) : "";
  const patterns = typeof body?.questionPatterns === "string" ? body.questionPatterns.trim().slice(0, 1200) : "";
  const answer = typeof body?.answer === "string" ? body.answer.trim().slice(0, 4000) : "";
  const published = body?.isPublished !== false;
  const sortOrder = Number.isInteger(body?.sortOrder) ? Math.max(0, Math.min(9999, body.sortOrder)) : 100;
  if (!/^[a-z0-9_-]{2,40}$/.test(category) || title.length < 2 || patterns.length < 3 || answer.length < 10) {
    return NextResponse.json({ error: "Enter a valid category, title, example questions and answer." }, { status: 400 });
  }
  try {
    const result = await db.query(
      "INSERT INTO ai_knowledge(category,title,question_patterns,answer,is_published,sort_order) VALUES($1,$2,$3,$4,$5,$6) RETURNING id::text,category,title,question_patterns,answer,is_published,sort_order,updated_at",
      [category,title,patterns,answer,published,sortOrder]
    );
    return NextResponse.json({ item: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("AI knowledge save failed:", error);
    return NextResponse.json({ error: "Unable to save this knowledge entry." }, { status: 503 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await getAdminActor(req, "content"))) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const body = await req.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : "";
  const category = typeof body?.category === "string" ? body.category.trim().toLowerCase().slice(0, 40) : "";
  const title = typeof body?.title === "string" ? body.title.trim().slice(0, 160) : "";
  const patterns = typeof body?.questionPatterns === "string" ? body.questionPatterns.trim().slice(0, 1200) : "";
  const answer = typeof body?.answer === "string" ? body.answer.trim().slice(0, 4000) : "";
  const published = body?.isPublished === true;
  const sortOrder = Number.isInteger(body?.sortOrder) ? Math.max(0, Math.min(9999, body.sortOrder)) : 100;
  if (!/^[0-9a-f-]{36}$/i.test(id) || !/^[a-z0-9_-]{2,40}$/.test(category) || title.length < 2 || patterns.length < 3 || answer.length < 10) {
    return NextResponse.json({ error: "Enter valid knowledge details." }, { status: 400 });
  }
  try {
    const result = await db.query(
      "UPDATE ai_knowledge SET category=$2,title=$3,question_patterns=$4,answer=$5,is_published=$6,sort_order=$7,updated_at=NOW() WHERE id=$1::uuid RETURNING id::text,category,title,question_patterns,answer,is_published,sort_order,updated_at",
      [id,category,title,patterns,answer,published,sortOrder]
    );
    if (!result.rows[0]) return NextResponse.json({ error: "Knowledge entry not found." }, { status: 404 });
    return NextResponse.json({ item: result.rows[0] });
  } catch (error) {
    console.error("AI knowledge update failed:", error);
    return NextResponse.json({ error: "Unable to update this knowledge entry." }, { status: 503 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await getAdminActor(req, "content"))) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id") || "";
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Invalid knowledge entry." }, { status: 400 });
  try {
    const result = await db.query("DELETE FROM ai_knowledge WHERE id=$1::uuid RETURNING id",[id]);
    if (!result.rows[0]) return NextResponse.json({ error: "Knowledge entry not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("AI knowledge delete failed:", error);
    return NextResponse.json({ error: "Unable to delete this knowledge entry." }, { status: 503 });
  }
}
