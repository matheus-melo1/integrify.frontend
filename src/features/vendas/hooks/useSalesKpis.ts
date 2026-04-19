import { useMemo } from "react";

export type SalesKpi = {
  id: string;
  label: string;
  value: string;
  variation?: number;
  variationSuffix?: string;
};

const formatBRL = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

export const useSalesKpis = () => {
  const kpis = useMemo<SalesKpi[]>(
    () => [
      { id: "revenue", label: "Faturamento", value: formatBRL(23094.57), variation: -37.16 },
      { id: "orders", label: "Pedidos", value: "123", variation: 12.83 },
      { id: "ticket", label: "Ticket médio", value: formatBRL(187.42), variation: 4.1 },
      { id: "pending", label: "Pendentes", value: "7", variation: -2, variationSuffix: "" },
    ],
    [],
  );
  return { kpis };
};
