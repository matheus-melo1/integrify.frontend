import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import GradientBorder from "../../molecules/GradientBorder/GradientBorder";
import type { IconType } from "react-icons/lib";

type Props = {
  icon: LucideIcon | IconType;
  label: string;
  isSelected: boolean;
  onClick: () => void;
  showLabel?: boolean;
  className?: string;
  endIcon?: LucideIcon | IconType;
};

export function MobileNavItem({
  icon: Icon,
  label,
  isSelected,
  onClick,
  className,
  showLabel = false,
  endIcon: EndIcon,
}: Props) {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      aria-label={label}
      className={cn(
        className,
        "relative h-12 rounded-2xl hover:bg-transparent",
        isSelected ? "text-white" : "text-neutral-400",
        showLabel
          ? "w-full justify-start gap-3 px-4"
          : EndIcon
            ? "w-auto gap-1 px-2.5"
            : "size-12 p-0",
      )}
    >
      {isSelected && (
        <motion.div
          layoutId="mobile-navbar-active-bg"
          className="absolute inset-0 rounded-2xl bg-neutral-700/80"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        >
          <GradientBorder
            className={cn(
              isSelected ? "p-[0.2px]!" : "bg-card p-0!",
              " from-white/40! via-neutral-900/40!  to-white/30! rounded-xl!",
            )}
          ></GradientBorder>

          <div className="w-[99%] h-[97%] left-[1.2px] top-[0.6px] absolute inset-0 rounded-2xl bg-neutral-800/80" />
        </motion.div>
      )}
      <Icon className="relative z-10 !size-5" />
      {showLabel && (
        <span className="relative z-10 text-sm font-medium">{label}</span>
      )}
      {EndIcon && <EndIcon className="relative z-10 !size-4 opacity-70" />}
    </Button>
  );
}
