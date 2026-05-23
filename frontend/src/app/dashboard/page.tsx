"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSubscriptions, getMonthlySummary, getNotifications } from "@/services/api";
import type { Subscription, MonthlySummary, Notification } from "@/types";

export default function DashboardPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [notifCount, setNotifCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState<"amount" | "date" | "cycle">("date");

  useEffect(() => {
    Promise.all([getSubscriptions(), getMonthlySummary(), getNotifications()])
      .then(([subs, sum, notifs]) => {
        setSubscriptions(subs);
        setSummary(sum);
        setNotifCount(notifs.length);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const potentialSavings = summary
    ? (Number(summary.total_monthly_cost) * 0.15).toFixed(2)
    : "0.00";

  const sorted = [...subscriptions].sort((a, b) => {
    if (sortBy === "amount") return b.average_amount - a.average_amount;
    if (sortBy === "cycle") return a.billing_cycle.localeCompare(b.billing_cycle);
    return (a.next_payment_date || "").localeCompare(b.next_payment_date || "");
  });

  if (loading) return <p className="text-center py-12 text-gray-500">Loading dashboard…</p>;
  if (error) return <p className="text-center py-12 text-red-600">{error}</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card label="Subscriptions" value={summary?.subscription_count ?? 0} />
        <Card label="Monthly Spend" value={`€${summary?.total_monthly_cost ?? "0.00"}`} />
        <Card label="Potential Savings" value={`€${potentialSavings}`} />
        <Card label="Upcoming Payments" value={notifCount} />
      </div>

      {/* Sort controls */}
      <div className="flex gap-2 items-center text-sm">
        <span className="text-gray-500">Sort by:</span>
        {(["date", "amount", "cycle"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSortBy(s)}
            className={`px-3 py-1 rounded-full border text-xs font-medium ${
              sortBy === s ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-300 text-gray-600"
            }`}
          >
            {s === "date" ? "Next Payment" : s === "amount" ? "Amount" : "Cycle"}
          </button>
        ))}
      </div>

      {/* Subscriptions list */}
      {sorted.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No subscriptions detected yet.{" "}
          <Link href="/upload" className="text-indigo-600 underline">Upload transactions</Link> to get started.
        </div>
      ) : (
        <div className="grid gap-3">
          {sorted.map((sub) => (
            <Link
              key={sub.id}
              href={`/subscriptions/${sub.id}`}
              className="bg-white border rounded-lg p-4 flex items-center justify-between hover:shadow-sm transition"
            >
              <div>
                <p className="font-medium text-gray-900">{sub.merchant}</p>
                <p className="text-xs text-gray-500 capitalize">{sub.billing_cycle}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">€{Number(sub.average_amount).toFixed(2)}</p>
                <p className="text-xs text-gray-500">
                  {sub.next_payment_date ? `Next: ${sub.next_payment_date.slice(0, 10)}` : "—"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Card({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white border rounded-xl p-5">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
