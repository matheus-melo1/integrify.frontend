import { useMemo } from "react";
import type { Integration } from "../types/integration.types";

const MOCK: Integration[] = [
  {
    id: "int-1",
    name: "Pela Design",
    marketplace: "mercado-livre",
    status: "connected",
    lastSyncAt: "Hoje, 06:49",
    products: 142,
    orders: 1289,
  },
  {
    id: "int-2",
    name: "Elixir Ads",
    marketplace: "shopee",
    status: "syncing",
    lastSyncAt: "Sincronizando agora",
    products: 87,
    orders: 412,
  },
  {
    id: "int-3",
    name: "Carbon Store",
    marketplace: "amazon",
    status: "connected",
    lastSyncAt: "Hoje, 04:12",
    products: 230,
    orders: 1875,
  },
  {
    id: "int-4",
    name: "Magalu Premium",
    marketplace: "magalu",
    status: "error",
    lastSyncAt: "Ontem, 22:08",
    products: 56,
    orders: 198,
  },
  {
    id: "int-5",
    name: "Carbon US",
    marketplace: "amazon-us",
    status: "disconnected",
    lastSyncAt: "Há 3 dias",
    products: 0,
    orders: 0,
  },
];

export const useIntegrations = () => {
  const integrations = useMemo(() => MOCK, []);
  const stats = useMemo(
    () => ({
      total: integrations.length,
      connected: integrations.filter((i) => i.status === "connected").length,
      issues: integrations.filter(
        (i) => i.status === "error" || i.status === "disconnected",
      ).length,
    }),
    [integrations],
  );
  return { integrations, stats };
};
