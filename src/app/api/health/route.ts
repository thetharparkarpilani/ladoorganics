import { NextResponse } from "next/server";

export async function GET() {
  // Keep infrastructure and database diagnostics private. Public probes only
  // confirm that the application process can answer requests.
  return NextResponse.json(
    { status: "ok" },
    { headers: { "Cache-Control": "no-store" } }
  );
}
