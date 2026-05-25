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
    expect(screen.getByText(/abc.+hij/)).toBeInTheDocument();
  });

  it("abre confirmação ao clicar em Excluir e chama remove ao confirmar", async () => {
    const mockedRemove = integrationService.remove as ReturnType<typeof vi.fn>;
    mockedRemove.mockResolvedValueOnce(undefined);

    renderWithProviders(<IntegrationCard integration={integration} />);

    fireEvent.click(screen.getByRole("button", { name: /mais op/i }));
    fireEvent.click(await screen.findByText("Excluir"));

    fireEvent.click(await screen.findByRole("button", { name: /confirmar/i }));

    expect(mockedRemove).toHaveBeenCalledWith("abc");
  });
});
