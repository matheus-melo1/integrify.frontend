import type { Marketplace } from "@/shared/types/marketplace.types";

export type IntegrationStatus =
  | "connected"
  | "disconnected"
  | "syncing"
  | "error";

export type Integration = {
  id: string;
  name: string;
  marketplace: Marketplace;
  status: IntegrationStatus;
  lastSyncAt: string;
  products: number;
  orders: number;
};

export type MarketplaceOption = {
  marketplace: Marketplace;
  description: string;
};
