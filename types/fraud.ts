
export interface RiskDecisionResponse {
  ok: boolean;
  query: {
    risk_level: string;
    limit: number;
    offset: number;
  };
  count: number;
  items: TransactionItem[];
}

export interface TransactionItem {
  row_number: number;
  order_id: number;
  transaction_id: number;
  user_id: number;
  device_id: string;
  order_timestamp: string;
  order_date: string;
  order_hour: number;
  order_day_of_week: number;
  mrp_gmv: number;
  item_cost: number;
  total_items_in_cart: number;
  customer_name: string;
  cart_item_names: string;
  cart_item_categories: string;
  risk_score: number;
  risk_level: 'pass' | 'review' | 'block' | string;
  recommended_action: string;
  confidence: number;
  reasons: string;
  top_signals_json: string; // JSON string to be parsed
  ops_status: string;
  ops_decision: string;
  ops_notes: string;
  created_at: string;
  last_updated_at: string;
}

export interface Signal {
  signal: string;
  value: string | number;
  why: string;
}

export type RiskLevel = 'all' | 'pass' | 'review' | 'block';
