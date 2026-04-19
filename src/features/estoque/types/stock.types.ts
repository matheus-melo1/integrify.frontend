import type { Marketplace } from "@/shared/types/marketplace.types";

export type StockStatus = "active" | "low" | "out-of-stock" | "paused";

export type Stock = {
  id: string;
  sku: string;
  name: string;
  marketplace: Marketplace;
  quantity: number;
  price: number;
  imageUrl: string;
  status: StockStatus;
  updatedAt: string;
};
