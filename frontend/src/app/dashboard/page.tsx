"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSubscriptions, getMonthlySummary, getNotifications, getSavings } from "@/services/api";
import type { Subscription, MonthlySummary, SavingsResponse } from "@/types";

export default function DashboardPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [savings, setSavings] = useState<SavingsResponse | null>(null);
  const [notifCount, setNotifCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState<"amount" | "date" | "cycle">("date");

  useEffect(() => {
    Promise.all([getSubscriptions(), getMonthlySummary(), getNotifications(), getSavings()])
      .then(([subs, sum, notifs, sav]) => {
        setSubscriptions(subs);
        setSummary(sum);
        setNotifCount(notifs.length);
        setSavings(sav);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...subscriptions].sort((a, b) => {
    if (sortBy === "amount") return b.average_amount - a.average_amount;
    if (sortBy === "cycle") return a.billing_cycle.localeCompare(b.billing_cycle);
    return (a.next_payment_date || "").localeCompare(b.next_payment_date || "");
  });

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-40" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-xl" />)}
        </div>
        <div className="h-48 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 space-y-3">
        <p className="text-4xl">⚠️</p>
        <p className="text-red-600 font-medium">{error}</p>
        <p className="text-sm text-gray-500">Make sure the backend is running on port 3000.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card icon="📋" label="Subscriptions" value={String(summary?.subscription_count ?? 0)} />
        <Card icon="💳" label="Monthly Spend" value={`€${Number(summary?.total_monthly_cost ?? 0).toFixed(2)}`} />
        <Card icon="💡" label="Potential Savings" value={`€${savings?.total_potential_monthly_savings.toFixed(2) ?? "0.00"}`} accent />
        <Card icon="🔔" label="Upcoming Payments" value={String(notifCount)} />
      </div>

      {/* Savings candidates */}
      {savings && savings.flagged_count > 0 && (
        <section className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900">
              💡 Savings Opportunities
            </h2>
            <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-medium">
              {savings.flagged_count} flagged
            </span>
          </div>
          <div className="grid gap-3">
            {savings.flagged_subscriptions.map((s) => (
              <div key={s.subscription_id} className="bg-white border border-amber-100 rounded-lg p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">{s.merchant}</p>
                  <div className="flex flex-wrap gap-1">
                    {s.savings_reason.split("; ").map((r) => (
                      <span key={r} className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">{r}</span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 capitalize">{s.billing_cycle} · €{s.amount.toFixed(2)}/cycle</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="font-bold text-amber-800 text-lg">€{s.estimated_monthly_savings.toFixed(2)}<span className="text-xs font-normal">/mo</span></p>
                  <Link href={`/subscriptions/${s.subscription_id}`} className="text-xs text-indigo-600 hover:underline">
                    Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Subscriptions header + sort */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-900">All Subscriptions</h2>
        <div className="flex gap-1">
          {(["date", "amount", "cycle"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                sortBy === s ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s === "date" ? "Next Payment" : s === "amount" ? "Amount" : "Cycle"}
            </button>
          ))}
        </div>
      </div>

      {/* Subscriptions list */}
      {sorted.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <p className="text-4xl">📭</p>
          <p className="text-gray-600 font-medium">No subscriptions detected yet</p>
          <Link href="/upload" className="inline-block px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
            Upload Transactions
          </Link>
        </div>
      ) : (
        <div className="grid gap-2">
          {sorted.map((sub) => (
            <Link
              key={sub.id}
              href={`/subscriptions/${sub.id}`}
              className="bg-white border rounded-lg p-4 flex items-center justify-between hover:border-indigo-200 hover:shadow-sm transition"
            >
              <div>
                <p className="font-medium text-gray-900">{sub.merchant}</p>
                <p className="text-xs text-gray-500 capitalize">{sub.billing_cycle}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">€{Number(sub.average_amount).toFixed(2)}</p>
                <p className="text-xs text-gray-400">
                  {sub.next_payment_date ? sub.next_payment_date.slice(0, 10) : "—"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Card({ icon, label, value, accent }: { icon: string; label: string; value: string; accent?: boolean }) {
  return (
    <div className={`border rounded-xl p-5 ${accent ? "bg-amber-50 border-amber-200" : "bg-white"}`}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      </div>
      <p className={`text-2xl font-bold mt-2 ${accent ? "text-amber-800" : "text-gray-900"}`}>{value}</p>
    </div>
  );
}
