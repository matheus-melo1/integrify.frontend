import { z } from "zod";

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
  status: z.enum(["active", "low", "out-of-stock", "paused"], {
    message: "Selecione um status",
  }),
  stock: z
    .string({ message: "Quantidade é obrigatória" })
    .min(1, "Quantidade é obrigatória"),
  price: z
    .string({ message: "Preço é obrigatório" })
    .min(1, "Preço é obrigatório"),
  image: z
    .string()
    .url("URL inválida")
    .optional()
    .or(z.literal("")),
  description: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
