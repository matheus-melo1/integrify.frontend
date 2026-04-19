export type Marketplace =
  | "mercado-livre"
  | "shopee"
  | "amazon"
  | "magalu"
  | "amazon-us";

export type Member = {
  id: string;
  name: string;
  avatarUrl?: string;
};
