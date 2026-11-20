import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI only if the key is present to prevent build crashes
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) 
  : null;

export async function POST(req: NextRequest) {
  try {
    if (!openai) {
      return NextResponse.json(
        { reply: "Our AI Concierge is currently resting. Please contact our Pilani team via WhatsApp at +91 96361 00337 for immediate assistance." },
        { status: 200 }
      );
    }

    const { message } = await req.json();

    const systemPrompt = `You are the Lado Organics Customer Concierge.
Brand: Lado Organics (Pilani, Rajasthan).
Products:
- A2 Bilona Ghee (1L for ₹5000, 500ml for ₹2600, 250ml for ₹1350)
- Tharparkar Dhoop (Box for ₹1000)
- Pure Kechua Khad (5kg for ₹2000)
- Deep Work Bhunga Stay (₹4000/night)
Calf Sponsorships: Dholi Sheri, Tara, Roshni.
Rules: Never fabricate health claims, stock, or lab results. Do not diagnose medical conditions. Keep responses concise, helpful, and earthy.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.3,
      max_tokens: 150,
    });

    return NextResponse.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error("Concierge Error:", err);
    return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
  }
}
