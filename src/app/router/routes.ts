export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  DASHBOARD: "/app/dashboard",
  VENDAS: "/app/vendas",
  AI: "/app/ai",
  INTEGRACAO: "/app/integracao",
  INTEGRACAO_NEW: "/app/integracao/nova",
  INTEGRACAO_EDIT: "/app/integracao/:id/editar",
  ESTOQUE: "/app/estoque",
  ESTOQUE_NEW: "/app/estoque/novo",
  ESTOQUE_EDIT: "/app/estoque/:id/editar",
  SETTINGS: "/app/settings",
  PROFILE: "/app/profile",
} as const;

export const buildEstoqueEditPath = (id: string) =>
  `/app/estoque/${id}/editar`;

export const buildIntegracaoEditPath = (id: string) =>
  `/app/integracao/${id}/editar`;
