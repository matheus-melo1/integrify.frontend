import type { Marketplace } from "@/shared/types/marketplace.types";

export type IntegrationStatus =
  | "connected"
  | "syncing"
  | "error"
  | "disconnected";

export type Integration = {
  id: string;
  name: string;
  api_key: string;
  marketplace: Marketplace;
  status: IntegrationStatus;
  stock_sync: boolean;
  order_sync: boolean;
};

export type IntegrationRequest = {
  name: string;
  api_key: string;
  marketplace: Marketplace;
  status?: IntegrationStatus;
  stock_sync?: boolean;
  order_sync?: boolean;
};

export type MarketplaceOption = {
  marketplace: Marketplace;
  description: string;
};
