import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { ROUTES } from "@/app/router/routes";

const SIDEBAR_WIDTH = 240;
const EDGE = 8;

type Rect = { top: number; left: number; width: number; height: number };

const NAV_ITEMS = 5;

const SidebarSkeleton = ({ visible }: { visible: boolean }) => (
  <motion.div
    initial={{ opacity: 0, x: -16 }}
    animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -16 }}
    transition={{
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
      delay: visible ? 0.25 : 0,
    }}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: SIDEBAR_WIDTH,
      height: "100vh",
      zIndex: 101,
      pointerEvents: "none",
    }}
    className="py-4 px-3 flex flex-col justify-between"
  >
    <div className="flex flex-col gap-1.5 px-2 py-2">
      <div className="h-10 w-28 rounded-md bg-neutral-800/70 mb-2 animate-pulse" />
      {Array.from({ length: NAV_ITEMS }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 py-2.5 px-3 rounded-2xl"
          style={{
            background:
              i === 0
                ? "rgba(64, 64, 64, 0.5)"
                : "rgba(38, 38, 38, 0.35)",
          }}
        >
          <div className="h-4 w-4 rounded bg-neutral-700/80 animate-pulse" />
          <div
            className="h-3 rounded bg-neutral-700/70 animate-pulse"
            style={{ width: 70 + ((i * 13) % 40) }}
          />
        </div>
      ))}
    </div>
    <div className="px-2 pb-2">
      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-800/50">
        <div className="h-8 w-8 rounded-full bg-neutral-700/80 animate-pulse" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="h-2.5 w-20 rounded bg-neutral-700/80 animate-pulse" />
          <div className="h-2 w-14 rounded bg-neutral-700/60 animate-pulse" />
        </div>
      </div>
    </div>
  </motion.div>
);

export const LoginTransitionOverlay = () => {
  const state = useAuthStore((s) => s.loginTransition);
  const advanceToFading = useAuthStore((s) => s.advanceToFading);
  const endLoginTransition = useAuthStore((s) => s.endLoginTransition);
  const navigate = useNavigate();
  const [rect, setRect] = useState<Rect | null>(null);

  useLayoutEffect(() => {
    if (state === "expanding" && !rect) {
      const el = document.querySelector("[data-auth-banner]");
      if (el) {
        const r = el.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      }
    }
    if (state === "idle" && rect) {
      setRect(null);
    }
  }, [state, rect]);

  if (state === "idle" || !rect) return null;

  const target: Rect = {
    top: EDGE,
    left: SIDEBAR_WIDTH,
    width: window.innerWidth - SIDEBAR_WIDTH - EDGE,
    height: window.innerHeight - EDGE * 2,
  };

  const expanding = state === "expanding";

  return createPortal(
    <>
      <SidebarSkeleton visible={expanding} />
      <motion.div
        initial={{
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          borderRadius: 16,
          opacity: 1,
        }}
        animate={{
          top: target.top,
          left: target.left,
          width: target.width,
          height: target.height,
          borderRadius: 12,
          opacity: expanding ? 1 : 0,
        }}
        transition={{
          duration: expanding ? 0.75 : 0.55,
          ease: expanding ? [0.16, 1, 0.3, 1] : [0.4, 0, 0.2, 1],
        }}
        onAnimationComplete={() => {
          if (expanding) {
            navigate(ROUTES.DASHBOARD, { replace: true });
            requestAnimationFrame(() => {
              requestAnimationFrame(() => advanceToFading());
            });
          } else {
            endLoginTransition();
          }
        }}
        style={{
          position: "fixed",
          zIndex: 100,
          pointerEvents: "none",
          background:
            "radial-gradient(120% 120% at 100% 0%, rgb(38, 38, 38) 0%, rgb(17, 17, 17) 55%, rgb(10, 10, 10) 100%)",
          boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset",
        }}
      />
    </>,
    document.body,
  );
};
