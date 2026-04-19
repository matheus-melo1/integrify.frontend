import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type Props = {
  label: string;
  value: ReactNode;
  className?: string;
};

export function MetricRow({ label, value, className }: Props) {
  return (
    <div className={cn("flex items-center justify-between text-sm", className)}>
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
