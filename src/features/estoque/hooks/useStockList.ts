import { useMemo, useState } from "react";
import type { Marketplace } from "@/shared/types/marketplace.types";
import type { StockStatus } from "../types/stock.types";
import { useStoragesQuery } from "../services/storage.queries";

const PAGE_SIZE = 12;

export const useStockList = () => {
  const { data, isLoading, isError, refetch } = useStoragesQuery();

  const [search, setSearch] = useState("");
  const [marketplace, setMarketplace] = useState<Marketplace | "all">("all");
  const [status, setStatus] = useState<StockStatus | "all">("all");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (data ?? []).filter((s) => {
      if (marketplace !== "all" && s.marketplace !== marketplace) return false;
      if (status !== "all" && s.status !== status) return false;
      if (!term) return true;
      return (
        s.name.toLowerCase().includes(term) ||
        s.sku.toLowerCase().includes(term)
      );
    });
  }, [data, search, marketplace, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const items = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  return {
    search,
    setSearch: (v: string) => {
      setSearch(v);
      setPage(0);
    },
    marketplace,
    setMarketplace: (v: Marketplace | "all") => {
      setMarketplace(v);
      setPage(0);
    },
    status,
    setStatus: (v: StockStatus | "all") => {
      setStatus(v);
      setPage(0);
    },
    page: safePage,
    totalPages,
    next: () => setPage((p) => Math.min(p + 1, totalPages - 1)),
    prev: () => setPage((p) => Math.max(p - 1, 0)),
    items,
    total: filtered.length,
    isLoading,
    isError,
    refetch,
  };
};

export type StockListController = ReturnType<typeof useStockList>;
