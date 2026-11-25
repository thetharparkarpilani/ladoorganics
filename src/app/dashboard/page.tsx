"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardOrder {
  id: string | number;
  order_number: string;
  status: string;
  total_inr: number | string;
}

interface DashboardData {
  profile?: { name?: string | null } | null;
  orders?: DashboardOrder[];
}

const dashboardLinks = [
  {
    title: "Order History",
    description: "View your purchases and delivery details.",
    href: "/dashboard/orders",
    label: "View orders",
  },
  {
    title: "My Reviews",
    description: "See the product feedback you have submitted.",
    href: "/dashboard/reviews",
    label: "View reviews",
  },
  {
    title: "Lado Rewards",
    description: "Check your loyalty points and activity.",
    href: "/dashboard/rewards",
    label: "View rewards",
  },
  {
    title: "Essentials Club",
    description: "Review your repeat-delivery enquiries. These are not paid subscriptions.",
    href: "/dashboard/subscriptions",
    label: "View enquiries",
  },
  {
    title: "Bhunga Stays",
    description: "Track your farm stay requests and their confirmation status.",
    href: "/dashboard/stays",
    label: "View stay requests",
  },
  {
    title: "Gau Seva",
    description: "Follow your calf sponsorship enquiries and updates.",
    href: "/dashboard/sponsorships",
    label: "View sponsorships",
  },
  {
    title: "Customer Support",
    description: "Send a private request and get help from the Lado team.",
    href: "/dashboard/support",
    label: "Get help",
  },
  {
    title: "My Profile",
    description: "Manage the details saved to your account.",
    href: "/dashboard/profile",
    label: "Edit profile",
  },
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/dashboard/customer", { cache: "no-store" })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || "Please log in to view your journey.");
        }
        setData(json as DashboardData);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unable to load your account.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--muted)]">
        Loading your Lado Organics account...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-900">
        <h2 className="mb-2 text-xl font-bold">Sign in required</h2>
        <p className="text-sm">{error}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/login" className="primary-btn rounded-full px-6 py-2 text-sm">Sign in with Google</Link>
          <Link href="/" className="rounded-full border border-red-200 px-6 py-2 text-sm">Return Home</Link>
        </div>
      </div>
    );
  }

  const orders = data?.orders || [];

  return (
    <div className="dashboard-page space-y-8">
      <section className="dashboard-welcome relative overflow-hidden rounded-3xl bg-[#2b180c] p-8 text-[#fef3c7] shadow-xl sm:p-10">
        <div className="relative z-10">
          <span className="mb-2 block text-xs uppercase tracking-widest text-[#fbbf24]">
            Lado Organics · My Account
          </span>
          <h1 className="mb-3 font-serif text-3xl font-bold sm:text-4xl">
            Namaste, {data?.profile?.name || "Customer"}
          </h1>
          <p className="max-w-lg text-sm leading-relaxed text-[#fde68a]/80">
            Welcome to your Lado Organics account. Keep track of your orders,
            product reviews, rewards and profile details from one place.
          </p>
        </div>
        <span aria-hidden="true" className="absolute -bottom-10 -right-4 text-[150px] opacity-[0.07]">✿</span>
      </section>

      <section className="dashboard-shortcuts" aria-labelledby="account-shortcuts-heading">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="account-shortcuts-heading" className="font-serif text-2xl font-bold text-[var(--mud)]">
              Your Account
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Quick access to your customer account.</p>
          </div>
          <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]">
            {orders.length} recent {orders.length === 1 ? "order" : "orders"}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {dashboardLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="dashboard-shortcut group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--terracotta)] hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-serif text-lg font-bold text-[var(--mud)]">{item.title}</h3>
                <span aria-hidden="true" className="text-lg text-[var(--terracotta)] transition group-hover:translate-x-1">→</span>
              </div>
              <p className="mt-2 text-sm text-[var(--muted)]">{item.description}</p>
              <span className="mt-4 inline-block text-xs font-bold text-[var(--terracotta)]">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="dashboard-orders rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl font-bold text-[var(--mud)]">Recent Orders</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Your latest purchases linked to this account.</p>
          </div>
          <Link href="/dashboard/orders" className="text-xs font-bold text-[var(--terracotta)] hover:underline">
            View all orders
          </Link>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <article
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4"
              >
                <div>
                  <p className="font-mono text-xs font-bold text-[var(--mud)]">#{order.order_number}</p>
                  <p className="mt-1 text-xs capitalize text-[var(--muted)]">
                    {(order.status || "processing").replaceAll("_", " ")}
                  </p>
                </div>
                <p className="font-bold text-[var(--terracotta)]">
                  ₹{Number(order.total_inr || 0).toLocaleString("en-IN")}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg)] p-8 text-center">
            <h3 className="font-serif text-lg font-bold text-[var(--mud)]">No orders yet</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Orders placed using this Google account email will appear here.
            </p>
            <Link href="/#products" className="primary-btn mt-5 inline-flex rounded-full px-6 py-3 text-sm font-bold">
              Explore products
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
