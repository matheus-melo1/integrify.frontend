import type { Marketplace } from "@/shared/types/marketplace.types";

export type SaleStatus = "paid" | "shipped" | "pending" | "cancelled";

export type Sale = {
  id: string;
  product: string;
  customer: string;
  marketplace: Marketplace;
  date: string;
  amount: number;
  status: SaleStatus;
};
