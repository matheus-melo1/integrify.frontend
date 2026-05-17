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
