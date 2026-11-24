import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendNotification, escapeHtml } from "@/lib/email";
import { enforceRateLimit } from "@/lib/rate-limit";

function clean(value: unknown, max: number): string {
  return typeof value === "string"
    ? value.replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, max)
    : "";
}

export async function POST(req: NextRequest) {
  const rateLimited = await enforceRateLimit(req, "b2b-enquiries", 5, 3600);
  if (rateLimited) return rateLimited;
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid enquiry details." }, { status: 400 });
    }

    const companyName = clean(body.companyName, 160);
    const contactName = clean(body.contactName, 120);
    const email = clean(body.email, 254).toLowerCase();
    const phone = clean(body.phone, 24);
    const eventType = clean(body.eventType, 100);
    const estimatedQuantity = clean(body.estimatedQuantity, 40);
    const targetDate = clean(body.targetDate, 10);
    const requirements = clean(body.requirements, 2000);

    if (!companyName || !contactName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        !/^[+0-9()\-\s]{7,24}$/.test(phone) || !estimatedQuantity) {
      return NextResponse.json({ error: "Please provide valid company, contact, email, phone and quantity details." }, { status: 400 });
    }
    if (targetDate) {
      const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(targetDate)
        ? new Date(targetDate + "T00:00:00.000Z")
        : null;
      if (!parsedDate || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== targetDate) {
        return NextResponse.json({ error: "Please provide a valid target delivery date." }, { status: 400 });
      }
    }

    const client = await db.getClient();
    try {
      await client.query(
        `INSERT INTO b2b_enquiries
          (company_name, contact_name, email, phone, event_type, estimated_quantity, target_delivery_date, requirements)
         VALUES ($1, $2, $3, $4, $5, $6, $7::date, $8)`,
        [companyName, contactName, email, phone, eventType || null, estimatedQuantity, targetDate || null, requirements || null]
      );
    } finally {
      client.release();
    }

    const recipient = process.env.ADMIN_NOTIFICATION_EMAIL?.trim();
    if (recipient) {
      const adminHtml = `
        <h3>New Corporate Enquiry: ${escapeHtml(companyName)}</h3>
        <p><strong>Contact:</strong> ${escapeHtml(contactName)} (${escapeHtml(email)} | ${escapeHtml(phone)})</p>
        <p><strong>Quantity:</strong> ${escapeHtml(estimatedQuantity)} | <strong>Target Date:</strong> ${escapeHtml(targetDate || "Flexible")}</p>
        <p><strong>Requirements:</strong> ${escapeHtml(requirements || "None specified")}</p>
      `;
      await sendNotification(recipient, `B2B Lead: ${companyName.replace(/[\r\n]/g, " ")}`, adminHtml);
    }

    return NextResponse.json({ ok: true, message: "Corporate enquiry submitted successfully. Our Pilani team will contact you shortly." }, { status: 201 });
  } catch (error) {
    console.error("B2B enquiry submission failed:", error);
    return NextResponse.json({ error: "Failed to submit enquiry. Please try again or contact us on WhatsApp." }, { status: 500 });
  }
}
