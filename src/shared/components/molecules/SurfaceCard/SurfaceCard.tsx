import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
};

export function SurfaceCard({ children, innerClassName }: Props) {
  return (
    <div
      className={cn(
        "bg-neutral-800 border border-neutral-700 rounded-2xl p-5 h-full w-full",
        innerClassName,
      )}
    >
      {children}
    </div>
  );
}
