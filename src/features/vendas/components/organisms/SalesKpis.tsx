import { SalesKpiCard } from "../molecules/SalesKpiCard";
import { useSalesKpis } from "../../hooks/useSalesKpis";

export function SalesKpis() {
  const { kpis } = useSalesKpis();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((k) => (
        <SalesKpiCard
          key={k.id}
          label={k.label}
          value={k.value}
          variation={k.variation}
          variationSuffix={k.variationSuffix}
        />
      ))}
    </div>
  );
}
