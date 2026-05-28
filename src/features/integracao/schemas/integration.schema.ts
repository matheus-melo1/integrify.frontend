import { z } from "zod";

export const integrationSchema = z.object({
  marketplace: z.enum(
    ["amazon", "shoppe", "mercadolibre", "magalu"],
    { message: "Selecione um marketplace" },
  ),
  name: z
    .string({ message: "Apelido é obrigatório" })
    .min(2, "Mínimo 2 caracteres"),
  api_key: z
    .string({ message: "Chave de API é obrigatória" })
    .min(5, "Chave muito curta"),
  stock_sync: z.boolean(),
  order_sync: z.boolean(),
});

export type IntegrationFormData = z.infer<typeof integrationSchema>;
