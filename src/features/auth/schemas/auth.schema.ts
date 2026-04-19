import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z
    .string({ message: "Senha é obrigatória" })
    .min(3, "Senha muito curta"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string({ message: "Nome é obrigatório" }).min(3, "Nome muito curto"),
  email: z.string({ message: "Email é obrigatório" }).email("Email inválido"),
  password: z
    .string({ message: "Senha é obrigatória" })
    .min(3, "Senha muito curta"),
  confirmPassword: z
    .string({ message: "Confirme a senha é obrigatória" })
    .min(3, "Confirme a senha muito curta"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
