import { z } from "zod";

export const editProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Informe ao menos 2 caracteres")
    .max(80, "Máximo de 80 caracteres"),
  username: z
    .string()
    .min(3, "Informe ao menos 3 caracteres")
    .max(40, "Máximo de 40 caracteres")
    .regex(/^[a-zA-Z0-9._-]+$/, "Use letras, números, ponto, traço ou underline"),
  email: z.string().email("E-mail inválido"),
  phone: z
    .string()
    .min(14, "Telefone incompleto")
    .max(15, "Telefone inválido"),
  birthDate: z
    .string()
    .min(8, "Data inválida")
    .max(20, "Data inválida"),
  bio: z.string().max(280, "Máximo de 280 caracteres").optional(),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;
