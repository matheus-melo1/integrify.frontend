import type { Marketplace, Member } from "@/shared/types/marketplace.types";

export type { Marketplace, Member };

export type Store = {
  id: string;
  name: string;
  marketplace: Marketplace;
  followers: number;
  variation: number;
  members: Member[];
};
