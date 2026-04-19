import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";

type Props = {
  open: boolean;
  onToggle: () => void;
};

export function SidebarToggle({ open, onToggle }: Props) {
  return (
    <div
      className={cn(
        open ? "justify-end" : "justify-center",
        "w-full flex relative",
      )}
    >
      <Button
        className="text-muted-foreground max-md:hidden"
        onClick={onToggle}
        variant="link"
      >
        {open ? (
          <PanelRightOpen className="w-5! h-5!" />
        ) : (
          <PanelRightClose className="w-5! h-5!" />
        )}
      </Button>
    </div>
  );
}
