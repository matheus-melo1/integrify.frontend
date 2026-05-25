import { lazy, type LazyExoticComponent, type ComponentType } from "react";
import { Plug, type LucideIcon, UserRound, Tag } from "lucide-react";
import { TbSmartHome } from "react-icons/tb";
import { RiChatVoiceAiLine } from "react-icons/ri";
import { VscSettings } from "react-icons/vsc";
import { RiBox3Line } from "react-icons/ri";
import { ROUTES } from "./routes";
import type { IconType } from "react-icons/lib";
import { MdNotificationsNone } from "react-icons/md";

export type ProtectedRoute = {
  path: string;
  name: string;
  icon: LucideIcon | IconType;
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
const ProfilePage = lazy(
  () => import("@/features/profile/pages/ProfilePage"),
);

export const protectedRoutes: ProtectedRoute[] = [
  {
    path: ROUTES.DASHBOARD,
    name: "Dashboard",
    icon: TbSmartHome,
    component: DashboardPage,
  },
  {
    path: ROUTES.AI,
    name: "AI",
    icon: RiChatVoiceAiLine,
    component: IAPage,
  },

  {
    path: ROUTES.VENDAS,
    name: "Vendas",
    icon: Tag,
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
    icon: RiBox3Line,
    component: EstoquePage,
  },
];

export const protectedRoutesAboutUsers: ProtectedRoute[] = [
  {
    path: ROUTES.PROFILE,
    name: "Perfil",
    icon: UserRound,
    component: ProfilePage,
  },
  {
    path: ROUTES.SETTINGS,
    name: "Configurações",
    icon: VscSettings,
    component: EstoquePage,
  },
  {
    path: "/app/notificacoes",
    name: "Notificações",
    icon: MdNotificationsNone,
    component: EstoquePage,
  },
];
