import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type Props = {
  open: boolean;
  children: ReactNode;
};

export function SidebarLabel({ open, children }: Props) {
  return (
    <p
      className={cn(
        "truncate font-medium text-sm transition-all duration-300 max-md:hidden",
        open ? "translate-x-0 opacity-100" : "translate-x-96 opacity-0",
      )}
    >
      {children}
    </p>
  );
}
