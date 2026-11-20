import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendNotification } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyName, contactName, email, phone, eventType, estimatedQuantity, targetDate, requirements } = body;

    if (!companyName || !contactName || !email || !phone || !estimatedQuantity) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }

    const client = await db.getClient();
    try {
      const result = await client.query(
        `INSERT INTO b2b_enquiries 
          (company_name, contact_name, email, phone, event_type, estimated_quantity, target_delivery_date, requirements) 
         VALUES ($1, $2, $3, $4, $5, $6, $7::date, $8) RETURNING id`,
        [companyName, contactName, email, phone, eventType || null, estimatedQuantity, targetDate || null, requirements || null]
      );

      // Trigger internal notification for the Lado Organics admin team
      const adminHtml = `
        <h3>New Corporate Enquiry: ${companyName}</h3>
        <p><strong>Contact:</strong> ${contactName} (${email} | ${phone})</p>
        <p><strong>Quantity:</strong> ${estimatedQuantity} | <strong>Target Date:</strong> ${targetDate || 'Flexible'}</p>
        <p><strong>Requirements:</strong> ${requirements || 'None specified'}</p>
      `;
      await sendNotification("thetharparkarpilani@gmail.com", `B2B Lead: ${companyName}`, adminHtml);

    } finally {
      client.release();
    }

    return NextResponse.json({ ok: true, message: "Corporate enquiry submitted successfully. Our Pilani team will contact you shortly." });
  } catch (err) {
    console.error("B2B API Error:", err);
    return NextResponse.json({ error: "Failed to submit enquiry. Please try again or contact us on WhatsApp." }, { status: 500 });
  }
}
