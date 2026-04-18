import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export const RootLayout = () => (
  <Suspense
    fallback={
      <div className="flex h-screen items-center justify-center">Carregando...</div>
    }
  >
    <Outlet />
  </Suspense>
);
