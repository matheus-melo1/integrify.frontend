import { Suspense, useEffect, useState } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { protectedRoutes } from "@/app/router/protectedRoutes";

const getRouteIndex = (pathname: string) =>
  protectedRoutes.findIndex((route) => route.path === pathname);

export const AnimatedOutlet = () => {
  const { pathname } = useLocation();
  const element = useOutlet();
  const currentIndex = getRouteIndex(pathname);
  const [prevIndex, setPrevIndex] = useState(currentIndex);

  const direction =
    currentIndex === -1 || prevIndex === -1
      ? 0
      : Math.sign(currentIndex - prevIndex);

  useEffect(() => {
    setPrevIndex(currentIndex);
  }, [currentIndex]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout" custom={direction}>
        <motion.div
          key={pathname}
          custom={direction}
          variants={{
            enter: (dir: number) => ({ y: dir * 16, opacity: 0 }),
            center: { y: 0, opacity: 1 },
            exit: (dir: number) => ({ y: dir * -16, opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            y: { type: "spring", stiffness: 260, damping: 30, mass: 0.9 },
            opacity: { duration: 0.35, ease: "easeOut" },
          }}
          className="absolute inset-0 p-5 h-full w-full overflow-y-auto max-md:pb-28"
        >
          <Suspense fallback={null}>{element}</Suspense>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
