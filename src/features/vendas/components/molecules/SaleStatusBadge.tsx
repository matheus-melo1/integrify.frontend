import {
  GradientBadge,
  type GradientBadgeColor,
} from "@/shared/components/molecules/GradientBadge";
import type { SaleStatus } from "../../types/sale.types";

const MAP: Record<SaleStatus, { label: string; color: GradientBadgeColor }> = {
  paid: { label: "Paga", color: "green" },
  shipped: { label: "Enviada", color: "blue" },
  pending: { label: "Pendente", color: "amber" },
  cancelled: { label: "Cancelada", color: "red" },
};

type Props = {
  status: SaleStatus;
  className?: string;
};

export function SaleStatusBadge({ status, className }: Props) {
  const { label, color } = MAP[status];
  return (
    <GradientBadge color={color} className={className}>
      {label}
    </GradientBadge>
  );
}
