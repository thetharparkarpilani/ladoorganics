"use client";

import AuthModal from "@/components/AuthModal";

export default function LoginPage() {
  return (
    <main className="min-h-screen">
      <AuthModal isOpen onClose={() => { window.location.href = "/"; }} />
    </main>
  );
}
