import { useMemo, useState } from "react";
import type { Store } from "../types/store.types";

const STORES: Store[] = [
  {
    id: "1",
    name: "Pela Design",
    marketplace: "shoppe",
    followers: 3074,
    variation: 9.23,
    members: [
      { id: "a", name: "Ana" },
      { id: "b", name: "Bruno" },
      { id: "c", name: "Carla" },
      { id: "d", name: "Diego" },
    ],
  },
  {
    id: "2",
    name: "Elixir Ads",
    marketplace: "mercadolibre",
    followers: 2931,
    variation: 7.59,
    members: [
      { id: "e", name: "Eva" },
      { id: "f", name: "Felipe" },
      { id: "g", name: "Gustavo" },
    ],
  },
  {
    id: "3",
    name: "TechMag Store",
    marketplace: "amazon",
    followers: 1820,
    variation: -2.14,
    members: [
      { id: "h", name: "Helena" },
      { id: "i", name: "Igor" },
    ],
  },
  {
    id: "4",
    name: "Casa & Decor",
    marketplace: "mercadolibre",
    followers: 1240,
    variation: 4.31,
    members: [{ id: "j", name: "Júlia" }],
  },
  {
    id: "5",
    name: "FitWear",
    marketplace: "shoppe",
    followers: 998,
    variation: 12.04,
    members: [
      { id: "k", name: "Karen" },
      { id: "l", name: "Lucas" },
    ],
  },
];

const PAGE_SIZE = 2;

export const useTopStores = () => {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(STORES.length / PAGE_SIZE);

  const visible = useMemo(
    () => STORES.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [page],
  );

  return {
    stores: visible,
    page,
    totalPages,
    next: () => setPage((p) => Math.min(totalPages - 1, p + 1)),
    prev: () => setPage((p) => Math.max(0, p - 1)),
  };
};
