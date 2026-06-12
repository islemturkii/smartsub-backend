"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getSubscription } from "@/services/api";
import type { SubscriptionDetail } from "@/types";

export default function SubscriptionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<SubscriptionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    getSubscription(Number(id))
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-32" />
        <div className="h-40 bg-gray-200 rounded-xl" />
        <div className="h-24 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 space-y-3">
        <p className="text-4xl">⚠️</p>
        <p className="text-red-600 font-medium">{error}</p>
        <Link href="/dashboard" className="text-sm text-indigo-600 hover:underline">← Back to Dashboard</Link>
      </div>
    );
  }

  if (!data) return null;
  const { subscription: sub, transactions } = data;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/dashboard" className="text-sm text-indigo-600 hover:underline inline-flex items-center gap-1">
        ← Back to Dashboard
      </Link>

      {/* Header card */}
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{sub.merchant}</h1>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            sub.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
          }`}>
            {sub.status}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <Info label="Amount" value={`€${Number(sub.average_amount).toFixed(2)}`} />
          <Info label="Billing Cycle" value={sub.billing_cycle} />
          <Info label="Next Payment" value={sub.next_payment_date?.slice(0, 10) || "Unknown"} />
          <Info label="Confidence" value={`${(sub.confidence_score * 100).toFixed(0)}%`} />
          <Info label="Detected" value={sub.created_at?.slice(0, 10) || "—"} />
        </div>
      </div>

      {/* Insight box */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex items-start gap-3">
        <span className="text-lg">💡</span>
        <p className="text-sm text-indigo-800">
          {sub.next_payment_date
            ? `Your next payment of €${Number(sub.average_amount).toFixed(2)} is expected on ${sub.next_payment_date.slice(0, 10)}. This is a ${sub.billing_cycle} subscription.`
            : "No upcoming payment date could be estimated for this subscription."}
        </p>
      </div>

      {/* Transaction history */}
      {transactions.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-gray-900">Transaction History ({transactions.length})</h2>
          <div className="bg-white border rounded-lg divide-y">
            {transactions.map((t) => (
              <div key={t.id} className="px-4 py-3 flex justify-between items-center text-sm">
                <div>
                  <p className="text-gray-800">{t.description}</p>
                  <p className="text-xs text-gray-400">{t.transaction_date.slice(0, 10)}</p>
                </div>
                <span className="font-semibold text-gray-900">€{Number(t.amount).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="font-semibold capitalize mt-0.5">{value}</p>
    </div>
  );
}
