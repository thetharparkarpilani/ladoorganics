import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendTemplatedNotification } from "@/lib/customer-notifications";
import { sendAdminRequestAlert } from "@/lib/admin-notifications";
import { enforceRateLimit } from "@/lib/rate-limit";

const NIGHTLY_RATE_INR = Number(process.env.BHUNGA_NIGHTLY_RATE_INR || 4000);

function validDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export async function POST(req: NextRequest) {
  const rateLimited = await enforceRateLimit(req, "bookings", 3, 3600);
  if (rateLimited) return rateLimited;
  let client: Awaited<ReturnType<typeof db.getClient>> | null = null;
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid booking details." }, { status: 400 });
    const guestName = typeof body.guestName === "string" ? body.guestName.trim() : "";
    const guestEmail = typeof body.guestEmail === "string" ? body.guestEmail.trim().toLowerCase() : "";
    const guestPhone = typeof body.guestPhone === "string" ? body.guestPhone.trim() : "";
    const checkIn = body.checkIn;
    const checkOut = body.checkOut;
    const guestsCount = Number(body.guestsCount);

    if (!guestName || guestName.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail) || guestPhone.length < 7 || guestPhone.length > 24) {
      return NextResponse.json({ error: "Enter a valid name, email and phone number." }, { status: 400 });
    }
    if (!validDate(checkIn) || !validDate(checkOut) || checkOut <= checkIn) {
      return NextResponse.json({ error: "Choose valid check-in and check-out dates." }, { status: 400 });
    }
    if (!Number.isInteger(guestsCount) || guestsCount < 1 || guestsCount > 4) {
      return NextResponse.json({ error: "Guest count must be between 1 and 4." }, { status: 400 });
    }

    const nights = Math.round((Date.parse(`${checkOut}T00:00:00Z`) - Date.parse(`${checkIn}T00:00:00Z`)) / 86400000);
    if (nights < 1 || nights > 30) {
      return NextResponse.json({ error: "Stay duration must be between 1 and 30 nights." }, { status: 400 });
    }
    if (!Number.isSafeInteger(NIGHTLY_RATE_INR) || NIGHTLY_RATE_INR <= 0 || NIGHTLY_RATE_INR > 1000000) {
      return NextResponse.json({ error: "Booking prices are temporarily unavailable. Please contact the farm team." }, { status: 503 });
    }
    const totalAmountInr = nights * NIGHTLY_RATE_INR;
    client = await db.getClient();

    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(hashtext('lado-bhunga-booking'))");
    const conflict = await client.query(
      `SELECT id FROM bookings
       WHERE (status = 'confirmed' OR (status = 'pending' AND (expires_at IS NULL OR expires_at > NOW())))
         AND check_in < $2::date AND check_out > $1::date
       LIMIT 1`,
      [checkIn, checkOut]
    );
    if (conflict.rowCount) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Those dates are already requested or reserved. Please choose different dates or contact the team." }, { status: 409 });
    }

    const result = await client.query(
      `INSERT INTO bookings (stay_slug, guest_name, guest_email, guest_phone, check_in, check_out, guests_count, nights_count, total_amount_inr, status, expires_at)
       VALUES ('deep-work-bhunga-stay', $1, $2, $3, $4::date, $5::date, $6, $7, $8, 'pending', NOW() + INTERVAL '24 hours')
       RETURNING id, nights_count, total_amount_inr, status, check_in, check_out`,
      [guestName, guestEmail, guestPhone, checkIn, checkOut, guestsCount, nights, totalAmountInr]
    );
    await client.query("COMMIT");

    await sendTemplatedNotification("booking_request_received", guestEmail, {
      name: guestName,
      check_in: checkIn,
      check_out: checkOut,
    });
    await sendAdminRequestAlert("Bhunga stay request", {
      "Guest": guestName,
      "Email": guestEmail,
      "Phone": guestPhone,
      "Check-in": checkIn,
      "Check-out": checkOut,
      "Guests": guestsCount,
      "Nights": nights,
      "Estimated amount (INR)": totalAmountInr,
      "Status": "pending",
    });

    return NextResponse.json({
      ok: true,
      booking: result.rows[0],
      message: "Stay request recorded as pending. The farm team must confirm availability and final details."
    }, { status: 201 });
  } catch (error) {
    if (client) await client.query("ROLLBACK").catch(() => undefined);
    console.error("Bhunga booking request error:", error);
    return NextResponse.json({ error: "Could not record the stay request. Please contact the farm team." }, { status: 500 });
  } finally {
    client?.release();
  }
}
