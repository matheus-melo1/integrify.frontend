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
