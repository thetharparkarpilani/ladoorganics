"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";

type Profile = {
  email: string;
  display_name: string;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string;
};

const initialProfile: Profile = {
  email: "",
  display_name: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "India",
};

export default function CustomerProfilePage() {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/dashboard/profile", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Unable to load your profile.");
        setProfile({ ...initialProfile, ...result.profile });
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load your profile."))
      .finally(() => setLoading(false));
  }, []);

  function updateField(field: keyof Profile, value: string) {
    setProfile((current) => ({ ...current, [field]: value }));
    setSuccess("");
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch("/api/dashboard/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: profile.display_name,
          phone: profile.phone || "",
          address_line1: profile.address_line1 || "",
          address_line2: profile.address_line2 || "",
          city: profile.city || "",
          state: profile.state || "",
          postal_code: profile.postal_code || "",
          country: profile.country || "India",
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to save your profile.");
      setProfile({ ...initialProfile, ...result.profile });
      setSuccess("Your profile has been saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save your profile.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm outline-none focus:border-[var(--terracotta)]";

  if (loading) {
    return <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center text-sm text-[var(--muted)]">Loading your profile...</div>;
  }

  return (
    <section className="space-y-6">
      <div>
        <Link href="/dashboard" className="text-xs font-semibold text-[var(--terracotta)] hover:underline">← Back to My Journey</Link>
        <h1 className="mt-3 text-3xl font-serif font-bold text-[var(--mud)]">My Profile</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Keep your contact and delivery details up to date.</p>
      </div>

      <form onSubmit={saveProfile} className="space-y-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
        {success && <div role="status" className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">{success}</div>}

        <div>
          <h2 className="font-serif text-lg font-bold text-[var(--mud)]">Account details</h2>
          <label className="mt-4 block text-xs font-semibold text-[var(--muted)]">Google account email</label>
          <input className={inputClass} value={profile.email} disabled aria-label="Google account email" />
          <p className="mt-1 text-xs text-[var(--muted)]">Your sign-in email is managed securely by Google.</p>
          <label className="mt-4 block text-xs font-semibold text-[var(--muted)]">Full name *</label>
          <input className={inputClass} value={profile.display_name} onChange={(e) => updateField("display_name", e.target.value)} maxLength={100} required />
          <label className="mt-4 block text-xs font-semibold text-[var(--muted)]">Mobile number</label>
          <input className={inputClass} type="tel" value={profile.phone || ""} onChange={(e) => updateField("phone", e.target.value)} maxLength={30} placeholder="+91..." />
        </div>

        <div className="border-t border-[var(--border)] pt-6">
          <h2 className="font-serif text-lg font-bold text-[var(--mud)]">Delivery address</h2>
          <label className="mt-4 block text-xs font-semibold text-[var(--muted)]">Address line 1</label>
          <input className={inputClass} value={profile.address_line1 || ""} onChange={(e) => updateField("address_line1", e.target.value)} maxLength={180} />
          <label className="mt-4 block text-xs font-semibold text-[var(--muted)]">Address line 2</label>
          <input className={inputClass} value={profile.address_line2 || ""} onChange={(e) => updateField("address_line2", e.target.value)} maxLength={180} />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-[var(--muted)]">City
              <input className={inputClass} value={profile.city || ""} onChange={(e) => updateField("city", e.target.value)} maxLength={80} />
            </label>
            <label className="block text-xs font-semibold text-[var(--muted)]">State
              <input className={inputClass} value={profile.state || ""} onChange={(e) => updateField("state", e.target.value)} maxLength={80} />
            </label>
            <label className="block text-xs font-semibold text-[var(--muted)]">PIN code
              <input className={inputClass} inputMode="numeric" value={profile.postal_code || ""} onChange={(e) => updateField("postal_code", e.target.value)} maxLength={20} />
            </label>
            <label className="block text-xs font-semibold text-[var(--muted)]">Country
              <input className={inputClass} value={profile.country || "India"} onChange={(e) => updateField("country", e.target.value)} maxLength={80} />
            </label>
          </div>
        </div>

        <button type="submit" disabled={saving} className="primary-btn rounded-full px-7 py-3 text-sm font-bold disabled:cursor-wait disabled:opacity-60">
          {saving ? "Saving..." : "Save profile"}
        </button>
      </form>
    </section>
  );
}
