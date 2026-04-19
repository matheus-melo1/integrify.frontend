import { z } from "zod";

export const integrationSchema = z.object({
  marketplace: z.enum(
    ["mercado-livre", "shopee", "amazon", "amazon-us", "magalu"],
    { message: "Selecione um marketplace" },
  ),
  name: z
    .string({ message: "Apelido é obrigatório" })
    .min(2, "Mínimo 2 caracteres"),
  apiKey: z
    .string({ message: "Chave de API é obrigatória" })
    .min(5, "Chave muito curta"),
  syncStock: z.boolean(),
  syncOrders: z.boolean(),
});

export type IntegrationFormData = z.infer<typeof integrationSchema>;
