import { Info } from "lucide-react";
import { Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/components/ui/chart";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { SurfaceCard } from "@/shared/components/molecules/SurfaceCard/SurfaceCard";
import { MetricRow } from "../molecules/MetricRow";
import {
  useDashboardOverview,
  type OverviewPeriod,
} from "../../hooks/useDashboardOverview";

const chartConfig: ChartConfig = {
  value: {
    label: "Vendas",
    color: "var(--color-primary)",
  },
};

export function OverviewCard() {
  const { period, setPeriod, series, variation, ordersGrowth, comparative, lastUpdatedAt } =
    useDashboardOverview();

  return (
    <SurfaceCard className="h-full" innerClassName="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">Visão Geral</h3>
        <Info size={16} className="text-muted-foreground" />
      </div>

      <div className="flex flex-col gap-2">
        <MetricRow label="Pedidos no mês" value={`+${ordersGrowth}%`} />
        <MetricRow label="Comparativo" value={comparative} />
      </div>

      <Tabs
        value={period}
        onValueChange={(v) => setPeriod(v as OverviewPeriod)}
      >
        <TabsList className="bg-neutral-800 w-fit">
          <TabsTrigger value="24h">24h</TabsTrigger>
          <TabsTrigger value="week">Semana</TabsTrigger>
          <TabsTrigger value="month">Mês</TabsTrigger>
        </TabsList>
      </Tabs>

      <ChartContainer config={chartConfig} className="flex-1 min-h-[120px] w-full">
        <LineChart data={series} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
          <XAxis dataKey="label" hide />
          <YAxis hide />
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          <Line
            dataKey="value"
            type="monotone"
            stroke="var(--color-primary)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ChartContainer>

      <div className="flex items-end justify-between mt-auto pt-3 border-t border-neutral-800">
        <div>
          <p className="text-3xl font-light text-primary">+{variation}%</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-muted-foreground">Atualizado em</p>
          <p className="text-xs">{lastUpdatedAt}</p>
        </div>
      </div>
    </SurfaceCard>
  );
}
