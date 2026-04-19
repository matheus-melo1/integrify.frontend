import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import type { ProtectedRoute } from "@/app/router/protectedRoutes";
import { SidebarLabel } from "./SidebarLabel";
import GradientBorder from "../../molecules/GradientBorder/GradientBorder";

type Props = {
  route: ProtectedRoute;
  open: boolean;
  isSelected: boolean;
};

export function SidebarNavItem({ route, open, isSelected }: Props) {
  const navigate = useNavigate();
  const Icon = route.icon;

  return (
    <Button
      onClick={() => navigate(route.path)}
      variant="ghost"
      className={cn(
        isSelected ? "text-primary" : "text-muted-foreground",
        "w-full relative text-base gap-3 hover:bg-primary/20 hover:text-primary py-5! justify-start cursor-pointer rounded-2xl max-md:w-14 max-md:justify-center",
      )}
    >
      {isSelected && (
        <motion.div
          layoutId="sidebar-active-bg"
          className="absolute bg-neutral-900 inset-0 rounded-2xl"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        >
          <GradientBorder
            className={cn(
              isSelected ? "p-[0.2px]!" : "bg-card p-0!",
              " from-white/40! via-neutral-950/80!  to-white/30! rounded-xl!",
            )}
          ></GradientBorder>

          <div className="w-[99%] h-[97%] left-[1.2px] top-[0.6px] absolute inset-0 rounded-2xl bg-neutral-900" />
        </motion.div>
      )}
      <span className="relative z-10 flex items-center gap-3">
        <Icon
          className={cn(
            "!w-4 !h-4 transition-all duration-300",
            open ? "" : "translate-x-[7px] max-md:mr-0 max-md:translate-x-0",
          )}
        />
        <SidebarLabel open={open}>{route.name}</SidebarLabel>
      </span>
    </Button>
  );
}
