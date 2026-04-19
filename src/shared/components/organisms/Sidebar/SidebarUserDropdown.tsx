import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import type { SidebarUserMenuItem } from "@/shared/hooks/useSidebarUserMenu";

type Props = {
  items: SidebarUserMenuItem[];
  trigger: ReactNode;
};

export function SidebarUserDropdown({ items, trigger }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<div>{trigger}</div>} />
      <DropdownMenuContent
        side="top"
        align="end"
        sideOffset={8}
        className="!p-0 !bg-transparent !border-0 !shadow-none w-56"
      >
        <div className="bg-neutral-900/95 backdrop-blur-md p-1.5 flex flex-col gap-0.5">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem
                key={item.id}
                onClick={item.onSelect}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm transition-colors",
                  item.active
                    ? "bg-neutral-800 text-foreground"
                    : "text-muted-foreground hover:bg-neutral-800/60 hover:text-foreground",
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1 truncate">{item.label}</span>
                {item.active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
