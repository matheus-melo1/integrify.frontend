import {
  GradientBadge,
  type GradientBadgeColor,
} from "@/shared/components/molecules/GradientBadge";
import type { IntegrationStatus } from "../../types/integration.types";

const MAP: Record<
  IntegrationStatus,
  { label: string; color: GradientBadgeColor }
> = {
  connected: { label: "Conectado", color: "green" },
  syncing: { label: "Sincronizando", color: "blue" },
  disconnected: { label: "Desconectado", color: "neutral" },
  error: { label: "Com erro", color: "red" },
};

type Props = {
  status: IntegrationStatus;
  className?: string;
};

export function IntegrationStatusBadge({ status, className }: Props) {
  const { label, color } = MAP[status];
  return (
    <GradientBadge color={color} className={className}>
      {label}
    </GradientBadge>
  );
}
