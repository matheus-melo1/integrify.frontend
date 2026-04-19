import { useMemo, useState } from "react";
import type { Marketplace } from "@/shared/types/marketplace.types";
import type { Sale, SaleStatus } from "../types/sale.types";

const MOCK_SALES: Sale[] = [
  { id: "#PED-10293", product: "Fone Bluetooth Pro", customer: "João Silva", marketplace: "mercado-livre", date: "2026-04-18T10:24:00", amount: 289.9, status: "paid" },
  { id: "#PED-10294", product: "Cadeira Gamer X", customer: "Maria Souza", marketplace: "shopee", date: "2026-04-18T08:11:00", amount: 1399.0, status: "shipped" },
  { id: "#PED-10295", product: "Camera 4K Mini", customer: "Pedro Lima", marketplace: "amazon", date: "2026-04-17T22:09:00", amount: 749.5, status: "pending" },
  { id: "#PED-10296", product: "Air Fryer 5L", customer: "Ana Carolina", marketplace: "magalu", date: "2026-04-17T19:43:00", amount: 449.0, status: "paid" },
  { id: "#PED-10297", product: "Smartwatch Plus", customer: "Renato Alves", marketplace: "amazon-us", date: "2026-04-17T14:20:00", amount: 920.0, status: "cancelled" },
  { id: "#PED-10298", product: "Mochila Anti-furto", customer: "Bruno Costa", marketplace: "mercado-livre", date: "2026-04-17T11:05:00", amount: 199.9, status: "paid" },
  { id: "#PED-10299", product: "Teclado Mecânico RGB", customer: "Carla Mendes", marketplace: "shopee", date: "2026-04-16T20:50:00", amount: 379.9, status: "shipped" },
  { id: "#PED-10300", product: "Monitor 27\" 144Hz", customer: "Diego Ramos", marketplace: "amazon", date: "2026-04-16T15:32:00", amount: 1899.0, status: "paid" },
  { id: "#PED-10301", product: "Liquidificador Inox", customer: "Elis Regina", marketplace: "magalu", date: "2026-04-16T09:18:00", amount: 259.0, status: "pending" },
  { id: "#PED-10302", product: "Cafeteira Italiana", customer: "Fernando Dias", marketplace: "mercado-livre", date: "2026-04-15T17:00:00", amount: 159.9, status: "paid" },
  { id: "#PED-10303", product: "Console Portátil", customer: "Gabriela Pinto", marketplace: "shopee", date: "2026-04-15T13:25:00", amount: 1249.0, status: "shipped" },
  { id: "#PED-10304", product: "Headset Gamer 7.1", customer: "Hugo Martins", marketplace: "amazon", date: "2026-04-15T10:42:00", amount: 489.0, status: "paid" },
  { id: "#PED-10305", product: "Mouse Sem Fio", customer: "Isabela Rocha", marketplace: "mercado-livre", date: "2026-04-14T22:14:00", amount: 129.9, status: "cancelled" },
  { id: "#PED-10306", product: "Tablet 10\" Wi-Fi", customer: "Júlio Cesar", marketplace: "amazon-us", date: "2026-04-14T19:00:00", amount: 1599.0, status: "pending" },
  { id: "#PED-10307", product: "Caixa de Som Bluetooth", customer: "Karen Lopes", marketplace: "magalu", date: "2026-04-14T11:36:00", amount: 219.9, status: "paid" },
  { id: "#PED-10308", product: "Smart TV 50\"", customer: "Lucas Oliveira", marketplace: "shopee", date: "2026-04-13T21:08:00", amount: 2399.0, status: "shipped" },
  { id: "#PED-10309", product: "Ventilador de Mesa", customer: "Marina Sales", marketplace: "mercado-livre", date: "2026-04-13T16:45:00", amount: 179.9, status: "paid" },
  { id: "#PED-10310", product: "SSD 1TB NVMe", customer: "Nilton Vieira", marketplace: "amazon", date: "2026-04-13T08:22:00", amount: 599.0, status: "paid" },
  { id: "#PED-10311", product: "Câmera de Segurança", customer: "Olivia Pereira", marketplace: "magalu", date: "2026-04-12T20:11:00", amount: 329.0, status: "pending" },
  { id: "#PED-10312", product: "Carregador Turbo USB-C", customer: "Paulo Henrique", marketplace: "shopee", date: "2026-04-12T14:00:00", amount: 89.9, status: "paid" },
];

const PAGE_SIZE = 8;

export const useSalesList = () => {
  const [search, setSearch] = useState("");
  const [marketplace, setMarketplace] = useState<Marketplace | "all">("all");
  const [status, setStatus] = useState<SaleStatus | "all">("all");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return MOCK_SALES.filter((s) => {
      if (marketplace !== "all" && s.marketplace !== marketplace) return false;
      if (status !== "all" && s.status !== status) return false;
      if (!term) return true;
      return (
        s.product.toLowerCase().includes(term) ||
        s.customer.toLowerCase().includes(term) ||
        s.id.toLowerCase().includes(term)
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
    setStatus: (v: SaleStatus | "all") => {
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
