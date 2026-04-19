import {
  GradientBadge,
  type GradientBadgeColor,
} from "@/shared/components/molecules/GradientBadge";

export type AdStatus = "active" | "paused" | "pending";

const MAP: Record<AdStatus, { label: string; color: GradientBadgeColor }> = {
  active: { label: "Ativo", color: "green" },
  paused: { label: "Pausado", color: "neutral" },
  pending: { label: "Pendente", color: "amber" },
};

type Props = {
  status: AdStatus;
  className?: string;
};

export function StatusBadge({ status, className }: Props) {
  const { label, color } = MAP[status];
  return (
    <GradientBadge color={color} className={className}>
      {label}
    </GradientBadge>
  );
}
