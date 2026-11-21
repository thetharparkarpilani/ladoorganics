import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

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
    const params: (string | number | boolean | null)[] = [];

    if (productSlug) {
      query += ` AND r.product_slug = $1`;
      params.push(productSlug);
    }

    query += ` ORDER BY r.created_at DESC LIMIT 20`;

    const result = await db.query(query, params);
    return NextResponse.json({ reviews: result.rows });
  } catch (err) {
    return NextResponse.json({ error: "Failed to load reviews." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("lado_secure_session")?.value;
    
    if (!sessionToken) {
      return NextResponse.json({ error: "Please log in to submit a review." }, { status: 401 });
    }

    const { productSlug, rating, title, comment } = await req.json();
    
    if (!productSlug || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Valid product and rating are required." }, { status: 400 });
    }

    // Insert as unapproved by default for moderation
    await db.query(
      `INSERT INTO reviews (user_id, product_slug, rating, title, comment, is_verified_purchase, is_approved)
       VALUES ($1, $2, $3, $4, $5, FALSE, FALSE)`,
      [sessionToken, productSlug, rating, title || null, comment || null]
    );

    return NextResponse.json({ ok: true, message: "Review submitted and pending moderation." });
  } catch (err) {
    return NextResponse.json({ error: "Failed to submit review." }, { status: 500 });
  }
}
