import {
  GradientBadge,
  type GradientBadgeColor,
} from "@/shared/components/molecules/GradientBadge";
import type { StockStatus } from "../../types/stock.types";

const MAP: Record<StockStatus, { label: string; color: GradientBadgeColor }> = {
  active: { label: "Ativo", color: "green" },
  low: { label: "Estoque baixo", color: "amber" },
  "out-of-stock": { label: "Esgotado", color: "red" },
  paused: { label: "Pausado", color: "neutral" },
};

type Props = {
  status: StockStatus;
  className?: string;
};

export function StockStatusBadge({ status, className }: Props) {
  const { label, color } = MAP[status];
  return (
    <GradientBadge color={color} className={className}>
      {label}
    </GradientBadge>
  );
}
