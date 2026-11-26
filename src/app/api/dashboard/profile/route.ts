import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function privateJson(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Cache-Control", "private, no-store, max-age=0");
  headers.set("Vary", "Cookie");
  return NextResponse.json(body, { ...init, headers });
}

function config() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return url && key ? { url, key } : null;
}

async function getIdentity(req: NextRequest) {
  const cfg = config();
  const accessToken = req.cookies.get("lado_sb_access")?.value;
  if (!cfg || !accessToken) return null;

  const response = await fetch(`${cfg.url}/auth/v1/user`, {
    headers: { apikey: cfg.key, Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!response.ok) return null;

  const user = await response.json();
  if (!user.id || !user.email) return null;
  return { ...cfg, accessToken, user };
}

function restHeaders(key: string, token: string, extra?: Record<string, string>) {
  return {
    apikey: key,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

export async function GET(req: NextRequest) {
  const identity = await getIdentity(req);
  if (!identity) {
    return privateJson({ error: "Your session has expired. Please sign in again." }, { status: 401 });
  }

  const metadata = identity.user.user_metadata || {};
  const initialName = String(metadata.full_name || metadata.name || identity.user.email.split("@")[0]).slice(0, 100);
  const url = `${identity.url}/rest/v1/customer_profiles?on_conflict=auth_user_id`;
  const response = await fetch(url, {
    method: "POST",
    headers: restHeaders(identity.key, identity.accessToken, {
      Prefer: "resolution=merge-duplicates,return=representation",
    }),
    body: JSON.stringify({
      auth_user_id: identity.user.id,
      email: identity.user.email,
      display_name: initialName,
    }),
    cache: "no-store",
  });

  const rows = await response.json().catch(() => []);
  if (!response.ok || !Array.isArray(rows) || !rows[0]) {
    return privateJson({ error: "Unable to load your profile. Please try again." }, { status: 502 });
  }
  return privateJson({ profile: rows[0] });
}

export async function PATCH(req: NextRequest) {
  const identity = await getIdentity(req);
  if (!identity) {
    return privateJson({ error: "Your session has expired. Please sign in again." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return privateJson({ error: "Invalid profile details." }, { status: 400 });
  }

  const fields = ["display_name", "phone", "address_line1", "address_line2", "city", "state", "postal_code", "country"] as const;
  const limits: Record<(typeof fields)[number], number> = {
    display_name: 100, phone: 30, address_line1: 180, address_line2: 180,
    city: 80, state: 80, postal_code: 20, country: 80,
  };
  const updates: Record<string, string | null> = {};
  for (const field of fields) {
    if (body[field] === undefined) continue;
    if (typeof body[field] !== "string") {
      return privateJson({ error: `Invalid value for ${field.replaceAll("_", " ")}.` }, { status: 400 });
    }
    const value = (body[field] as string).trim();
    if (value.length > limits[field]) {
      return privateJson({ error: `${field.replaceAll("_", " ")} is too long.` }, { status: 400 });
    }
    if (field === "display_name" && !value) {
      return privateJson({ error: "Please enter your name." }, { status: 400 });
    }
    updates[field] = value || null;
  }

  if (Object.keys(updates).length === 0) {
    return privateJson({ error: "No profile changes were provided." }, { status: 400 });
  }
  updates.updated_at = new Date().toISOString();

  const url = `${identity.url}/rest/v1/customer_profiles?auth_user_id=eq.${encodeURIComponent(identity.user.id)}`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: restHeaders(identity.key, identity.accessToken, { Prefer: "return=representation" }),
    body: JSON.stringify(updates),
    cache: "no-store",
  });
  const rows = await response.json().catch(() => []);
  if (!response.ok || !Array.isArray(rows) || !rows[0]) {
    return privateJson({ error: "Unable to save your profile. Please try again." }, { status: 502 });
  }
  return privateJson({ profile: rows[0], message: "Your profile has been saved." });
}
