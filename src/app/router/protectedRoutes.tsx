import { lazy, type LazyExoticComponent, type ComponentType } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Plug,
  Package,
  type LucideIcon,
  Bot,
} from "lucide-react";
import { ROUTES } from "./routes";

export type ProtectedRoute = {
  path: string;
  name: string;
  icon: LucideIcon;
  component: LazyExoticComponent<ComponentType>;
};

const DashboardPage = lazy(
  () => import("@/features/dashboard/pages/DashboardPage"),
);
const VendasPage = lazy(() => import("@/features/vendas/pages/VendasPage"));
const IntegracaoPage = lazy(
  () => import("@/features/integracao/pages/IntegracaoPage"),
);
const EstoquePage = lazy(() => import("@/features/estoque/pages/EstoquePage"));
const IAPage = lazy(() => import("@/features/ai/pages/AIPage"));

export const protectedRoutes: ProtectedRoute[] = [
  {
    path: ROUTES.DASHBOARD,
    name: "Dashboard",
    icon: LayoutDashboard,
    component: DashboardPage,
  },
  {
    path: ROUTES.AI,
    name: "AI",
    icon: Bot,
    component: IAPage,
  },

  {
    path: ROUTES.VENDAS,
    name: "Vendas",
    icon: ShoppingCart,
    component: VendasPage,
  },
  {
    path: ROUTES.INTEGRACAO,
    name: "Integração",
    icon: Plug,
    component: IntegracaoPage,
  },
  {
    path: ROUTES.ESTOQUE,
    name: "Estoque",
    icon: Package,
    component: EstoquePage,
  },
];
