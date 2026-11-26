import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendTemplatedNotification } from "@/lib/customer-notifications";
import { sendAdminRequestAlert } from "@/lib/admin-notifications";
import { enforceRateLimit } from "@/lib/rate-limit";

const ALLOWED_CALVES = new Set(["General Gau Seva"]);
const ALLOWED_PLANS = new Set(["one_time", "monthly", "yearly"]);

export async function POST(req: NextRequest) {
  const rateLimited = await enforceRateLimit(req, "sponsorships", 5, 3600);
  if (rateLimited) return rateLimited;
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid sponsorship request details." }, { status: 400 });
    }
    const calfName = typeof body.calfName === "string" ? body.calfName.trim() : "";
    const planType = typeof body.planType === "string" ? body.planType : "";
    const sponsorName = typeof body.sponsorName === "string" ? body.sponsorName.trim() : "";
    const sponsorEmail = typeof body.sponsorEmail === "string" ? body.sponsorEmail.trim().toLowerCase() : "";
    const sponsorPhone = typeof body.sponsorPhone === "string" ? body.sponsorPhone.trim().slice(0, 24) : null;
    const amountInr = Number(body.amountInr);

    if (!ALLOWED_CALVES.has(calfName) || !ALLOWED_PLANS.has(planType)) {
      return NextResponse.json({ error: "Choose the general Gau Seva enquiry and a contribution frequency." }, { status: 400 });
    }
    if (!sponsorName || sponsorName.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sponsorEmail)) {
      return NextResponse.json({ error: "Enter your name and a valid email address." }, { status: 400 });
    }
    if (!Number.isSafeInteger(amountInr) || amountInr < 1 || amountInr > 1000000) {
      return NextResponse.json({ error: "Enter a contribution amount between ₹1 and ₹10,00,000." }, { status: 400 });
    }

    const result = await db.query(
      `INSERT INTO sponsorships (calf_name, sponsor_name, sponsor_email, sponsor_phone, plan_type, amount_inr, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING id, calf_name, plan_type, amount_inr, status, created_at`,
      [calfName, sponsorName, sponsorEmail, sponsorPhone || null, planType, amountInr]
    );

    await sendTemplatedNotification("sponsorship_request_received", sponsorEmail, {
      name: sponsorName,
      calf_name: calfName,
      plan: planType,
      amount: amountInr,
    });
    await sendAdminRequestAlert("Gau Seva sponsorship request", {
      "Enquiry category": calfName,
      "Sponsor": sponsorName,
      "Email": sponsorEmail,
      "Phone": sponsorPhone,
      "Plan": planType,
      "Requested amount (INR)": amountInr,
      "Status": "pending",
    });

    return NextResponse.json({
      ok: true,
      sponsorship: result.rows[0],
      message: "Sponsorship request recorded as pending. This is not a payment receipt or confirmation of funds received."
    }, { status: 201 });
  } catch (error) {
    console.error("Sponsorship request error:", error);
    return NextResponse.json({ error: "Could not record the sponsorship request. Please contact the farm team." }, { status: 500 });
  }
}
