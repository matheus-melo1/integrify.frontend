import { useMemo, useState } from "react";

export type OverviewPeriod = "24h" | "week" | "month";

type Point = { label: string; value: number };

const seed = (n: number, base: number, spread: number) =>
  Array.from({ length: n }, (_, i) => ({
    label: String(i + 1),
    value: Math.round(base + Math.sin(i / 1.7) * spread + (i * spread) / n),
  }));

const SERIES: Record<OverviewPeriod, Point[]> = {
  "24h": seed(24, 280, 90),
  week: seed(7, 1800, 600),
  month: seed(30, 5200, 1300),
};

export const useDashboardOverview = () => {
  const [period, setPeriod] = useState<OverviewPeriod>("month");
  const series = useMemo(() => SERIES[period], [period]);

  return {
    period,
    setPeriod,
    series,
    variation: 19.23,
    ordersGrowth: 12.83,
    comparative: "2x maior que o mês passado",
    lastUpdatedAt: "Hoje, 06:49",
  };
};
