# Integração frontend do módulo Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o mock de `features/integracao` por CRUD real contra o endpoint `/integration` do backend Go, com cobertura de testes TDD.

**Architecture:** Camadas separadas — `services/` (axios + envelope unwrap + classe singleton), `services/*.queries.ts` (TanStack Query + sonner toasts), `hooks/` (form controllers que ligam tudo nas páginas). UI reaproveita o `NewIntegrationForm` para edit via componente presentacional extraído.

**Tech Stack:** React 19, TypeScript, TanStack React Query, sonner, React Hook Form + Zod, axios, Vitest + RTL, Tailwind, shadcn/ui.

**Spec:** `docs/superpowers/specs/2026-05-17-integracao-backend-design.md`

---

## File Structure

### Criados
- `src/features/integracao/services/integration.service.ts`
- `src/features/integracao/services/integration.queries.ts`
- `src/features/integracao/services/__tests__/integration.service.test.ts`
- `src/features/integracao/services/__tests__/integration.queries.test.ts`
- `src/features/integracao/hooks/useEditIntegration.ts`
- `src/features/integracao/hooks/useDeleteIntegration.ts`
- `src/features/integracao/hooks/__tests__/useIntegrations.test.tsx`
- `src/features/integracao/hooks/__tests__/useNewIntegration.test.tsx`
- `src/features/integracao/hooks/__tests__/useEditIntegration.test.tsx`
- `src/features/integracao/schemas/__tests__/integration.schema.test.ts`
- `src/features/integracao/components/molecules/__tests__/IntegrationCard.test.tsx`
- `src/features/integracao/components/organisms/IntegrationFormView.tsx` (extração presentacional)
- `src/features/integracao/pages/EditIntegracaoPage.tsx`

### Modificados
- `src/shared/types/marketplace.types.ts` (+ `magalu`)
- `src/shared/components/molecules/MarketplaceLogo/MarketplaceLogo.tsx` (+ entrada `magalu`)
- `src/features/integracao/types/integration.types.ts` (snake_case + `IntegrationRequest`)
- `src/features/integracao/schemas/integration.schema.ts` (snake_case + `magalu`)
- `src/features/integracao/hooks/useIntegrations.ts` (usa query)
- `src/features/integracao/hooks/useNewIntegration.ts` (usa mutation, snake_case)
- `src/features/integracao/components/organisms/NewIntegrationForm.tsx` (vira wrapper fino sobre `IntegrationFormView`)
- `src/features/integracao/components/molecules/IntegrationCard.tsx` (remove campos mock, adiciona dropdown + AlertDialog + máscara `api_key`)
- `src/features/integracao/components/organisms/IntegrationsGrid.tsx` (loading skeleton + estado vazio)
- `src/features/integracao/pages/IntegracaoPage.tsx` (passa `isLoading`)
- `src/features/integracao/index.ts` (exporta `EditIntegracaoPage`)
- `src/app/router/routes.ts` (`INTEGRACAO_EDIT` + helper)
- `src/app/router/index.tsx` (rota lazy)
- `src/app/providers/AppProviders.tsx` (`<Toaster />` da sonner)

---

## Task 1 — Adicionar marketplace `magalu` ao shared

**Files:**
- Modify: `src/shared/types/marketplace.types.ts`
- Modify: `src/shared/components/molecules/MarketplaceLogo/MarketplaceLogo.tsx`

- [ ] **Step 1: Atualizar o tipo `Marketplace`**

`src/shared/types/marketplace.types.ts`:

```ts
export type Marketplace = "amazon" | "shoppe" | "mercadolibre" | "magalu";
```

- [ ] **Step 2: Adicionar entrada `magalu` no MAP do MarketplaceLogo**

`src/shared/components/molecules/MarketplaceLogo/MarketplaceLogo.tsx` — dentro do `MAP`, depois da entrada `amazon`:

```ts
magalu: {
  label: "Magalu",
  initials: "MG",
  logoClass: "bg-sky-500 text-white",
},
```

- [ ] **Step 3: Verificar typecheck**

Run: `npx tsc -b --noEmit`
Expected: nenhum erro (todos os usos de `Marketplace` continuam exhaustivos via Record).

- [ ] **Step 4: Commit**

```bash
git add src/shared/types/marketplace.types.ts src/shared/components/molecules/MarketplaceLogo/MarketplaceLogo.tsx
git commit -m "feat(shared): adiciona marketplace magalu"
```

---

## Task 2 — Reescrever `integration.types.ts` em snake_case

**Files:**
- Modify: `src/features/integracao/types/integration.types.ts`

- [ ] **Step 1: Substituir o conteúdo do arquivo**

`src/features/integracao/types/integration.types.ts`:

```ts
import type { Marketplace } from "@/shared/types/marketplace.types";

export type IntegrationStatus =
  | "connected"
  | "syncing"
  | "error"
  | "disconnected";

export type Integration = {
  id: string;
  name: string;
  api_key: string;
  marketplace: Marketplace;
  status: IntegrationStatus;
  stock_sync: boolean;
  order_sync: boolean;
};

export type IntegrationRequest = {
  name: string;
  api_key: string;
  marketplace: Marketplace;
  status?: IntegrationStatus;
  stock_sync?: boolean;
  order_sync?: boolean;
};

export type MarketplaceOption = {
  marketplace: Marketplace;
  description: string;
};
```

- [ ] **Step 2: Verificar typecheck (vai quebrar)**

Run: `npx tsc -b --noEmit`
Expected: erros em `useIntegrations.ts`, `useNewIntegration.ts`, `IntegrationCard.tsx`, `NewIntegrationForm.tsx`, `schema` — todos esperados, serão consertados nas tasks seguintes.

- [ ] **Step 3: Commit (parcial, deixa pendência típica de migração tipada)**

```bash
git add src/features/integracao/types/integration.types.ts
git commit -m "refactor(integracao): aliena Integration types ao wire snake_case do backend"
```

---

## Task 3 — Reescrever schema Zod em snake_case + adicionar magalu

**Files:**
- Modify: `src/features/integracao/schemas/integration.schema.ts`
- Create: `src/features/integracao/schemas/__tests__/integration.schema.test.ts`

- [ ] **Step 1: Escrever testes do schema (RED)**

`src/features/integracao/schemas/__tests__/integration.schema.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { integrationSchema } from "../integration.schema";

const valid = {
  marketplace: "mercadolibre" as const,
  name: "Loja teste",
  api_key: "abc12345",
  stock_sync: true,
  order_sync: false,
};

describe("integrationSchema", () => {
  it("aceita payload snake_case válido", () => {
    expect(() => integrationSchema.parse(valid)).not.toThrow();
  });

  it("aceita marketplace magalu", () => {
    expect(() =>
      integrationSchema.parse({ ...valid, marketplace: "magalu" }),
    ).not.toThrow();
  });

  it("rejeita marketplace fora do enum", () => {
    expect(() =>
      integrationSchema.parse({ ...valid, marketplace: "ebay" }),
    ).toThrow();
  });

  it("rejeita api_key curto", () => {
    expect(() =>
      integrationSchema.parse({ ...valid, api_key: "abc" }),
    ).toThrow();
  });

  it("rejeita name curto", () => {
    expect(() =>
      integrationSchema.parse({ ...valid, name: "x" }),
    ).toThrow();
  });
});
```

- [ ] **Step 2: Rodar testes — devem falhar (schema ainda em camelCase)**

Run: `npx vitest run src/features/integracao/schemas/__tests__/integration.schema.test.ts`
Expected: FAIL — campos `api_key`/`stock_sync`/`order_sync` não existem; magalu rejeitado.

- [ ] **Step 3: Atualizar o schema (GREEN)**

`src/features/integracao/schemas/integration.schema.ts`:

```ts
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
```

- [ ] **Step 4: Rodar testes — devem passar**

Run: `npx vitest run src/features/integracao/schemas/__tests__/integration.schema.test.ts`
Expected: PASS (5/5).

- [ ] **Step 5: Commit**

```bash
git add src/features/integracao/schemas/integration.schema.ts src/features/integracao/schemas/__tests__/integration.schema.test.ts
git commit -m "refactor(integracao): schema em snake_case com magalu + testes"
```

---

## Task 4 — Integration service (TDD)

**Files:**
- Create: `src/features/integracao/services/integration.service.ts`
- Create: `src/features/integracao/services/__tests__/integration.service.test.ts`

- [ ] **Step 1: Escrever testes do service (RED)**

`src/features/integracao/services/__tests__/integration.service.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { api } from "@/shared/lib/axios";
import { integrationService } from "../integration.service";
import type { Integration } from "../../types/integration.types";

vi.mock("@/shared/lib/axios", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const mocked = api as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

const integration: Integration = {
  id: "abc",
  name: "Loja",
  api_key: "key12345",
  marketplace: "mercadolibre",
  status: "connected",
  stock_sync: true,
  order_sync: false,
};

const ok = <T>(data: T) => ({
  data: { success: true, status: 200, data },
});
const fail = (error = "boom") => ({
  data: { success: false, status: 500, data: null, error },
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("integrationService.list", () => {
  it("desempacota envelope e devolve array", async () => {
    mocked.get.mockResolvedValueOnce(ok([integration]));
    await expect(integrationService.list()).resolves.toEqual([integration]);
    expect(mocked.get).toHaveBeenCalledWith("/integration");
  });

  it("devolve [] quando data é null", async () => {
    mocked.get.mockResolvedValueOnce(ok(null));
    await expect(integrationService.list()).resolves.toEqual([]);
  });

  it("lança Error com envelope.error quando success=false", async () => {
    mocked.get.mockResolvedValueOnce(fail("falhou"));
    await expect(integrationService.list()).rejects.toThrow("falhou");
  });
});

describe("integrationService.getById", () => {
  it("desempacota e devolve registro", async () => {
    mocked.get.mockResolvedValueOnce(ok(integration));
    await expect(integrationService.getById("abc")).resolves.toEqual(integration);
    expect(mocked.get).toHaveBeenCalledWith("/integration/abc");
  });

  it("lança quando success=false", async () => {
    mocked.get.mockResolvedValueOnce(fail());
    await expect(integrationService.getById("abc")).rejects.toThrow("boom");
  });
});

describe("integrationService.create", () => {
  it("posta no /integration e desempacota", async () => {
    mocked.post.mockResolvedValueOnce(ok(integration));
    const body = {
      name: "Loja",
      api_key: "key12345",
      marketplace: "mercadolibre" as const,
    };
    await expect(integrationService.create(body)).resolves.toEqual(integration);
    expect(mocked.post).toHaveBeenCalledWith("/integration", body);
  });

  it("lança quando success=false", async () => {
    mocked.post.mockResolvedValueOnce(fail("invalido"));
    await expect(
      integrationService.create({
        name: "x",
        api_key: "y",
        marketplace: "mercadolibre",
      }),
    ).rejects.toThrow("invalido");
  });
});

describe("integrationService.update", () => {
  it("PUT no /integration/:id e devolve void", async () => {
    mocked.put.mockResolvedValueOnce(ok(null));
    await expect(
      integrationService.update("abc", {
        name: "Loja",
        api_key: "key12345",
        marketplace: "mercadolibre",
      }),
    ).resolves.toBeUndefined();
    expect(mocked.put).toHaveBeenCalledWith(
      "/integration/abc",
      expect.objectContaining({ name: "Loja" }),
    );
  });

  it("lança quando success=false", async () => {
    mocked.put.mockResolvedValueOnce(fail());
    await expect(
      integrationService.update("abc", {
        name: "Loja",
        api_key: "k",
        marketplace: "mercadolibre",
      }),
    ).rejects.toThrow("boom");
  });
});

describe("integrationService.remove", () => {
  it("DELETE no /integration/:id e devolve void", async () => {
    mocked.delete.mockResolvedValueOnce(ok(null));
    await expect(integrationService.remove("abc")).resolves.toBeUndefined();
    expect(mocked.delete).toHaveBeenCalledWith("/integration/abc");
  });

  it("lança quando success=false", async () => {
    mocked.delete.mockResolvedValueOnce(fail("denied"));
    await expect(integrationService.remove("abc")).rejects.toThrow("denied");
  });
});
```

- [ ] **Step 2: Rodar testes — devem falhar (service não existe)**

Run: `npx vitest run src/features/integracao/services/__tests__/integration.service.test.ts`
Expected: FAIL — cannot find module `../integration.service`.

- [ ] **Step 3: Implementar o service (GREEN)**

`src/features/integracao/services/integration.service.ts`:

```ts
import { api } from "@/shared/lib/axios";
import type { ApiResponse } from "@/shared/types/api.types";
import type { Integration, IntegrationRequest } from "../types/integration.types";

interface IIntegrationService {
  list(): Promise<Integration[]>;
  getById(id: string): Promise<Integration>;
  create(body: IntegrationRequest): Promise<Integration>;
  update(id: string, body: IntegrationRequest): Promise<void>;
  remove(id: string): Promise<void>;
}

const unwrap = <T>(envelope: ApiResponse<T>): T => {
  if (!envelope.success) {
    throw new Error(envelope.error ?? "Erro desconhecido");
  }
  return envelope.data;
};

class IntegrationService implements IIntegrationService {
  list() {
    return api
      .get<ApiResponse<Integration[] | null>>("/integration")
      .then((r) => unwrap(r.data) ?? []);
  }

  getById(id: string) {
    return api
      .get<ApiResponse<Integration>>(`/integration/${id}`)
      .then((r) => unwrap(r.data));
  }

  create(body: IntegrationRequest) {
    return api
      .post<ApiResponse<Integration>>("/integration", body)
      .then((r) => unwrap(r.data));
  }

  update(id: string, body: IntegrationRequest) {
    return api
      .put<ApiResponse<null>>(`/integration/${id}`, body)
      .then((r) => {
        unwrap(r.data);
      });
  }

  remove(id: string) {
    return api
      .delete<ApiResponse<null>>(`/integration/${id}`)
      .then((r) => {
        unwrap(r.data);
      });
  }
}

export const integrationService = new IntegrationService();
```

- [ ] **Step 4: Rodar testes — devem passar**

Run: `npx vitest run src/features/integracao/services/__tests__/integration.service.test.ts`
Expected: PASS (11/11).

- [ ] **Step 5: Commit**

```bash
git add src/features/integracao/services/integration.service.ts src/features/integracao/services/__tests__/integration.service.test.ts
git commit -m "feat(integracao): integrationService com unwrap de envelope + testes"
```

---

## Task 5 — Integration queries (TanStack + sonner) (TDD)

**Files:**
- Create: `src/features/integracao/services/integration.queries.ts`
- Create: `src/features/integracao/services/__tests__/integration.queries.test.ts`

- [ ] **Step 1: Escrever testes das queries (RED)**

`src/features/integracao/services/__tests__/integration.queries.test.ts`:

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { integrationService } from "../integration.service";
import {
  integrationKeys,
  useCreateIntegrationMutation,
  useUpdateIntegrationMutation,
  useDeleteIntegrationMutation,
} from "../integration.queries";

vi.mock("../integration.service", () => ({
  integrationService: {
    list: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mockedService = integrationService as unknown as {
  create: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  remove: ReturnType<typeof vi.fn>;
};

const createWrapper = () => {
  const qc = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  const invalidateSpy = vi.spyOn(qc, "invalidateQueries");
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
  return { wrapper, invalidateSpy };
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useCreateIntegrationMutation", () => {
  it("invalida lista e dispara toast.success no sucesso", async () => {
    mockedService.create.mockResolvedValueOnce({ id: "1" });
    const { wrapper, invalidateSpy } = createWrapper();
    const { result } = renderHook(() => useCreateIntegrationMutation(), { wrapper });

    result.current.mutate({
      name: "Loja",
      api_key: "key12345",
      marketplace: "mercadolibre",
    });

    await waitFor(() => expect(mockedService.create).toHaveBeenCalled());
    await waitFor(() =>
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: integrationKeys.all,
      }),
    );
    expect(toast.success).toHaveBeenCalledWith("Integração criada");
  });

  it("dispara toast.error com a mensagem no erro", async () => {
    mockedService.create.mockRejectedValueOnce(new Error("falhou"));
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useCreateIntegrationMutation(), { wrapper });

    result.current.mutate({
      name: "Loja",
      api_key: "key12345",
      marketplace: "mercadolibre",
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("falhou"));
  });
});

describe("useUpdateIntegrationMutation", () => {
  it("invalida lista + detail no sucesso", async () => {
    mockedService.update.mockResolvedValueOnce(undefined);
    const { wrapper, invalidateSpy } = createWrapper();
    const { result } = renderHook(() => useUpdateIntegrationMutation("abc"), {
      wrapper,
    });

    result.current.mutate({
      name: "Loja",
      api_key: "key12345",
      marketplace: "mercadolibre",
    });

    await waitFor(() => expect(mockedService.update).toHaveBeenCalled());
    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: integrationKeys.all });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: integrationKeys.detail("abc"),
      });
    });
    expect(toast.success).toHaveBeenCalledWith("Integração atualizada");
  });
});

describe("useDeleteIntegrationMutation", () => {
  it("invalida lista no sucesso", async () => {
    mockedService.remove.mockResolvedValueOnce(undefined);
    const { wrapper, invalidateSpy } = createWrapper();
    const { result } = renderHook(() => useDeleteIntegrationMutation(), { wrapper });

    result.current.mutate("abc");

    await waitFor(() => expect(mockedService.remove).toHaveBeenCalledWith("abc"));
    await waitFor(() =>
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: integrationKeys.all }),
    );
    expect(toast.success).toHaveBeenCalledWith("Integração removida");
  });
});
```

- [ ] **Step 2: Rodar testes — devem falhar**

Run: `npx vitest run src/features/integracao/services/__tests__/integration.queries.test.ts`
Expected: FAIL — `integration.queries` não existe.

- [ ] **Step 3: Implementar queries (GREEN)**

`src/features/integracao/services/integration.queries.ts`:

```ts
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { integrationService } from "./integration.service";
import type { IntegrationRequest } from "../types/integration.types";

export const integrationKeys = {
  all: ["integrations"] as const,
  detail: (id: string) => ["integrations", id] as const,
};

const errorMessage = (e: unknown) =>
  e instanceof Error ? e.message : "Algo deu errado";

export const useIntegrationsQuery = () =>
  useQuery({
    queryKey: integrationKeys.all,
    queryFn: () => integrationService.list(),
  });

export const useIntegrationQuery = (id: string | undefined) =>
  useQuery({
    queryKey: integrationKeys.detail(id ?? ""),
    queryFn: () => integrationService.getById(id!),
    enabled: !!id,
  });

export const useCreateIntegrationMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: IntegrationRequest) => integrationService.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: integrationKeys.all });
      toast.success("Integração criada");
    },
    onError: (e) => toast.error(errorMessage(e)),
  });
};

export const useUpdateIntegrationMutation = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: IntegrationRequest) => integrationService.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: integrationKeys.all });
      qc.invalidateQueries({ queryKey: integrationKeys.detail(id) });
      toast.success("Integração atualizada");
    },
    onError: (e) => toast.error(errorMessage(e)),
  });
};

export const useDeleteIntegrationMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => integrationService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: integrationKeys.all });
      toast.success("Integração removida");
    },
    onError: (e) => toast.error(errorMessage(e)),
  });
};
```

- [ ] **Step 4: Rodar testes — devem passar**

Run: `npx vitest run src/features/integracao/services/__tests__/integration.queries.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/integracao/services/integration.queries.ts src/features/integracao/services/__tests__/integration.queries.test.ts
git commit -m "feat(integracao): queries TanStack com toasts + invalidação + testes"
```

---

## Task 6 — Montar `<Toaster />` em AppProviders

**Files:**
- Modify: `src/app/providers/AppProviders.tsx`

- [ ] **Step 1: Adicionar import + render do Toaster**

`src/app/providers/AppProviders.tsx`:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/shared/components/theme-provider";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { Toaster } from "@/shared/components/ui/sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        {children}
        <Toaster richColors position="top-right" />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc -b --noEmit`
Expected: sem novos erros.

- [ ] **Step 3: Commit**

```bash
git add src/app/providers/AppProviders.tsx
git commit -m "feat(app): monta Toaster sonner em AppProviders"
```

---

## Task 7 — Refatorar `useIntegrations` para usar query (TDD)

**Files:**
- Modify: `src/features/integracao/hooks/useIntegrations.ts`
- Create: `src/features/integracao/hooks/__tests__/useIntegrations.test.tsx`

- [ ] **Step 1: Escrever testes do hook (RED)**

`src/features/integracao/hooks/__tests__/useIntegrations.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useIntegrations } from "../useIntegrations";
import { integrationService } from "../../services/integration.service";
import type { Integration } from "../../types/integration.types";

vi.mock("../../services/integration.service", () => ({
  integrationService: { list: vi.fn() },
}));

const mocked = integrationService as unknown as {
  list: ReturnType<typeof vi.fn>;
};

const base: Omit<Integration, "id" | "status"> = {
  name: "x",
  api_key: "k",
  marketplace: "mercadolibre",
  stock_sync: true,
  order_sync: false,
};

const data: Integration[] = [
  { ...base, id: "1", status: "connected" },
  { ...base, id: "2", status: "syncing" },
  { ...base, id: "3", status: "error" },
  { ...base, id: "4", status: "disconnected" },
  { ...base, id: "5", status: "connected" },
];

const wrapper = ({ children }: { children: ReactNode }) => {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
};

beforeEach(() => vi.clearAllMocks());

describe("useIntegrations", () => {
  it("inicia com integrations vazio e isLoading=true", () => {
    mocked.list.mockReturnValueOnce(new Promise(() => {}));
    const { result } = renderHook(() => useIntegrations(), { wrapper });
    expect(result.current.integrations).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });

  it("calcula stats corretamente", async () => {
    mocked.list.mockResolvedValueOnce(data);
    const { result } = renderHook(() => useIntegrations(), { wrapper });
    await waitFor(() => expect(result.current.integrations).toHaveLength(5));
    expect(result.current.stats).toEqual({
      total: 5,
      connected: 2,
      issues: 2, // error + disconnected
    });
  });
});
```

- [ ] **Step 2: Rodar testes — devem falhar (hook ainda usa MOCK)**

Run: `npx vitest run src/features/integracao/hooks/__tests__/useIntegrations.test.tsx`
Expected: FAIL — `integrations` retorna o MOCK fixo em vez do mock do serviço.

- [ ] **Step 3: Reescrever o hook (GREEN)**

`src/features/integracao/hooks/useIntegrations.ts`:

```ts
import { useMemo } from "react";
import { useIntegrationsQuery } from "../services/integration.queries";

export const useIntegrations = () => {
  const { data, isLoading, isError, refetch } = useIntegrationsQuery();
  const integrations = data ?? [];

  const stats = useMemo(
    () => ({
      total: integrations.length,
      connected: integrations.filter((i) => i.status === "connected").length,
      issues: integrations.filter(
        (i) => i.status === "error" || i.status === "disconnected",
      ).length,
    }),
    [integrations],
  );

  return { integrations, stats, isLoading, isError, refetch };
};
```

- [ ] **Step 4: Rodar testes — devem passar**

Run: `npx vitest run src/features/integracao/hooks/__tests__/useIntegrations.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/integracao/hooks/useIntegrations.ts src/features/integracao/hooks/__tests__/useIntegrations.test.tsx
git commit -m "refactor(integracao): useIntegrations consome useIntegrationsQuery"
```

---

## Task 8 — Refatorar `useNewIntegration` para usar mutation (TDD)

**Files:**
- Modify: `src/features/integracao/hooks/useNewIntegration.ts`
- Create: `src/features/integracao/hooks/__tests__/useNewIntegration.test.tsx`

- [ ] **Step 1: Escrever testes do hook (RED)**

`src/features/integracao/hooks/__tests__/useNewIntegration.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";
import { useNewIntegration } from "../useNewIntegration";
import { integrationService } from "../../services/integration.service";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );
  return { ...actual, useNavigate: () => navigateMock };
});

vi.mock("../../services/integration.service", () => ({
  integrationService: { create: vi.fn() },
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mocked = integrationService as unknown as {
  create: ReturnType<typeof vi.fn>;
};

const wrapper = ({ children }: { children: ReactNode }) => {
  const qc = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  return (
    <QueryClientProvider client={qc}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};

const validValues = {
  marketplace: "mercadolibre" as const,
  name: "Loja teste",
  api_key: "key12345",
  stock_sync: true,
  order_sync: true,
};

beforeEach(() => {
  navigateMock.mockReset();
  vi.clearAllMocks();
});

describe("useNewIntegration", () => {
  it("submit válido chama create e navega para /app/integracao", async () => {
    mocked.create.mockResolvedValueOnce({ id: "1", ...validValues, status: "connected" });

    const { result } = renderHook(() => useNewIntegration(), { wrapper });

    act(() => {
      result.current.setValue("marketplace", validValues.marketplace, { shouldValidate: true });
      result.current.setValue("name", validValues.name, { shouldValidate: true });
      result.current.setValue("api_key", validValues.api_key, { shouldValidate: true });
      result.current.setValue("stock_sync", true);
      result.current.setValue("order_sync", true);
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    await waitFor(() => expect(mocked.create).toHaveBeenCalledWith(validValues));
    expect(navigateMock).toHaveBeenCalledWith("/app/integracao");
  });

  it("chama options.onSuccess com o integration criado se fornecido", async () => {
    const created = { id: "1", ...validValues, status: "connected" as const };
    mocked.create.mockResolvedValueOnce(created);
    const onSuccess = vi.fn();

    const { result } = renderHook(() => useNewIntegration({ onSuccess }), { wrapper });

    act(() => {
      result.current.setValue("marketplace", validValues.marketplace, { shouldValidate: true });
      result.current.setValue("name", validValues.name, { shouldValidate: true });
      result.current.setValue("api_key", validValues.api_key, { shouldValidate: true });
      result.current.setValue("stock_sync", true);
      result.current.setValue("order_sync", true);
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(created));
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("não navega em caso de falha", async () => {
    mocked.create.mockRejectedValueOnce(new Error("falhou"));

    const { result } = renderHook(() => useNewIntegration(), { wrapper });

    act(() => {
      result.current.setValue("marketplace", validValues.marketplace, { shouldValidate: true });
      result.current.setValue("name", validValues.name, { shouldValidate: true });
      result.current.setValue("api_key", validValues.api_key, { shouldValidate: true });
      result.current.setValue("stock_sync", true);
      result.current.setValue("order_sync", true);
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    await waitFor(() => expect(mocked.create).toHaveBeenCalled());
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Rodar testes — devem falhar**

Run: `npx vitest run src/features/integracao/hooks/__tests__/useNewIntegration.test.tsx`
Expected: FAIL — hook atual nem chama service, só console.log.

- [ ] **Step 3: Reescrever o hook (GREEN)**

`src/features/integracao/hooks/useNewIntegration.ts`:

```ts
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/router/routes";
import { to } from "@/shared/lib/to";
import {
  integrationSchema,
  type IntegrationFormData,
} from "../schemas/integration.schema";
import type {
  Integration,
  MarketplaceOption,
} from "../types/integration.types";
import { useCreateIntegrationMutation } from "../services/integration.queries";

const OPTIONS: MarketplaceOption[] = [
  {
    marketplace: "mercadolibre",
    description: "Conecte sua conta do Mercado Livre via OAuth.",
  },
  {
    marketplace: "shoppe",
    description: "Sincronize anúncios e pedidos da sua loja Shopee.",
  },
  { marketplace: "amazon", description: "Vendor Central · Brasil." },
  {
    marketplace: "magalu",
    description: "Integre seu seller Magalu via API.",
  },
];

const defaultValues: IntegrationFormData = {
  marketplace: "mercadolibre",
  name: "",
  api_key: "",
  stock_sync: true,
  order_sync: true,
};

type UseNewIntegrationOptions = {
  onSuccess?: (integration: Integration) => void;
  onCancel?: () => void;
};

export const useNewIntegration = (options: UseNewIntegrationOptions = {}) => {
  const navigate = useNavigate();
  const marketplaceOptions = useMemo(() => OPTIONS, []);
  const { mutateAsync, isPending } = useCreateIntegrationMutation();

  const form = useForm<IntegrationFormData>({
    resolver: zodResolver(integrationSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const [err, created] = await to(mutateAsync(data));
    if (err) return;
    if (options.onSuccess) {
      options.onSuccess(created);
      return;
    }
    navigate(ROUTES.INTEGRACAO);
  });

  const onCancel = () => {
    if (options.onCancel) {
      options.onCancel();
      return;
    }
    navigate(ROUTES.INTEGRACAO);
  };

  return {
    options: marketplaceOptions,
    control: form.control,
    setValue: form.setValue,
    onSubmit,
    onCancel,
    isValid: form.formState.isValid,
    isSubmitting: isPending,
  };
};
```

- [ ] **Step 4: Rodar testes — devem passar**

Run: `npx vitest run src/features/integracao/hooks/__tests__/useNewIntegration.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/integracao/hooks/useNewIntegration.ts src/features/integracao/hooks/__tests__/useNewIntegration.test.tsx
git commit -m "feat(integracao): useNewIntegration usa create mutation + testes"
```

---

## Task 9 — `useEditIntegration` (TDD)

**Files:**
- Create: `src/features/integracao/hooks/useEditIntegration.ts`
- Create: `src/features/integracao/hooks/__tests__/useEditIntegration.test.tsx`

- [ ] **Step 1: Escrever testes (RED)**

`src/features/integracao/hooks/__tests__/useEditIntegration.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";
import { useEditIntegration } from "../useEditIntegration";
import { integrationService } from "../../services/integration.service";
import type { Integration } from "../../types/integration.types";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );
  return { ...actual, useNavigate: () => navigateMock };
});

vi.mock("../../services/integration.service", () => ({
  integrationService: {
    getById: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mocked = integrationService as unknown as {
  getById: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
};

const existing: Integration = {
  id: "abc",
  name: "Loja existente",
  api_key: "key12345",
  marketplace: "mercadolibre",
  status: "connected",
  stock_sync: true,
  order_sync: false,
};

const wrapper = ({ children }: { children: ReactNode }) => {
  const qc = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  return (
    <QueryClientProvider client={qc}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};

beforeEach(() => {
  navigateMock.mockReset();
  vi.clearAllMocks();
});

describe("useEditIntegration", () => {
  it("popula o form com dados do backend após carregar", async () => {
    mocked.getById.mockResolvedValueOnce(existing);

    const { result } = renderHook(() => useEditIntegration("abc"), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // o form deve ter feito reset com os dados — checamos via getValues do control
    expect(result.current.control._formValues).toEqual({
      marketplace: existing.marketplace,
      name: existing.name,
      api_key: existing.api_key,
      stock_sync: existing.stock_sync,
      order_sync: existing.order_sync,
    });
  });

  it("submit chama update e navega no sucesso", async () => {
    mocked.getById.mockResolvedValueOnce(existing);
    mocked.update.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useEditIntegration("abc"), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setValue("name", "Loja editada", { shouldValidate: true });
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    await waitFor(() =>
      expect(mocked.update).toHaveBeenCalledWith(
        "abc",
        expect.objectContaining({ name: "Loja editada" }),
      ),
    );
    expect(navigateMock).toHaveBeenCalledWith("/app/integracao");
  });
});
```

- [ ] **Step 2: Rodar testes — devem falhar (hook não existe)**

Run: `npx vitest run src/features/integracao/hooks/__tests__/useEditIntegration.test.tsx`
Expected: FAIL — cannot find module `../useEditIntegration`.

- [ ] **Step 3: Implementar o hook (GREEN)**

`src/features/integracao/hooks/useEditIntegration.ts`:

```ts
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/router/routes";
import { to } from "@/shared/lib/to";
import {
  integrationSchema,
  type IntegrationFormData,
} from "../schemas/integration.schema";
import type { MarketplaceOption } from "../types/integration.types";
import {
  useIntegrationQuery,
  useUpdateIntegrationMutation,
} from "../services/integration.queries";

const OPTIONS: MarketplaceOption[] = [
  {
    marketplace: "mercadolibre",
    description: "Conecte sua conta do Mercado Livre via OAuth.",
  },
  {
    marketplace: "shoppe",
    description: "Sincronize anúncios e pedidos da sua loja Shopee.",
  },
  { marketplace: "amazon", description: "Vendor Central · Brasil." },
  {
    marketplace: "magalu",
    description: "Integre seu seller Magalu via API.",
  },
];

export const useEditIntegration = (id: string) => {
  const navigate = useNavigate();
  const marketplaceOptions = useMemo(() => OPTIONS, []);
  const { data, isLoading } = useIntegrationQuery(id);
  const { mutateAsync, isPending } = useUpdateIntegrationMutation(id);

  const form = useForm<IntegrationFormData>({
    resolver: zodResolver(integrationSchema),
    mode: "onChange",
    defaultValues: {
      marketplace: "mercadolibre",
      name: "",
      api_key: "",
      stock_sync: true,
      order_sync: true,
    },
  });

  useEffect(() => {
    if (!data) return;
    form.reset({
      marketplace: data.marketplace,
      name: data.name,
      api_key: data.api_key,
      stock_sync: data.stock_sync,
      order_sync: data.order_sync,
    });
  }, [data, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    const [err] = await to(mutateAsync(values));
    if (err) return;
    navigate(ROUTES.INTEGRACAO);
  });

  const onCancel = () => navigate(ROUTES.INTEGRACAO);

  return {
    options: marketplaceOptions,
    control: form.control,
    setValue: form.setValue,
    onSubmit,
    onCancel,
    isValid: form.formState.isValid,
    isSubmitting: isPending,
    isLoading,
  };
};
```

- [ ] **Step 4: Rodar testes — devem passar**

Run: `npx vitest run src/features/integracao/hooks/__tests__/useEditIntegration.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/integracao/hooks/useEditIntegration.ts src/features/integracao/hooks/__tests__/useEditIntegration.test.tsx
git commit -m "feat(integracao): useEditIntegration com getById + update + reset do form"
```

---

## Task 10 — `useDeleteIntegration` (wrapper fino)

**Files:**
- Create: `src/features/integracao/hooks/useDeleteIntegration.ts`

- [ ] **Step 1: Implementar o wrapper**

`src/features/integracao/hooks/useDeleteIntegration.ts`:

```ts
import { useDeleteIntegrationMutation } from "../services/integration.queries";

export const useDeleteIntegration = () => {
  const { mutate, isPending } = useDeleteIntegrationMutation();
  return { remove: mutate, isDeleting: isPending };
};
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc -b --noEmit`
Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/features/integracao/hooks/useDeleteIntegration.ts
git commit -m "feat(integracao): useDeleteIntegration wrapper sobre delete mutation"
```

---

## Task 11 — Extrair `IntegrationFormView` e refatorar `NewIntegrationForm`

**Files:**
- Create: `src/features/integracao/components/organisms/IntegrationFormView.tsx`
- Modify: `src/features/integracao/components/organisms/NewIntegrationForm.tsx`

- [ ] **Step 1: Criar `IntegrationFormView.tsx` (presentational, recebe controller)**

`src/features/integracao/components/organisms/IntegrationFormView.tsx`:

```tsx
import { Controller, useWatch } from "react-hook-form";
import { BadgeCheck, KeyRound, Tag, Zap } from "lucide-react";
import GradientBorder from "@/shared/components/molecules/GradientBorder/GradientBorder";
import { InputForm } from "@/shared/components/form/InputForm";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { ShimmerButton } from "@/shared/components/ui/shimmer-button";
import { MarketplaceLogo } from "@/shared/components/molecules/MarketplaceLogo";
import { cn } from "@/shared/lib/utils";
import { MarketplaceOptionCard } from "../molecules/MarketplaceOptionCard";
import type { useNewIntegration } from "../../hooks/useNewIntegration";
import type { IntegrationFormData } from "../../schemas/integration.schema";

export const INTEGRATION_FORM_ID = "integration-form";
// alias retrocompatível
export const NEW_INTEGRATION_FORM_ID = INTEGRATION_FORM_ID;

export type IntegrationFormController = ReturnType<typeof useNewIntegration>;

type SectionProps = {
  step: number;
  title: string;
  description?: string;
  children: React.ReactNode;
  compact?: boolean;
};

function Section({ step, title, description, children, compact }: SectionProps) {
  return (
    <GradientBorder className="p-[0.8px]! from-white/15 via-white/5 to-white/10 rounded-2xl!">
      <div
        className={cn(
          "rounded-2xl bg-neutral-900/80 flex flex-col",
          compact ? "p-4 gap-3" : "p-5 gap-4",
        )}
      >
        <div className="flex items-start gap-3">
          <span className="shrink-0 size-6 rounded-full bg-primary/15 border border-primary/40 text-primary text-[11px] font-medium flex items-center justify-center">
            {step}
          </span>
          <div className="flex flex-col gap-0.5">
            <h3 className="text-sm font-medium">{title}</h3>
            {description && (
              <p className="text-[11px] text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {children}
      </div>
    </GradientBorder>
  );
}

type ToggleRowProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
};

function ToggleRow({ icon, title, description, checked, onCheckedChange }: ToggleRowProps) {
  return (
    <label className="flex items-start justify-between gap-3 rounded-lg border border-neutral-800 bg-neutral-950/50 p-3 cursor-pointer hover:border-neutral-700 transition-colors">
      <div className="flex items-start gap-3 min-w-0">
        <span className="shrink-0 mt-0.5 size-7 rounded-md bg-neutral-800 flex items-center justify-center text-muted-foreground">
          {icon}
        </span>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-xs font-medium">{title}</span>
          <span className="text-[11px] text-muted-foreground">{description}</span>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </label>
  );
}

function PreviewCard({ control }: { control: IntegrationFormController["control"] }) {
  const values = useWatch({ control }) as Partial<IntegrationFormData>;
  const name = values.name?.trim() || "Minha integração";
  const apiKeyMask = values.api_key
    ? `${values.api_key.slice(0, 3)}••••••••${values.api_key.slice(-3)}`
    : "—";

  return (
    <GradientBorder className="p-[0.8px]! self-start sticky top-4 w-auto h-fit from-white/20 via-white/5 to-white/15 rounded-2xl!">
      <div className="rounded-2xl bg-neutral-900/80 overflow-hidden">
        <div className="relative h-28 bg-gradient-to-br from-primary/25 via-neutral-900 to-neutral-950 flex items-center justify-center">
          {values.marketplace && (
            <div className="scale-[1.4]">
              <MarketplaceLogo marketplace={values.marketplace} hideLabel />
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Apelido
            </span>
            <span className="text-sm font-medium line-clamp-1">{name}</span>
          </div>
          <div className="flex flex-col gap-0.5 pt-2 border-t border-neutral-800">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Chave de API
            </span>
            <span className="text-xs font-mono text-muted-foreground truncate">
              {apiKeyMask}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Estoque
              </span>
              <span
                className={cn(
                  "text-[11px]",
                  values.stock_sync ? "text-emerald-400" : "text-muted-foreground",
                )}
              >
                {values.stock_sync ? "Sincronizar" : "Desativado"}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Pedidos
              </span>
              <span
                className={cn(
                  "text-[11px]",
                  values.order_sync ? "text-emerald-400" : "text-muted-foreground",
                )}
              >
                {values.order_sync ? "Sincronizar" : "Desativado"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </GradientBorder>
  );
}

type Props = {
  controller: IntegrationFormController;
  variant?: "page" | "drawer";
  hideActions?: boolean;
  submitLabel?: string;
};

export function IntegrationFormView({
  controller,
  variant = "page",
  hideActions = false,
  submitLabel = "Conectar marketplace",
}: Props) {
  const {
    options,
    control,
    setValue,
    onSubmit,
    onCancel,
    isValid,
    isSubmitting,
  } = controller;

  const marketplace = useWatch({ control, name: "marketplace" });
  const isDrawer = variant === "drawer";

  const sections = (
    <div className={cn("flex flex-col", isDrawer ? "gap-3" : "gap-4")}>
      <Section
        step={1}
        title="Escolha o marketplace"
        description="Qual canal você quer conectar agora."
        compact={isDrawer}
      >
        <div
          className={cn(
            "grid gap-3",
            isDrawer
              ? "grid-cols-1"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {options.map((o) => (
            <MarketplaceOptionCard
              key={o.marketplace}
              marketplace={o.marketplace}
              description={o.description}
              selected={marketplace === o.marketplace}
              onClick={() =>
                setValue("marketplace", o.marketplace, { shouldValidate: true })
              }
            />
          ))}
        </div>
      </Section>

      <Section
        step={2}
        title="Credenciais"
        description="Os dados ficam criptografados e só são usados para sincronizar sua carteira."
        compact={isDrawer}
      >
        <div className="flex flex-col gap-3">
          <InputForm
            size="compact"
            control={control}
            name="name"
            label="Apelido da integração"
            placeholder="Ex: Loja principal · Mercado Livre"
            icon={Tag}
          />
          <InputForm
            size="compact"
            control={control}
            name="api_key"
            type="password"
            label="Chave de API / Token"
            placeholder="Cole aqui a chave gerada no marketplace"
            icon={KeyRound}
          />
        </div>
      </Section>

      <Section
        step={3}
        title="O que sincronizar"
        description="Você pode ajustar isso depois nas configurações da integração."
        compact={isDrawer}
      >
        <div className="flex flex-col gap-3">
          <Controller
            control={control}
            name="stock_sync"
            render={({ field }) => (
              <ToggleRow
                icon={<BadgeCheck size={14} />}
                title="Estoque"
                description="Atualize a quantidade disponível a cada mudança."
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="order_sync"
            render={({ field }) => (
              <ToggleRow
                icon={<Zap size={14} />}
                title="Pedidos"
                description="Importe novos pedidos em tempo quase real."
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
      </Section>

      {!hideActions && (
        <div className="flex items-center justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="h-9 text-xs bg-neutral-900 border-neutral-800"
          >
            Cancelar
          </Button>
          <ShimmerButton
            type="submit"
            disabled={!isValid || isSubmitting}
            className={cn(
              "h-9 px-4 py-0 text-xs gap-2 [--radius:0.5rem]",
              (!isValid || isSubmitting) && "opacity-50 cursor-not-allowed",
            )}
          >
            {submitLabel}
          </ShimmerButton>
        </div>
      )}
    </div>
  );

  if (isDrawer) {
    return (
      <form id={INTEGRATION_FORM_ID} onSubmit={onSubmit}>
        {sections}
      </form>
    );
  }

  return (
    <form
      id={INTEGRATION_FORM_ID}
      onSubmit={onSubmit}
      className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5"
    >
      {sections}
      <PreviewCard control={control} />
    </form>
  );
}
```

- [ ] **Step 2: Reescrever `NewIntegrationForm.tsx` como wrapper fino**

`src/features/integracao/components/organisms/NewIntegrationForm.tsx`:

```tsx
import { useNewIntegration } from "../../hooks/useNewIntegration";
import type { Integration } from "../../types/integration.types";
import { IntegrationFormView } from "./IntegrationFormView";

export { NEW_INTEGRATION_FORM_ID } from "./IntegrationFormView";

type NewIntegrationFormProps = {
  variant?: "page" | "drawer";
  onSuccess?: (integration: Integration) => void;
  onCancel?: () => void;
  hideActions?: boolean;
};

export function NewIntegrationForm({
  variant = "page",
  onSuccess,
  onCancel,
  hideActions = false,
}: NewIntegrationFormProps) {
  const controller = useNewIntegration({ onSuccess, onCancel });
  return (
    <IntegrationFormView
      controller={controller}
      variant={variant}
      hideActions={hideActions}
    />
  );
}
```

- [ ] **Step 3: Typecheck — vai pegar callers de NewIntegrationDrawer também**

Run: `npx tsc -b --noEmit`
Expected: possíveis erros em `NewIntegrationDrawer.tsx` (consumidor do form). Verificar e ajustar se a API mudou — neste caso o componente segue exportando os mesmos props públicos (`variant`, `onSuccess`, `onCancel`, `hideActions`), então deve passar.

- [ ] **Step 4: Rodar suíte completa de testes**

Run: `npx vitest run`
Expected: PASS (tudo até aqui).

- [ ] **Step 5: Commit**

```bash
git add src/features/integracao/components/organisms/IntegrationFormView.tsx src/features/integracao/components/organisms/NewIntegrationForm.tsx
git commit -m "refactor(integracao): extrai IntegrationFormView presentacional; snake_case nos fields"
```

---

## Task 11.5 — Adicionar `INTEGRACAO_EDIT` + helper em `routes.ts` (sem registrar no router ainda)

**Files:**
- Modify: `src/app/router/routes.ts`

> Adiantado: o card (Task 12) importa `buildIntegracaoEditPath`. O registro no `router/index.tsx` fica para a Task 16, depois que `EditIntegracaoPage` existir.

- [ ] **Step 1: Atualizar `ROUTES` e adicionar helper**

`src/app/router/routes.ts` — dentro do objeto `ROUTES` (depois de `INTEGRACAO_NEW`):

```ts
INTEGRACAO_EDIT: "/app/integracao/:id/editar",
```

e ao final do arquivo, junto com `buildEstoqueEditPath`:

```ts
export const buildIntegracaoEditPath = (id: string) =>
  `/app/integracao/${id}/editar`;
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc -b --noEmit`
Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/app/router/routes.ts
git commit -m "chore(router): adiciona rota INTEGRACAO_EDIT e helper de path"
```

---

## Task 12 — Refatorar `IntegrationCard` (dropdown + AlertDialog + máscara) (TDD)

**Files:**
- Modify: `src/features/integracao/components/molecules/IntegrationCard.tsx`
- Create: `src/features/integracao/components/molecules/__tests__/IntegrationCard.test.tsx`

- [ ] **Step 1: Escrever testes do card (RED)**

`src/features/integracao/components/molecules/__tests__/IntegrationCard.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/helpers/renderWithProviders";
import { IntegrationCard } from "../IntegrationCard";
import { integrationService } from "../../../services/integration.service";
import type { Integration } from "../../../types/integration.types";

vi.mock("../../../services/integration.service", () => ({
  integrationService: { remove: vi.fn() },
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const integration: Integration = {
  id: "abc",
  name: "Loja teste",
  api_key: "abcdefghij",
  marketplace: "mercadolibre",
  status: "connected",
  stock_sync: true,
  order_sync: false,
};

beforeEach(() => vi.clearAllMocks());

describe("IntegrationCard", () => {
  it("renderiza nome e label do marketplace", () => {
    renderWithProviders(<IntegrationCard integration={integration} />);
    expect(screen.getByText("Loja teste")).toBeInTheDocument();
    expect(screen.getByText("Mercado Livre")).toBeInTheDocument();
  });

  it("não exibe a api_key completa, apenas máscara", () => {
    renderWithProviders(<IntegrationCard integration={integration} />);
    expect(screen.queryByText("abcdefghij")).not.toBeInTheDocument();
    expect(screen.getByText(/abc.+hij/)).toBeInTheDocument(); // 3 primeiros + 3 últimos
  });

  it("abre confirmação ao clicar em Excluir e chama remove ao confirmar", async () => {
    const mockedRemove = integrationService.remove as ReturnType<typeof vi.fn>;
    mockedRemove.mockResolvedValueOnce(undefined);

    renderWithProviders(<IntegrationCard integration={integration} />);

    fireEvent.click(screen.getByRole("button", { name: /mais op/i }));
    fireEvent.click(await screen.findByText("Excluir"));

    // confirmação
    fireEvent.click(await screen.findByRole("button", { name: /confirmar/i }));

    expect(mockedRemove).toHaveBeenCalledWith("abc");
  });
});
```

- [ ] **Step 2: Rodar testes — devem falhar**

Run: `npx vitest run src/features/integracao/components/molecules/__tests__/IntegrationCard.test.tsx`
Expected: FAIL — card atual mostra `lastSyncAt`/`products`/`orders`, sem dropdown nem AlertDialog.

- [ ] **Step 3: Reescrever o card (GREEN)**

`src/features/integracao/components/molecules/IntegrationCard.tsx`:

```tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { SurfaceCard } from "@/shared/components/molecules/SurfaceCard/SurfaceCard";
import { MarketplaceLogo } from "@/shared/components/molecules/MarketplaceLogo";
import { buildIntegracaoEditPath } from "@/app/router/routes";
import { useDeleteIntegration } from "../../hooks/useDeleteIntegration";
import { IntegrationStatusBadge } from "./IntegrationStatusBadge";
import type { Integration } from "../../types/integration.types";

const maskApiKey = (key: string) =>
  key.length <= 6 ? key : `${key.slice(0, 3)}••••••••${key.slice(-3)}`;

type Props = {
  integration: Integration;
};

export function IntegrationCard({ integration }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { remove, isDeleting } = useDeleteIntegration();

  return (
    <SurfaceCard innerClassName="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-2">
          <h4 className="font-medium leading-tight">{integration.name}</h4>
          <MarketplaceLogo marketplace={integration.marketplace} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Mais opções"
              className="size-7 rounded-full text-muted-foreground"
            >
              <MoreHorizontal size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-32">
            <DropdownMenuItem asChild>
              <Link to={buildIntegracaoEditPath(integration.id)}>
                <Pencil className="mr-2 size-3.5" />
                Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setConfirmOpen(true);
              }}
              className="text-red-400 focus:text-red-300"
            >
              <Trash2 className="mr-2 size-3.5" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground">Chave de API</span>
          <span className="text-[11px] font-mono truncate">
            {maskApiKey(integration.api_key)}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground">Sincronização</span>
          <span className="text-[11px]">
            {integration.stock_sync ? "Estoque" : "—"}
            {integration.stock_sync && integration.order_sync ? " · " : ""}
            {integration.order_sync ? "Pedidos" : ""}
            {!integration.stock_sync && !integration.order_sync ? "Desativada" : ""}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-neutral-700/60">
        <IntegrationStatusBadge status={integration.status} />
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir integração?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação remove a integração <strong>{integration.name}</strong> da
              sua carteira. Não dá pra desfazer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={() => remove(integration.id, { onSuccess: () => setConfirmOpen(false) })}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SurfaceCard>
  );
}
```

- [ ] **Step 4: Rodar testes — devem passar**

Run: `npx vitest run src/features/integracao/components/molecules/__tests__/IntegrationCard.test.tsx`
Expected: PASS.

- [ ] **Step 5: Rodar suíte completa**

Run: `npx vitest run`
Expected: PASS em tudo até aqui.

- [ ] **Step 6: Commit**

```bash
git add src/features/integracao/components/molecules/IntegrationCard.tsx src/features/integracao/components/molecules/__tests__/IntegrationCard.test.tsx
git commit -m "refactor(integracao): card com dropdown editar/excluir + máscara api_key"
```

---

## Task 13 — `IntegrationsGrid` com loading skeleton + estado vazio

**Files:**
- Modify: `src/features/integracao/components/organisms/IntegrationsGrid.tsx`

- [ ] **Step 1: Atualizar o componente**

`src/features/integracao/components/organisms/IntegrationsGrid.tsx`:

```tsx
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import GradientBorder from "@/shared/components/molecules/GradientBorder/GradientBorder";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ROUTES } from "@/app/router/routes";
import { IntegrationCard } from "../molecules/IntegrationCard";
import type { Integration } from "../../types/integration.types";

type Props = {
  integrations: Integration[];
  isLoading?: boolean;
};

function AddCard() {
  return (
    <Link to={ROUTES.INTEGRACAO_NEW} className="flex">
      <GradientBorder className="p-[0.8px]! rounded-2xl! from-white/15! via-white/5! to-white/15! flex-1">
        <div className="bg-neutral-900/60 hover:bg-neutral-800/60 transition-colors rounded-2xl p-5 h-full w-full min-h-[180px] flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground">
          <span className="size-10 rounded-full bg-neutral-800 flex items-center justify-center">
            <Plus size={18} />
          </span>
          <span className="text-sm">Nova integração</span>
        </div>
      </GradientBorder>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 flex flex-col gap-4 min-h-[180px]">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="size-7 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
      </div>
      <Skeleton className="h-5 w-24 mt-auto" />
    </div>
  );
}

export function IntegrationsGrid({ integrations, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (integrations.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AddCard />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {integrations.map((i) => (
        <IntegrationCard key={i.id} integration={i} />
      ))}
      <AddCard />
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc -b --noEmit`
Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/features/integracao/components/organisms/IntegrationsGrid.tsx
git commit -m "feat(integracao): grid com loading skeleton e estado vazio"
```

---

## Task 14 — `IntegracaoPage` repassa `isLoading`

**Files:**
- Modify: `src/features/integracao/pages/IntegracaoPage.tsx`

- [ ] **Step 1: Atualizar a página**

`src/features/integracao/pages/IntegracaoPage.tsx`:

```tsx
import { IntegrationsHeader } from "../components/organisms/IntegrationsHeader";
import { IntegrationsGrid } from "../components/organisms/IntegrationsGrid";
import { useIntegrations } from "../hooks/useIntegrations";

const IntegracaoPage = () => {
  const { integrations, stats, isLoading } = useIntegrations();

  return (
    <div className="min-h-full w-full flex flex-col gap-6">
      <IntegrationsHeader
        total={stats.total}
        connected={stats.connected}
        issues={stats.issues}
      />
      <IntegrationsGrid integrations={integrations} isLoading={isLoading} />
    </div>
  );
};

export default IntegracaoPage;
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc -b --noEmit`
Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/features/integracao/pages/IntegracaoPage.tsx
git commit -m "feat(integracao): IntegracaoPage repassa isLoading"
```

---

## Task 15 — `EditIntegracaoPage`

**Files:**
- Create: `src/features/integracao/pages/EditIntegracaoPage.tsx`
- Modify: `src/features/integracao/index.ts`

- [ ] **Step 1: Criar a página**

`src/features/integracao/pages/EditIntegracaoPage.tsx`:

```tsx
import { useParams, Navigate } from "react-router-dom";
import { Spinner } from "@/shared/components/ui/spinner";
import { ROUTES } from "@/app/router/routes";
import ButtonReturn from "@/shared/components/molecules/ButtonReturn";
import { IntegrationFormView } from "../components/organisms/IntegrationFormView";
import { useEditIntegration } from "../hooks/useEditIntegration";

const EditIntegracaoPage = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) return <Navigate to={ROUTES.INTEGRACAO} replace />;

  const controller = useEditIntegration(id);

  return (
    <div className="min-h-full w-full max-w-5xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <ButtonReturn
          className="absolute w-auto h-auto left-5 top-5 z-10"
          text="Integrações"
          to={ROUTES.INTEGRACAO}
        />
        <div>
          <h2 className="text-2xl font-light">Editar integração</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Atualize as credenciais ou os switches de sincronização.
          </p>
        </div>
      </div>

      {controller.isLoading ? (
        <div className="flex items-center justify-center min-h-40">
          <Spinner />
        </div>
      ) : (
        <IntegrationFormView controller={controller} submitLabel="Salvar alterações" />
      )}
    </div>
  );
};

export default EditIntegracaoPage;
```

- [ ] **Step 2: Atualizar barrel**

`src/features/integracao/index.ts`:

```ts
export { default as IntegracaoPage } from "./pages/IntegracaoPage";
export { default as NewIntegracaoPage } from "./pages/NewIntegracaoPage";
export { default as EditIntegracaoPage } from "./pages/EditIntegracaoPage";
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc -b --noEmit`
Expected: sem erros.

- [ ] **Step 4: Commit**

```bash
git add src/features/integracao/pages/EditIntegracaoPage.tsx src/features/integracao/index.ts
git commit -m "feat(integracao): página EditIntegracaoPage reusando IntegrationFormView"
```

---

## Task 16 — Registrar `EditIntegracaoPage` no router

**Files:**
- Modify: `src/app/router/index.tsx`

> A rota e o helper já foram adicionados na Task 11.5. Agora que `EditIntegracaoPage` existe (Task 15), basta registrar o lazy.

- [ ] **Step 1: Registrar a página no router**

`src/app/router/index.tsx` — adicionar o lazy import junto dos outros:

```tsx
const EditIntegracaoPage = lazy(
  () => import("@/features/integracao/pages/EditIntegracaoPage"),
);
```

e adicionar a rota dentro do `MainLayout` children, logo após a linha de `INTEGRACAO_NEW`:

```tsx
{ path: ROUTES.INTEGRACAO_EDIT, element: <EditIntegracaoPage /> },
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc -b --noEmit`
Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/app/router/index.tsx
git commit -m "feat(router): registra EditIntegracaoPage em /app/integracao/:id/editar"
```

---

## Task 17 — Smoke manual no browser

**Files:** —

- [ ] **Step 1: Rodar a suíte completa**

Run: `npx vitest run`
Expected: 100% PASS.

- [ ] **Step 2: Subir o dev server**

Run: `npm run dev`
Expected: servidor sobe em `http://localhost:3000` sem erro de compilação.

- [ ] **Step 3: Smoke do golden path** (manual, com backend rodando + JWT válido em `useAuthStore`)

  1. `/app/integracao` carrega: ver skeleton, depois cards reais ou estado vazio.
  2. Clicar em "Nova integração" → preencher form → submeter → toast de sucesso, redireciona para `/app/integracao`, novo card aparece (cache invalidado).
  3. Clicar no `⋯` de um card → "Editar" → form aparece preenchido → alterar nome → salvar → toast de sucesso → redireciona, card reflete novo nome.
  4. `⋯` → "Excluir" → AlertDialog aparece → confirmar → toast sucesso → card some.
  5. Forçar erro (ex: backend desligado) → toast vermelho aparece com mensagem; UI não fica travada.

- [ ] **Step 4: Reportar resultado**

Se algo falhar, anotar o sintoma e o passo, mas **não** classificar como sucesso. Caso tudo passe: "Smoke manual OK".

- [ ] **Step 5: Commit final (se houver pendência tipo dev-only)**

Tipicamente nada a comitar. Se algum ajuste pequeno surgir do smoke, commit dedicado com prefixo `fix(integracao):`.

---

## Spec coverage check (post-write)

- Wire snake_case end-to-end: ✓ Tasks 2, 3, 4, 5, 8, 9, 11
- Envelope unwrap com Error: ✓ Task 4 (service + 11 testes)
- Toasts sonner globais: ✓ Tasks 5, 6
- CRUD completo: ✓ Tasks 4 (service), 8 (create hook), 9 (edit hook), 10 (delete hook), 12 (delete UI), 15 (edit UI)
- Marketplace `magalu`: ✓ Tasks 1, 3, 8, 9
- Card simplificado + máscara `api_key`: ✓ Task 12
- Loading skeleton + estado vazio: ✓ Task 13
- Rota edit: ✓ Task 16
- Toaster montado: ✓ Task 6
- TDD em todas as camadas: ✓ Tasks 3, 4, 5, 7, 8, 9, 12

Nenhuma seção da spec sem task correspondente.
