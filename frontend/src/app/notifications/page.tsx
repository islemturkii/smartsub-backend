"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getNotifications } from "@/services/api";
import type { Notification } from "@/types";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getNotifications()
      .then(setNotifications)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48" />
        {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-gray-200 rounded-lg" />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 space-y-3">
        <p className="text-4xl">⚠️</p>
        <p className="text-red-600 font-medium">{error}</p>
        <p className="text-sm text-gray-500">Make sure the backend is running.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Upcoming Payments</h1>

      {notifications.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <p className="text-4xl">🔕</p>
          <p className="text-gray-600 font-medium">No upcoming payments</p>
          <p className="text-sm text-gray-400">Once subscriptions are detected, upcoming payments will appear here.</p>
          <Link href="/upload" className="inline-block px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition mt-2">
            Upload Transactions
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const daysUntil = n.next_payment_date
              ? Math.ceil((new Date(n.next_payment_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
              : null;
            const urgent = daysUntil !== null && daysUntil <= 3;

            return (
              <div
                key={n.subscription_id}
                className={`bg-white border rounded-lg p-4 flex items-center justify-between ${
                  urgent ? "border-red-200 bg-red-50" : ""
                }`}
              >
                <div className="space-y-0.5">
                  <p className="font-medium text-gray-900">{n.merchant}</p>
                  <p className="text-sm text-gray-500">{n.message}</p>
                  {daysUntil !== null && (
                    <p className={`text-xs font-medium ${urgent ? "text-red-600" : "text-gray-400"}`}>
                      {daysUntil <= 0 ? "Due today" : daysUntil === 1 ? "Due tomorrow" : `In ${daysUntil} days`}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="font-semibold text-gray-900">€{Number(n.average_amount).toFixed(2)}</p>
                  <p className="text-xs text-gray-400">{n.next_payment_date?.slice(0, 10) || "—"}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
