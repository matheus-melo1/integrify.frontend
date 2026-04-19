import { motion } from "framer-motion";
import { Sidebar } from "@/shared/components/organisms/Sidebar/Sidebar";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import GradientBorder from "@/shared/components/molecules/GradientBorder/GradientBorder";
import { AnimatedOutlet } from "./AnimatedOutlet";
import { useAuthStore } from "@/store/useAuthStore";

export const MainLayout = () => {
  const enteringFromAuth = useAuthStore((s) => s.loginTransition === "fading");

  return (
    <div className="w-full flex flex-col h-screen bg-[#F5F7F9] dark:bg-[#060606]">
      <div className="w-full flex h-full">
        <motion.div
          initial={enteringFromAuth ? { x: -40, opacity: 0 } : false}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        >
          <Sidebar />
        </motion.div>
        <div className="w-full py-2 pr-2 h-full transition-all duration-300">
          <GradientBorder className="p-[0.8px]! from-white/30 via-white/5  to-white/20 rounded-xl!">
            <ScrollArea className="bg-white dark:bg-neutral-900 h-full w-full rounded-xl">
              <div className="h-full w-full">
                <AnimatedOutlet />
              </div>
            </ScrollArea>
          </GradientBorder>
        </div>
      </div>
    </div>
  );
};
