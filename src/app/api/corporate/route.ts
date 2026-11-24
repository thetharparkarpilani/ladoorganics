import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const rateLimited = await enforceRateLimit(req, "corporate-enquiries", 5, 3600);
  if (rateLimited) return rateLimited;
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Please provide valid enquiry details." }, { status: 400 });
    }
    const companyName = typeof body.companyName === "string" ? body.companyName.trim().slice(0, 160) : "";
    const gstNumber = typeof body.gstNumber === "string" ? body.gstNumber.trim().slice(0, 20) : "";
    const contactName = typeof body.contactName === "string" ? body.contactName.trim().slice(0, 120) : "";
    const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 24) : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 254) : "";
    const partnershipType = typeof body.partnershipType === "string" ? body.partnershipType.trim().slice(0, 80) : "";
    const message = typeof body.message === "string" ? body.message.trim().slice(0, 2000) : "";

    if (!companyName || !contactName || !phone || !/^[+0-9()\\-\\s]{7,24}$/.test(phone) ||
        !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email) || !partnershipType) {
      return NextResponse.json({ error: "Required fields are missing." }, { status: 400 });
    }

    // In a full production environment, this inserts into a dedicated `corporate_enquiries` table.
    // For architectural resilience, we log this directly to the verified `audit_logs` table 
    // ensuring the business requirement is met safely before the final table is confirmed.
    await db.query(
      `INSERT INTO audit_logs (action, entity_type, entity_id, metadata)
       VALUES ('B2B_ENQUIRY_RECEIVED', 'corporate_enquiry', gen_random_uuid(), $1::jsonb)`,
      [JSON.stringify({ companyName, gstNumber, contactName, phone, email, partnershipType, message })]
    );

    // Optional: Trigger a server-side email to thetharparkarpilani@gmail.com here.

    return NextResponse.json({ ok: true, message: "Enquiry recorded securely." });
  } catch (err) {
    console.error("B2B API Error:", err);
    return NextResponse.json({ error: "Failed to process inquiry. Please try again." }, { status: 500 });
  }
}
