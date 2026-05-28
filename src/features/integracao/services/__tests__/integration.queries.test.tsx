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
