import { useMemo, useState } from "react";
import type { Marketplace } from "@/shared/types/marketplace.types";
import type { Stock, StockStatus } from "../types/stock.types";

const img = (id: string) => `https://picsum.photos/seed/${id}/400/300`;

const MOCK_STOCK: Stock[] = [
  { id: "SKU-10293", sku: "SKU-10293", name: "Fone Bluetooth Pro", marketplace: "mercado-livre", quantity: 42, price: 289.9, imageUrl: img("SKU-10293"), status: "active", updatedAt: "2026-04-18T10:24:00" },
  { id: "SKU-10294", sku: "SKU-10294", name: "Cadeira Gamer X", marketplace: "shopee", quantity: 7, price: 1399.0, imageUrl: img("SKU-10294"), status: "low", updatedAt: "2026-04-18T08:11:00" },
  { id: "SKU-10295", sku: "SKU-10295", name: "Câmera 4K Mini", marketplace: "amazon", quantity: 0, price: 749.5, imageUrl: img("SKU-10295"), status: "out-of-stock", updatedAt: "2026-04-17T22:09:00" },
  { id: "SKU-10296", sku: "SKU-10296", name: "Air Fryer 5L", marketplace: "magalu", quantity: 128, price: 449.0, imageUrl: img("SKU-10296"), status: "active", updatedAt: "2026-04-17T19:43:00" },
  { id: "SKU-10297", sku: "SKU-10297", name: "Smartwatch Plus", marketplace: "amazon-us", quantity: 23, price: 920.0, imageUrl: img("SKU-10297"), status: "paused", updatedAt: "2026-04-17T14:20:00" },
  { id: "SKU-10298", sku: "SKU-10298", name: "Mochila Anti-furto", marketplace: "mercado-livre", quantity: 89, price: 199.9, imageUrl: img("SKU-10298"), status: "active", updatedAt: "2026-04-17T11:05:00" },
  { id: "SKU-10299", sku: "SKU-10299", name: "Teclado Mecânico RGB", marketplace: "shopee", quantity: 4, price: 379.9, imageUrl: img("SKU-10299"), status: "low", updatedAt: "2026-04-16T20:50:00" },
  { id: "SKU-10300", sku: "SKU-10300", name: 'Monitor 27" 144Hz', marketplace: "amazon", quantity: 15, price: 1899.0, imageUrl: img("SKU-10300"), status: "active", updatedAt: "2026-04-16T15:32:00" },
  { id: "SKU-10301", sku: "SKU-10301", name: "Liquidificador Inox", marketplace: "magalu", quantity: 61, price: 259.0, imageUrl: img("SKU-10301"), status: "active", updatedAt: "2026-04-16T09:18:00" },
  { id: "SKU-10302", sku: "SKU-10302", name: "Cafeteira Italiana", marketplace: "mercado-livre", quantity: 33, price: 159.9, imageUrl: img("SKU-10302"), status: "active", updatedAt: "2026-04-15T17:00:00" },
  { id: "SKU-10303", sku: "SKU-10303", name: "Console Portátil", marketplace: "shopee", quantity: 2, price: 1249.0, imageUrl: img("SKU-10303"), status: "low", updatedAt: "2026-04-15T13:25:00" },
  { id: "SKU-10304", sku: "SKU-10304", name: "Headset Gamer 7.1", marketplace: "amazon", quantity: 54, price: 489.0, imageUrl: img("SKU-10304"), status: "active", updatedAt: "2026-04-15T10:42:00" },
  { id: "SKU-10305", sku: "SKU-10305", name: "Mouse Sem Fio", marketplace: "mercado-livre", quantity: 0, price: 129.9, imageUrl: img("SKU-10305"), status: "out-of-stock", updatedAt: "2026-04-14T22:14:00" },
  { id: "SKU-10306", sku: "SKU-10306", name: 'Tablet 10" Wi-Fi', marketplace: "amazon-us", quantity: 18, price: 1599.0, imageUrl: img("SKU-10306"), status: "paused", updatedAt: "2026-04-14T19:00:00" },
  { id: "SKU-10307", sku: "SKU-10307", name: "Caixa de Som Bluetooth", marketplace: "magalu", quantity: 76, price: 219.9, imageUrl: img("SKU-10307"), status: "active", updatedAt: "2026-04-14T11:36:00" },
  { id: "SKU-10308", sku: "SKU-10308", name: 'Smart TV 50"', marketplace: "shopee", quantity: 9, price: 2399.0, imageUrl: img("SKU-10308"), status: "low", updatedAt: "2026-04-13T21:08:00" },
  { id: "SKU-10309", sku: "SKU-10309", name: "Ventilador de Mesa", marketplace: "mercado-livre", quantity: 112, price: 179.9, imageUrl: img("SKU-10309"), status: "active", updatedAt: "2026-04-13T16:45:00" },
  { id: "SKU-10310", sku: "SKU-10310", name: "SSD 1TB NVMe", marketplace: "amazon", quantity: 47, price: 599.0, imageUrl: img("SKU-10310"), status: "active", updatedAt: "2026-04-13T08:22:00" },
  { id: "SKU-10311", sku: "SKU-10311", name: "Câmera de Segurança", marketplace: "magalu", quantity: 5, price: 329.0, imageUrl: img("SKU-10311"), status: "low", updatedAt: "2026-04-12T20:11:00" },
  { id: "SKU-10312", sku: "SKU-10312", name: "Carregador Turbo USB-C", marketplace: "shopee", quantity: 203, price: 89.9, imageUrl: img("SKU-10312"), status: "active", updatedAt: "2026-04-12T14:00:00" },
];

const PAGE_SIZE = 12;

export const useStockList = () => {
  const [search, setSearch] = useState("");
  const [marketplace, setMarketplace] = useState<Marketplace | "all">("all");
  const [status, setStatus] = useState<StockStatus | "all">("all");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return MOCK_STOCK.filter((s) => {
      if (marketplace !== "all" && s.marketplace !== marketplace) return false;
      if (status !== "all" && s.status !== status) return false;
      if (!term) return true;
      return (
        s.name.toLowerCase().includes(term) ||
        s.sku.toLowerCase().includes(term)
      );
    });
  }, [search, marketplace, status]);

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
  };
};

export type StockListController = ReturnType<typeof useStockList>;
