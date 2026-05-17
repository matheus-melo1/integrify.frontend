import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "@/app/layouts/RootLayout";
import { MainLayout } from "@/app/layouts/MainLayout";
import { AuthLayout } from "@/app/layouts/AuthLayout";
import { AuthGuard } from "./guards/AuthGuard";
import { ROUTES } from "./routes";
import { protectedRoutes, protectedRoutesAboutUsers } from "./protectedRoutes";

const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage"));
const NewIntegracaoPage = lazy(
  () => import("@/features/integracao/pages/NewIntegracaoPage"),
);
const EditIntegracaoPage = lazy(
  () => import("@/features/integracao/pages/EditIntegracaoPage"),
);
const NewProductPage = lazy(
  () => import("@/features/estoque/pages/NewProductPage"),
);
const EditProductPage = lazy(
  () => import("@/features/estoque/pages/EditProductPage"),
);

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Navigate to={ROUTES.LOGIN} replace /> },
      {
        element: <AuthLayout />,
        children: [
          { path: ROUTES.LOGIN, element: <LoginPage /> },
          { path: ROUTES.REGISTER, element: <RegisterPage /> },
        ],
      },
      {
        element: <AuthGuard />,
        children: [
          {
            element: <MainLayout />,
            children: [
              ...protectedRoutes.map(({ path, component: Component }) => ({
                path,
                element: <Component />,
              })),
              { path: ROUTES.INTEGRACAO_NEW, element: <NewIntegracaoPage /> },
              { path: ROUTES.INTEGRACAO_EDIT, element: <EditIntegracaoPage /> },
              { path: ROUTES.ESTOQUE_NEW, element: <NewProductPage /> },
              { path: ROUTES.ESTOQUE_EDIT, element: <EditProductPage /> },

              ...protectedRoutesAboutUsers.map(
                ({ path, component: Component }) => ({
                  path,
                  element: <Component />,
                }),
              ),
            ],
          },
        ],
      },
    ],
  },
]);
