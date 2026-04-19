import { LogOut } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { SidebarLabel } from "./SidebarLabel";

type Props = {
  open: boolean;
  onSignOut: () => void;
};

export function SidebarSignOut({ open, onSignOut }: Props) {
  return (
    <Button
      variant="ghost"
      onClick={onSignOut}
      className={cn(
        "w-full relative text-muted-foreground text-base gap-3 hover:bg-primary/20 hover:text-primary transition-all py-6! duration-300 justify-start cursor-pointer rounded-2xl max-md:w-fit",
      )}
    >
      <LogOut
        className={cn(
          "w-5! h-5! transition-all duration-300",
          open ? "" : "mr-4 translate-x-[6px] max-md:mr-0 max-md:translate-x-0",
        )}
      />
      <SidebarLabel open={open}>Sair</SidebarLabel>
    </Button>
  );
}
