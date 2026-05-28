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
      issues: 2,
    });
  });
});
