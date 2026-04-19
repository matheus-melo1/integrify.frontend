import type { Marketplace, Member } from "@/shared/types/marketplace.types";
import type { AdStatus } from "@/shared/components/molecules/StatusBadge/StatusBadge";

export type { AdStatus };

export type Ad = {
  id: string;
  rank: number;
  name: string;
  seller: Member;
  addedAt: string;
  marketplace: Marketplace;
  followers: Member[];
  status: AdStatus;
};
