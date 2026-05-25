import { motion } from "framer-motion";
import { Sidebar } from "@/shared/components/organisms/Sidebar/Sidebar";
import { MobileNavbar } from "@/shared/components/organisms/MobileNavbar/MobileNavbar";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import GradientBorder from "@/shared/components/molecules/GradientBorder/GradientBorder";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { cn } from "@/shared/lib/utils";
import { AnimatedOutlet } from "./AnimatedOutlet";
import { useAuthStore } from "@/store/useAuthStore";

export const MainLayout = () => {
  const enteringFromAuth = useAuthStore((s) => s.loginTransition === "fading");
  const isMobile = useIsMobile();

  return (
    <div className="w-full flex flex-col h-screen bg-[#F5F7F9] dark:bg-[#060606]">
      {isMobile && <MobileNavbar />}
      <div className="w-full flex h-full relative">
        {!isMobile && (
          <motion.div
            initial={enteringFromAuth ? { x: -40, opacity: 0 } : false}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          >
            <Sidebar />
          </motion.div>
        )}

        <div
          className={cn(
            "w-full h-full transition-all duration-300",
            isMobile ? "" : "py-2 pr-2",
          )}
        >
          <GradientBorder
            className={cn(
              "from-white/30 via-white/5 to-white/20",
              isMobile ? "p-0! rounded-none!" : "p-[0.8px]! rounded-xl!",
            )}
          >
            <ScrollArea
              className={cn(
                "h-full w-full",
                isMobile
                  ? "bg-[#F5F7F9] dark:bg-[#060606]"
                  : "bg-white dark:bg-neutral-900 rounded-xl",
              )}
            >
              <div className="h-full w-full pb-0 md:pb-0">
                <AnimatedOutlet />
              </div>
            </ScrollArea>
          </GradientBorder>
        </div>
      </div>
    </div>
  );
};
