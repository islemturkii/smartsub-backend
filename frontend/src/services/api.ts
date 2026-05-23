import type {
  Subscription,
  SubscriptionDetail,
  Notification,
  MonthlySummary,
  ImportResponse,
  DetectionResponse,
} from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function uploadCsv(file: File): Promise<ImportResponse> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE_URL}/imports`, { method: "POST", body: form });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Upload failed");
  }
  return res.json();
}

export async function detectSubscriptions(importId: number): Promise<DetectionResponse> {
  return fetchJson(`/subscriptions/detect/${importId}`, { method: "POST" });
}

export async function getSubscriptions(): Promise<Subscription[]> {
  return fetchJson("/subscriptions");
}

export async function getSubscription(id: number): Promise<SubscriptionDetail> {
  return fetchJson(`/subscriptions/${id}`);
}

export async function getNotifications(): Promise<Notification[]> {
  return fetchJson("/notifications");
}

export async function getMonthlySummary(): Promise<MonthlySummary> {
  return fetchJson("/summary/monthly");
}
