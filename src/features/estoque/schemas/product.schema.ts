import { z } from "zod";

export const MARKETPLACE_OPTIONS = [
  { value: "mercado-livre", label: "Mercado Livre" },
  { value: "shopee", label: "Shopee" },
  { value: "amazon", label: "Amazon BR" },
  { value: "amazon-us", label: "Amazon US" },
  { value: "magalu", label: "Magalu" },
] as const;

export const STATUS_OPTIONS = [
  { value: "active", label: "Ativo" },
  { value: "low", label: "Estoque baixo" },
  { value: "out-of-stock", label: "Esgotado" },
  { value: "paused", label: "Pausado" },
] as const;

export const productSchema = z.object({
  name: z
    .string({ message: "Nome é obrigatório" })
    .min(3, "Mínimo 3 caracteres"),
  sku: z
    .string({ message: "SKU é obrigatório" })
    .min(3, "Mínimo 3 caracteres"),
  marketplace: z.enum(
    ["mercado-livre", "shopee", "amazon", "amazon-us", "magalu"],
    { message: "Selecione um marketplace" },
  ),
  status: z.enum(["active", "low", "out-of-stock", "paused"], {
    message: "Selecione um status",
  }),
  quantity: z
    .string({ message: "Quantidade é obrigatória" })
    .min(1, "Quantidade é obrigatória"),
  price: z
    .string({ message: "Preço é obrigatório" })
    .min(1, "Preço é obrigatório"),
  imageUrl: z
    .string()
    .url("URL inválida")
    .optional()
    .or(z.literal("")),
  description: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
