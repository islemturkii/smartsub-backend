export interface Subscription {
  id: number;
  merchant: string;
  normalized_name: string;
  average_amount: number;
  billing_cycle: string;
  next_payment_date: string | null;
  confidence_score: number;
  status: string;
  created_at: string;
}

export interface SubscriptionDetail {
  subscription: Subscription;
  transactions: Transaction[];
}

export interface Transaction {
  id: number;
  user_id: number;
  data_import_id: number;
  transaction_date: string;
  description: string;
  amount: number;
  created_at: string;
}

export interface Notification {
  subscription_id: number;
  merchant: string;
  average_amount: number;
  next_payment_date: string | null;
  message: string;
}

export interface MonthlySummary {
  month: string;
  subscription_count: number;
  total_monthly_cost: number;
}

export interface ImportResponse {
  message: string;
  import_id: number;
  transactions_count: number;
  invalid_rows_count: number;
}

export interface DetectionResponse {
  message: string;
  detected_count: number;
  skipped_duplicates_count: number;
  subscriptions: Subscription[];
}

export interface SavingsCandidate {
  subscription_id: number;
  merchant: string;
  amount: number;
  billing_cycle: string;
  monthly_equivalent_cost: number;
  next_payment_date: string | null;
  savings_reason: string;
  estimated_monthly_savings: number;
}

export interface SavingsResponse {
  total_potential_monthly_savings: number;
  flagged_count: number;
  flagged_subscriptions: SavingsCandidate[];
}
