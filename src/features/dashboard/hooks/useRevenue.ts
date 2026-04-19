import { useMemo, useState } from "react";
import type { Marketplace } from "../types/store.types";

export type Currency = "BRL" | "USD";

const RATES: Record<Currency, number> = {
  BRL: 1,
  USD: 0.2,
};

const LOCALES: Record<Currency, string> = {
  BRL: "pt-BR",
  USD: "en-US",
};

export type MarketplaceRevenue = {
  marketplace: Marketplace;
  amount: number;
  share: number;
  variation: number;
};

const BREAKDOWN_BRL: MarketplaceRevenue[] = [
  { marketplace: "mercado-livre", amount: 9837.21, share: 42.6, variation: 8.4 },
  { marketplace: "shopee", amount: 6428.13, share: 27.8, variation: -3.2 },
  { marketplace: "amazon", amount: 4218.55, share: 18.3, variation: 12.7 },
  { marketplace: "magalu", amount: 2610.68, share: 11.3, variation: -1.5 },
];

const TREND = [
  18, 22, 19, 25, 28, 24, 30, 27, 32, 29, 35, 33, 38, 34, 40, 37, 42, 39, 44, 41,
];

export const useRevenue = () => {
  const [currency, setCurrency] = useState<Currency>("BRL");

  const totalBRL = 23094.57;
  const yearlyAvgBRL = 34502.19;
  const ticketBRL = 187.42;
  const projectionBRL = 31200.0;

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(LOCALES[currency], {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }),
    [currency],
  );

  const rate = RATES[currency];
  const fmt = (v: number) => formatter.format(v * rate);

  const breakdown = useMemo(
    () =>
      BREAKDOWN_BRL.map((b) => ({
        ...b,
        formatted: fmt(b.amount),
      })),
    [currency],
  );

  const trend = useMemo(
    () => TREND.map((v, i) => ({ x: i, value: v })),
    [],
  );

  return {
    currency,
    setCurrency,
    total: fmt(totalBRL),
    yearlyAvg: fmt(yearlyAvgBRL),
    ticket: fmt(ticketBRL),
    projection: fmt(projectionBRL),
    comparedLastMonth: -37.16,
    orders: 123,
    ordersVariation: 12.83,
    conversion: 3.42,
    conversionVariation: 0.6,
    breakdown,
    trend,
  };
};
