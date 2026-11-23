export const STAFF_SESSION_TOKEN = "__lado_staff_session__";

export async function getAdminClientToken(): Promise<string> {
  if (typeof window === "undefined") return "";
  const saved = window.localStorage.getItem("lado_admin_token") || "";
  if (saved) return saved;
  try {
    const response = await fetch("/api/admin/session", { cache: "no-store" });
    return response.ok ? STAFF_SESSION_TOKEN : "";
  } catch {
    return "";
  }
}
