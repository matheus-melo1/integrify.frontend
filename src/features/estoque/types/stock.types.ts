import type { Marketplace } from "@/shared/types/marketplace.types";

export type StockStatus = "active" | "low" | "out-of-stock" | "paused";

export type Stock = {
  id: string;
  sku: string;
  name: string;
  marketplace: Marketplace;
  stock: number;
  price: number;
  image: string;
  status: StockStatus;
  description?: string;
  org_id?: string;
  is_deleted?: boolean;
};

const VALID_STATUSES: ReadonlySet<StockStatus> = new Set([
  "active",
  "low",
  "out-of-stock",
  "paused",
]);

export const normalizeStatus = (s: string): StockStatus =>
  VALID_STATUSES.has(s as StockStatus) ? (s as StockStatus) : "active";
