import { ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";
import { Area, AreaChart } from "recharts";
import {
  ChartContainer,
  type ChartConfig,
} from "@/shared/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";
import { SurfaceCard } from "@/shared/components/molecules/SurfaceCard/SurfaceCard";
import { MarketplaceLogo } from "@/shared/components/molecules/MarketplaceLogo";
import { useRevenue, type Currency } from "../../hooks/useRevenue";

const chartConfig: ChartConfig = {
  value: { label: "Vendas", color: "var(--color-primary)" },
};

type KpiProps = {
  label: string;
  value: string;
  variation?: number;
  variationSuffix?: string;
};

function Kpi({ label, value, variation, variationSuffix = "%" }: KpiProps) {
  const positive = variation !== undefined && variation >= 0;
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="text-lg font-light">{value}</span>
      {variation !== undefined && (
        <span
          className={cn(
            "inline-flex items-center gap-0.5 text-[11px]",
            positive ? "text-emerald-400" : "text-red-400",
          )}
        >
          {positive ? (
            <ArrowUpRight size={12} />
          ) : (
            <ArrowDownRight size={12} />
          )}
          {positive ? "+" : ""}
          {variation}
          {variationSuffix}
        </span>
      )}
    </div>
  );
}

export function RevenueCard() {
  const {
    currency,
    setCurrency,
    total,
    yearlyAvg,
    ticket,
    projection,
    comparedLastMonth,
    orders,
    ordersVariation,
    conversion,
    conversionVariation,
    breakdown,
    trend,
  } = useRevenue();

  return (
    <SurfaceCard className="h-full" innerClassName="flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-medium">Faturamento Total</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Soma de todas as vendas na sua carteira
          </p>
        </div>
        <Select
          value={currency}
          onValueChange={(v) => setCurrency(v as Currency)}
        >
          <SelectTrigger className="w-[110px] h-8 text-xs bg-neutral-900 border-neutral-800">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BRL">Real (BRL)</SelectItem>
            <SelectItem value="USD">Dólar (USD)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-4xl font-light leading-none">{total}</p>
          <div className="flex items-center gap-2 text-xs">
            <span
              className={cn(
                "inline-flex items-center gap-0.5",
                comparedLastMonth >= 0 ? "text-emerald-400" : "text-red-400",
              )}
            >
              {comparedLastMonth >= 0 ? (
                <ArrowUpRight size={12} />
              ) : (
                <ArrowDownRight size={12} />
              )}
              {comparedLastMonth}%
            </span>
            <span className="text-muted-foreground">vs. mês passado</span>
          </div>
        </div>
        <ChartContainer
          config={chartConfig}
          className="h-14 w-32 shrink-0"
        >
          <AreaChart data={trend} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="revenueArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              dataKey="value"
              type="monotone"
              stroke="var(--color-primary)"
              strokeWidth={1.5}
              fill="url(#revenueArea)"
            />
          </AreaChart>
        </ChartContainer>
      </div>

      <div className="grid grid-cols-4 gap-4 pt-4 border-t border-neutral-700/60">
        <Kpi label="Pedidos" value={String(orders)} variation={ordersVariation} />
        <Kpi label="Ticket médio" value={ticket} />
        <Kpi
          label="Conversão"
          value={`${conversion}%`}
          variation={conversionVariation}
          variationSuffix="pp"
        />
        <Kpi label="Média anual" value={yearlyAvg} />
      </div>

      <div className="flex flex-col gap-3 pt-4 border-t border-neutral-700/60">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Por marketplace</span>
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
            <TrendingUp size={12} />
            Projeção: {projection}
          </span>
        </div>
        <div className="flex flex-col gap-2.5">
          {breakdown.map((item) => {
            const positive = item.variation >= 0;
            return (
              <div key={item.marketplace} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <MarketplaceLogo marketplace={item.marketplace} />
                    <span className="text-muted-foreground">
                      {item.share.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{item.formatted}</span>
                    <span
                      className={cn(
                        "text-[11px] tabular-nums",
                        positive ? "text-emerald-400" : "text-red-400",
                      )}
                    >
                      {positive ? "+" : ""}
                      {item.variation}%
                    </span>
                  </div>
                </div>
                <div className="h-1 w-full rounded-full bg-neutral-700/40 overflow-hidden">
                  <div
                    className="h-full bg-primary/80 rounded-full"
                    style={{ width: `${item.share}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SurfaceCard>
  );
}
