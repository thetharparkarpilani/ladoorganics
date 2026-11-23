import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCustomerIdentity } from "@/lib/customer-auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productSlug = searchParams.get("slug");

    let query = `
      SELECT r.id, r.rating, r.title, r.comment, r.is_verified_purchase, r.created_at, u.full_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.is_approved = TRUE
    `;
    const params: string[] = [];

    if (productSlug) {
      query += ` AND r.product_slug = $1`;
      params.push(productSlug);
    }

    query += ` ORDER BY r.created_at DESC LIMIT 20`;

    const result = await db.query(query, params);
    return NextResponse.json({ reviews: result.rows });
  } catch (err) {
    console.error("Review listing failed:", err);
    return NextResponse.json({ error: "Failed to load reviews." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const customer = await getCustomerIdentity(req);
    if (!customer) {
      return NextResponse.json({ error: "Please sign in with Google to submit a review." }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid review details." }, { status: 400 });
    }

    const productSlug = typeof body.productSlug === "string" ? body.productSlug.trim() : "";
    const rating = Number(body.rating);
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const comment = typeof body.comment === "string" ? body.comment.trim() : "";

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(productSlug) || productSlug.length > 120) {
      return NextResponse.json({ error: "Choose a valid product." }, { status: 400 });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Choose a rating from 1 to 5." }, { status: 400 });
    }
    if (title.length > 120 || comment.length > 2000) {
      return NextResponse.json({ error: "Review title or comment is too long." }, { status: 400 });
    }
    if (!title && !comment) {
      return NextResponse.json({ error: "Please add a title or review comment." }, { status: 400 });
    }

    await db.query(
      `INSERT INTO reviews (user_id, product_slug, rating, title, comment, is_verified_purchase, is_approved)
       VALUES ($1, $2, $3, $4, $5, FALSE, FALSE)`,
      [customer.databaseUserId, productSlug, rating, title || null, comment || null]
    );

    return NextResponse.json({ ok: true, message: "Review submitted and pending moderation." }, { status: 201 });
  } catch (err) {
    console.error("Review submission failed:", err);
    return NextResponse.json({ error: "Failed to submit review." }, { status: 500 });
  }
}
