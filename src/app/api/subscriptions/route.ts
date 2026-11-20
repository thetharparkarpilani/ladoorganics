import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("lado_secure_session")?.value;
    
    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized. Please log in to join the Essentials Club." }, { status: 401 });
    }

    const body = await req.json();
    const { frequencyDays, quantity } = body;

    // Enforce verified business pricing: A2 Bilona Ghee is ₹5,000 per litre[cite: 1]
    const pricePerUnit = 5000;
    const amountInr = pricePerUnit * quantity;

    // We do not assume GST or shipping costs here; they must be configured by the admin later[cite: 1]
    const client = await db.getClient();
    try {
      await client.query(
        `INSERT INTO subscriptions (id, user_id, status, amount_inr, created_at)
         VALUES (gen_random_uuid(), $1, 'pending_mandate', $2, NOW())`,
        [sessionToken, amountInr]
      );
      
      // Log the secure action to the audit_logs table[cite: 1]
      await client.query(
        `INSERT INTO audit_logs (action, entity_type, metadata)
         VALUES ('SUBSCRIPTION_CREATED', 'subscription', $1::jsonb)`,
        [JSON.stringify({ user: sessionToken, frequencyDays, quantity, amountInr })]
      );
    } finally {
      client.release();
    }

    return NextResponse.json({ ok: true, message: "Subscription mandate initiated securely." });
  } catch (err) {
    console.error("Subscription API Error:", err);
    return NextResponse.json({ error: "Failed to initialize subscription." }, { status: 500 });
  }
}
