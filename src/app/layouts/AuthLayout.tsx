import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthBanner } from "@/features/auth/components/organisms/AuthBanner";
import Logo from "@/shared/components/molecules/Logo/Logo";
import { useAuthStore } from "@/store/useAuthStore";

export const AuthLayout = () => {
  const transitioning = useAuthStore((s) => s.loginTransition !== "idle");

  return (
    <section className="grid h-screen bg-black w-full md:p-3 grid-cols-[35%_65%] max-md:relative max-md:grid-cols-1">
      <div className="md:hidden max-md:absolute top-10 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <Logo />
      </div>
      <motion.div
        className="flex items-center justify-center"
        animate={{
          opacity: transitioning ? 0 : 1,
          x: transitioning ? -24 : 0,
        }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      >
        <Outlet />
      </motion.div>
      <AuthBanner hidden={transitioning} />
    </section>
  );
};
