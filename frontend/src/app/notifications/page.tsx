"use client";

import { useEffect, useState } from "react";
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

  if (loading) return <p className="text-center py-12 text-gray-500">Loading notifications…</p>;
  if (error) return <p className="text-center py-12 text-red-600">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Upcoming Payments</h1>

      {notifications.length === 0 ? (
        <p className="text-center py-12 text-gray-500">No upcoming payments.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.subscription_id}
              className="bg-white border rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-gray-900">{n.merchant}</p>
                <p className="text-sm text-gray-500">{n.message}</p>
              </div>
              <div className="text-right text-sm">
                <p className="font-semibold">€{Number(n.average_amount).toFixed(2)}</p>
                <p className="text-gray-400">{n.next_payment_date?.slice(0, 10) || "—"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
