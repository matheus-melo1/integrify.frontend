import { useMemo } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import type { Profile } from "../types/profile.types";

const MOCK_WORKS: Profile["works"] = [
  {
    id: "w-001",
    sku: "SKU-10293",
    name: "Cafeteira Elétrica 110V Inox",
    marketplace: "mercadolibre",
    imageUrl: "https://picsum.photos/seed/coffee-machine/600/450",
    price: 289.9,
    likes: 517,
    views: 9300,
  },
  {
    id: "w-002",
    sku: "SKU-22184",
    name: "Headphone Bluetooth com Cancelamento",
    marketplace: "shoppe",
    imageUrl: "https://picsum.photos/seed/headphone-pro/600/450",
    price: 459.0,
    likes: 983,
    views: 14000,
  },
  {
    id: "w-003",
    sku: "SKU-44910",
    name: "Smartwatch Esportivo À Prova D'água",
    marketplace: "amazon",
    imageUrl: "https://picsum.photos/seed/smartwatch/600/450",
    price: 699.9,
    likes: 875,
    views: 13500,
  },
  {
    id: "w-004",
    sku: "SKU-77120",
    name: "Mochila Antifurto USB",
    marketplace: "mercadolibre",
    imageUrl: "https://picsum.photos/seed/backpack/600/450",
    price: 219.0,
    likes: 312,
    views: 5400,
  },
  {
    id: "w-005",
    sku: "SKU-90011",
    name: "Luminária LED Mesa Touch",
    marketplace: "mercadolibre",
    imageUrl: "https://picsum.photos/seed/led-lamp/600/450",
    price: 149.9,
    likes: 421,
    views: 7800,
  },
  {
    id: "w-006",
    sku: "SKU-30574",
    name: "Câmera de Segurança Wi-Fi",
    marketplace: "amazon",
    imageUrl: "https://picsum.photos/seed/security-camera/600/450",
    price: 359.0,
    likes: 268,
    views: 4900,
  },
];

export const useProfileData = (): Profile => {
  const user = useAuthStore((s) => s.user);

  return useMemo<Profile>(() => {
    const name = user?.name?.trim() || "Mock User";
    const email = user?.email || "mockuser@example.com";
    const role = user?.role || "admin";
    const username = email.split("@")[0];

    return {
      id: user?.id ?? "mock-1",
      name,
      email,
      role,
      username,
      avatarUrl:
        "https://img.icons8.com/liquid-glass/96/user-male-circle.png",
      headline: "Operador de marketplaces",
      location: "São Paulo, BR",
      bio: "Cuido das integrações e do estoque das nossas lojas em diferentes marketplaces.",
      plan: "pro",
      phone: "(11) 98765-4321",
      birthDate: "23/08/1995",
      emailVerified: true,
      stats: {
        followers: 2985,
        following: 132,
        likes: 548,
      },
      achievements: [
        { id: "a-1", count: 26, label: "Vendas top", accent: "orange" },
        { id: "a-2", count: 6, label: "Integrações", accent: "violet" },
        { id: "a-3", count: 12, label: "Conquistas", accent: "dark" },
      ],
      works: MOCK_WORKS,
    };
  }, [user?.id, user?.name, user?.email, user?.role]);
};
