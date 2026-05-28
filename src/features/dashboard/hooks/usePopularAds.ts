import { useMemo } from "react";
import type { Ad } from "../types/ad.types";

const ADS: Ad[] = [
  {
    id: "1",
    rank: 1,
    name: "Fone Bluetooth Pro",
    seller: { id: "s1", name: "Samuel" },
    addedAt: "14/02/2024",
    marketplace: "mercadolibre",
    followers: [
      { id: "f1", name: "A" },
      { id: "f2", name: "B" },
      { id: "f3", name: "C" },
    ],
    status: "active",
  },
  {
    id: "2",
    rank: 2,
    name: "Cadeira Gamer X",
    seller: { id: "s2", name: "Hossein" },
    addedAt: "09/23/2025",
    marketplace: "shoppe",
    followers: [
      { id: "f4", name: "D" },
      { id: "f5", name: "E" },
    ],
    status: "active",
  },
  {
    id: "3",
    rank: 3,
    name: "Camera 4K Mini",
    seller: { id: "s3", name: "Maria" },
    addedAt: "04/05/2025",
    marketplace: "amazon",
    followers: [
      { id: "f6", name: "F" },
      { id: "f7", name: "G" },
      { id: "f8", name: "H" },
      { id: "f9", name: "I" },
    ],
    status: "pending",
  },
  {
    id: "4",
    rank: 4,
    name: "Air Fryer 5L",
    seller: { id: "s4", name: "Stephanie" },
    addedAt: "11/18/2025",
    marketplace: "mercadolibre",
    followers: [
      { id: "f10", name: "J" },
      { id: "f11", name: "K" },
    ],
    status: "active",
  },
  {
    id: "5",
    rank: 5,
    name: "Smartwatch Plus",
    seller: { id: "s5", name: "Renato" },
    addedAt: "02/03/2026",
    marketplace: "amazon",
    followers: [
      { id: "f12", name: "L" },
      { id: "f13", name: "M" },
    ],
    status: "paused",
  },
];

export const usePopularAds = () => {
  const ads = useMemo(() => ADS, []);
  return { ads };
};
