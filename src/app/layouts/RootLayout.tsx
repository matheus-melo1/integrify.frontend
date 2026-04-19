import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { LoginTransitionOverlay } from "@/features/auth/components/organisms/LoginTransitionOverlay";

export const RootLayout = () => (
  <Suspense
    fallback={
      <div className="flex h-screen items-center justify-center">Carregando...</div>
    }
  >
    <Outlet />
    <LoginTransitionOverlay />
  </Suspense>
);
