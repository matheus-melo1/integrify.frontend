# Integração frontend do módulo Integration

**Data:** 2026-05-17
**Status:** Aprovado (aguardando review do spec)

## Objetivo

Substituir o mock de `features/integracao` por uma integração real com o backend Go (Gin + pgx + JWT), implementando CRUD completo (list, get-by-id, create, update, delete) sobre o endpoint `/integration`.

## Contrato do backend

- **Base:** `/integration` (montado em RouterGroup com middleware JWT)
- **Auth:** header `Authorization: Bearer <JWT>` obrigatório (já adicionado automaticamente pelo interceptor em `shared/lib/axios.ts`)
- **Tenant:** `org_id` extraído do JWT pelo backend; queries já filtram por tenant
- **Content-Type:** `application/json`
- **Wire format:** snake_case nos dois sentidos (request e response — confirmado pelo usuário; ignorar comentário do prompt original sobre PascalCase)

### Envelope padrão

```json
{
  "success": true,
  "status": 200,
  "data": <payload | null>,
  "error": "<string opcional, presente em falhas>"
}
```

### Endpoints

| Método | Path                | Sucesso | Notas |
|--------|---------------------|---------|-------|
| GET    | `/integration`      | 200, `data: Integration[]` (pode vir `null` se vazio) | sem paginação |
| GET    | `/integration/:id`  | 200, `data: Integration` | 400 se UUID inválido; 500 se não encontrado (sem 404 dedicado) |
| POST   | `/integration`      | 201, `data: Integration` (com `id` gerado) | 400 se faltar campo required |
| PUT    | `/integration/:id`  | 200, `data: null`       | atualiza name, api_key, marketplace, status, stock_sync, order_sync |
| DELETE | `/integration/:id`  | 200, `data: null`       | soft delete |

### Modelo de domínio

```ts
type Marketplace = "mercadolibre" | "shoppe" | "magalu" | "amazon";
type IntegrationStatus = "connected" | "syncing" | "error" | "disconnected";

type Integration = {
  id: string;          // UUID
  name: string;
  api_key: string;
  marketplace: Marketplace;
  status: IntegrationStatus;
  stock_sync: boolean;
  order_sync: boolean;
};
```

### Request body (create / update)

```json
{
  "name": "Minha Loja ML",
  "api_key": "abc123",
  "marketplace": "mercadolibre",
  "status": "connected",
  "stock_sync": true,
  "order_sync": false
}
```

Validação (Gin binding): `name`, `api_key`, `marketplace` → required. Demais → opcionais.

## Decisões de design

1. **Wire em snake_case:** types do frontend e form schema usam snake_case (`api_key`, `stock_sync`, `order_sync`), sem mapeamento. Diverge da convenção camelCase do resto do projeto mas é o que o usuário pediu, justificado por evitar adapter intermediário.
2. **Adapter de envelope no service:** uma função `unwrap()` única faz a checagem de `success` e lança `Error(envelope.error)` em falha lógica. HTTP errors continuam caindo na rejeição do axios.
3. **Toasts globais via sonner:** mutations disparam `toast.error(err.message)` no `onError` e `toast.success(...)` no `onSuccess`. Hooks ficam thin.
4. **CRUD completo:** inclui edit (página dedicada reusando o `NewIntegrationForm`) e delete (dropdown no `MoreHorizontal` do card + AlertDialog de confirmação).
5. **Campos do mock removidos:** `lastSyncAt`, `products`, `orders` não existem no backend e foram descontinuados do `Integration` e do card.
6. **Suporte ao marketplace `magalu`:** adicionado ao `shared/types/marketplace.types.ts` e ao `MarketplaceLogo` (iniciais `MG`, cor azul Magalu).

## Arquitetura

Segue padrão Package by Feature + Atomic Design já estabelecido. Service layer segue padrão registrado em memória (`Service layer pattern`): interface → class implements → const singleton.

### Estrutura final

```
features/integracao/
├── components/
│   ├── molecules/
│   │   ├── IntegrationCard.tsx          # refator
│   │   ├── IntegrationStatusBadge.tsx   # inalterado
│   │   └── MarketplaceOptionCard.tsx    # inalterado
│   └── organisms/
│       ├── IntegrationsGrid.tsx         # adiciona skeleton/empty state
│       ├── IntegrationsHeader.tsx       # inalterado
│       ├── NewIntegrationDrawer.tsx     # inalterado (consome novo form)
│       └── NewIntegrationForm.tsx       # refator: aceita controller opcional + snake_case
├── hooks/
│   ├── useIntegrations.ts               # refator: usa query
│   ├── useNewIntegration.ts             # refator: usa mutation
│   ├── useEditIntegration.ts            # NOVO
│   ├── useDeleteIntegration.ts          # NOVO (wrapper fino)
│   └── __tests__/
├── pages/
│   ├── IntegracaoPage.tsx               # passa isLoading
│   ├── NewIntegracaoPage.tsx            # inalterado
│   └── EditIntegracaoPage.tsx           # NOVO
├── schemas/
│   ├── integration.schema.ts            # snake_case + magalu
│   └── __tests__/
├── services/                            # NOVO
│   ├── integration.service.ts
│   ├── integration.queries.ts
│   └── __tests__/
├── types/
│   └── integration.types.ts             # snake_case + IntegrationRequest
└── index.ts                             # exporta EditIntegracaoPage
```

### Mudanças fora da feature

- `shared/types/marketplace.types.ts`: adiciona `magalu` ao enum `Marketplace`.
- `shared/components/molecules/MarketplaceLogo/MarketplaceLogo.tsx`: adiciona entrada `magalu` no `MAP`.
- `app/router/routes.ts`: adiciona `INTEGRACAO_EDIT` e helper `buildIntegracaoEditPath`.
- `app/router/index.tsx`: registra rota para `EditIntegracaoPage`.
- `app/providers/AppProviders.tsx`: monta `<Toaster richColors position="top-right" />` (sonner).

## Detalhes por camada

### Types (`features/integracao/types/integration.types.ts`)

```ts
import type { Marketplace } from "@/shared/types/marketplace.types";

export type IntegrationStatus =
  | "connected" | "syncing" | "error" | "disconnected";

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

### Schema (`features/integracao/schemas/integration.schema.ts`)

```ts
import { z } from "zod";

export const integrationSchema = z.object({
  marketplace: z.enum(
    ["amazon", "shoppe", "mercadolibre", "magalu"],
    { message: "Selecione um marketplace" },
  ),
  name: z.string().min(2, "Mínimo 2 caracteres"),
  api_key: z.string().min(5, "Chave muito curta"),
  stock_sync: z.boolean(),
  order_sync: z.boolean(),
});

export type IntegrationFormData = z.infer<typeof integrationSchema>;
```

### Service (`features/integracao/services/integration.service.ts`)

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
      .then((r) => { unwrap(r.data); });
  }
  remove(id: string) {
    return api
      .delete<ApiResponse<null>>(`/integration/${id}`)
      .then((r) => { unwrap(r.data); });
  }
}

export const integrationService = new IntegrationService();
```

### Queries (`features/integracao/services/integration.queries.ts`)

```ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

### Hooks de feature

- `useIntegrations`: lê `useIntegrationsQuery`, devolve `{ integrations, stats, isLoading, isError, refetch }`. `stats` recalculada com `useMemo` sobre os dados reais.
- `useNewIntegration`: mantém API pública (`options`, `control`, `setValue`, `onSubmit`, `onCancel`, `isValid`, `isSubmitting`). `isSubmitting` passa a refletir `isPending` da mutation. Tipo de `onSuccess` muda de `IntegrationFormData` para `Integration` (registro criado).
- `useEditIntegration(id)`: shape compatível com `useNewIntegration` (mesmas chaves no retorno + `isLoading`). Internamente: `useIntegrationQuery(id)` + `useUpdateIntegrationMutation(id)`. `form.reset` quando dados chegam.
- `useDeleteIntegration`: wrapper fino sobre `useDeleteIntegrationMutation` expondo `{ remove, isDeleting }`.

### UI

- **IntegrationCard:** remove `lastSyncAt`/`products`/`orders`. Mostra: nome, MarketplaceLogo, status, `api_key` mascarada (`abc••••••••xyz`), badges para `stock_sync` e `order_sync`. `MoreHorizontal` vira trigger de DropdownMenu com **Editar** (Link para `buildIntegracaoEditPath(integration.id)`) e **Excluir** (abre AlertDialog; confirm chama `useDeleteIntegration().remove(id)`).
- **IntegrationsGrid:** recebe `isLoading`. Loading → 4 cards Skeleton. Vazio (`!isLoading && integrations.length === 0`) → só o card "+ Nova integração".
- **NewIntegrationForm:** aceita prop opcional `controller?: ReturnType<typeof useNewIntegration>`. Se passada, usa; senão chama `useNewIntegration()` internamente (default atual). Campos do form renomeados para snake_case (`api_key`, `stock_sync`, `order_sync`); `PreviewCard` usa as mesmas chaves.
- **EditIntegracaoPage:** novo. `useParams` → `id`. Usa `useEditIntegration(id)`. Spinner enquanto `isLoading`. Renderiza `NewIntegrationForm` passando o controller.
- **AppProviders:** adiciona `<Toaster richColors position="top-right" />` dentro do `TooltipProvider`.

### Rotas

- `ROUTES.INTEGRACAO_EDIT = "/app/integracao/:id/editar"`
- `buildIntegracaoEditPath(id: string)` helper
- Registrar rota no `app/router/index.tsx` (lazy-loaded como as demais)

## Fluxo de erros

1. **HTTP 4xx/5xx:** axios rejeita → cai no `onError` da mutation → `toast.error("Network Error")` ou similar. Componentes não precisam tratar.
2. **HTTP 200 com `success: false`:** `unwrap()` lança `new Error(envelope.error)` → cai no `onError` da mutation → `toast.error(envelope.error)`.
3. **401:** interceptor de `shared/lib/axios.ts` já desloga e redireciona para `/login`. Comportamento atual mantido.
4. **Validação Zod (form):** mensagens inline via React Hook Form. Submit bloqueado por `!isValid`.

## Testes (TDD)

Conjunto mínimo escrito **antes** da implementação de cada camada.

- `services/__tests__/integration.service.test.ts`
  - Cada método: sucesso desempacota envelope; `success:false` lança Error com `envelope.error`; `data:null` na list → `[]`.
  - Mock de `api` via `vi.mock("@/shared/lib/axios")`.

- `services/__tests__/integration.queries.test.ts`
  - `useCreateIntegrationMutation`: invalida `integrationKeys.all` no sucesso; dispara `toast.success`.
  - `useUpdateIntegrationMutation`: invalida list + detail.
  - `useDeleteIntegrationMutation`: invalida list.
  - `onError` de cada uma dispara `toast.error` com a mensagem do Error.
  - Mock de `sonner` e do `integrationService`.

- `hooks/__tests__/useIntegrations.test.tsx`
  - Calcula `stats` (total/connected/issues) sobre dados mockados.
  - `integrations` é `[]` enquanto query carrega.

- `hooks/__tests__/useNewIntegration.test.tsx`
  - Submit válido chama `mutateAsync` e navega no sucesso.
  - Submit com falha não navega (mutation cuida do toast).

- `hooks/__tests__/useEditIntegration.test.tsx`
  - `form.reset` é chamado com dados do backend quando query resolve.
  - Submit dispara update e navega.

- `schemas/__tests__/integration.schema.test.ts`
  - Aceita payload válido em snake_case.
  - Rejeita marketplace fora do enum, `api_key` curto, `name` curto.

- `components/molecules/__tests__/IntegrationCard.test.tsx`
  - Renderiza dados básicos (name, marketplace, status).
  - `api_key` não aparece por completo (somente máscara).
  - Click em "Excluir" abre AlertDialog; confirm chama `remove`.

Helpers: `renderWithProviders` (já existente em `src/test/helpers/`).

## Pontos não cobertos (fora do escopo)

- Paginação no `GET /integration` (backend ainda não suporta).
- Estado 404 dedicado no `getById` (backend retorna 500 para "não encontrado").
- Reveal/copy do `api_key` no card (apenas máscara).
- Refresh manual da integração ("sincronizar agora") — endpoint não existe ainda.
