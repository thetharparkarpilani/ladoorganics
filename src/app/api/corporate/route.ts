import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { enforceRateLimit } from "@/lib/rate-limit";

function clean(value: unknown, max: number): string {
  return typeof value === "string"
    ? value.replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, max)
    : "";
}

export async function POST(req: NextRequest) {
  const rateLimited = await enforceRateLimit(req, "corporate-enquiries", 5, 3600);
  if (rateLimited) return rateLimited;

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Please provide valid enquiry details." }, { status: 400 });
    }

    const companyName = clean(body.companyName, 160);
    const gstNumber = clean(body.gstNumber, 20).toUpperCase();
    const contactName = clean(body.contactName, 120);
    const phone = clean(body.phone, 24);
    const email = clean(body.email, 254).toLowerCase();
    const partnershipType = clean(body.partnershipType, 80);
    const message = clean(body.message, 2000);

    if (!companyName || !contactName || !/^[+0-9()\-\s]{7,24}$/.test(phone) ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !partnershipType) {
      return NextResponse.json({ error: "Required fields are missing or invalid." }, { status: 400 });
    }
    if (gstNumber && !/^[0-9A-Z]{15}$/.test(gstNumber)) {
      return NextResponse.json({ error: "Enter a valid 15-character GSTIN or leave it blank." }, { status: 400 });
    }

    // Migration 026 creates a dedicated, access-restricted enquiry table.
    await db.query(
      `INSERT INTO corporate_enquiries
        (company_name, gst_number, contact_name, phone, email, partnership_type, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [companyName, gstNumber || null, contactName, phone, email, partnershipType, message || null]
    );

    return NextResponse.json({ ok: true, message: "Enquiry recorded securely." }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Corporate enquiry submission failed:", error);
    return NextResponse.json({ error: "Unable to submit your enquiry right now. Please try again later." }, { status: 503 });
  }
}
