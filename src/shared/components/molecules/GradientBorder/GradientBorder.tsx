import { cn } from "@/shared/lib/cn";
import type { PropsWithChildren } from "react";

export default function GradientBorder({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        "rounded-full w-full h-full bg-gradient-to-br from-white/30 via-white/5  to-white/20 p-[0.2px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
