export const STAFF_SESSION_TOKEN = "__lado_staff_session__";

/**
 * The browser never reads or stores the owner access token. Admin APIs validate
 * the HttpOnly Supabase session cookie and the staff role on the server.
 */
export async function getAdminClientToken(): Promise<string> {
  if (typeof window === "undefined") return "";
  try {
    const response = await fetch("/api/admin/session", { cache: "no-store", credentials: "same-origin" });
    return response.ok ? STAFF_SESSION_TOKEN : "";
  } catch {
    return "";
  }
}
