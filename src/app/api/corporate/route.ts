import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyName, gstNumber, contactName, phone, email, partnershipType, message } = body;

    if (!companyName || !contactName || !phone || !email || !partnershipType) {
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
