import { useNavigate } from "react-router-dom";
import { UserRound, Palette, Gift, LogOut, type LucideIcon } from "lucide-react";

export type SidebarUserMenuItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
  onSelect: () => void;
};

export const useSidebarUserMenu = () => {
  const navigate = useNavigate();

  const items: SidebarUserMenuItem[] = [
    {
      id: "account",
      label: "Conta",
      icon: UserRound,
      onSelect: () => navigate("/perfil"),
    },
    {
      id: "appearance",
      label: "Aparência",
      icon: Palette,
      onSelect: () => {},
    },
    {
      id: "invite",
      label: "Indique e Ganhe",
      icon: Gift,
      active: true,
      onSelect: () => {},
    },
    {
      id: "logout",
      label: "Sair",
      icon: LogOut,
      onSelect: () => navigate("/"),
    },
  ];

  return { items };
};
