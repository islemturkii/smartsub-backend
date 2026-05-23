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

  if (loading) return <p className="text-center py-12 text-gray-500">Loading…</p>;
  if (error) return <p className="text-center py-12 text-red-600">{error}</p>;
  if (!data) return null;

  const { subscription: sub, transactions } = data;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/dashboard" className="text-sm text-indigo-600 hover:underline">
        ← Back to Dashboard
      </Link>

      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold">{sub.merchant}</h1>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Info label="Amount" value={`€${Number(sub.average_amount).toFixed(2)}`} />
          <Info label="Billing Cycle" value={sub.billing_cycle} />
          <Info label="Next Payment" value={sub.next_payment_date?.slice(0, 10) || "Unknown"} />
          <Info label="Status" value={sub.status} />
          <Info label="Confidence" value={`${(sub.confidence_score * 100).toFixed(0)}%`} />
        </div>
      </div>

      {/* Insight box */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-sm text-indigo-800">
        {sub.next_payment_date
          ? `Upcoming payment of €${Number(sub.average_amount).toFixed(2)} expected on ${sub.next_payment_date.slice(0, 10)}.`
          : "No upcoming payment date estimated for this subscription."}
      </div>

      {/* Transaction history */}
      {transactions.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-semibold text-gray-900">Transaction History</h2>
          <div className="bg-white border rounded-lg divide-y">
            {transactions.map((t) => (
              <div key={t.id} className="px-4 py-3 flex justify-between text-sm">
                <span className="text-gray-700">{t.description}</span>
                <div className="text-right">
                  <span className="font-medium">€{Number(t.amount).toFixed(2)}</span>
                  <span className="ml-3 text-gray-400">{t.transaction_date.slice(0, 10)}</span>
                </div>
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
      <p className="text-gray-500 text-xs uppercase">{label}</p>
      <p className="font-medium capitalize">{value}</p>
    </div>
  );
}
