import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
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

describe("diag", () => {
  it("click confirm with act", async () => {
    const mockedRemove = integrationService.remove as ReturnType<typeof vi.fn>;
    mockedRemove.mockResolvedValueOnce(undefined);
    renderWithProviders(<IntegrationCard integration={integration} />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /mais op/i }));
    });

    const excluirEl = await screen.findByText("Excluir");
    console.log("Excluir found:", excluirEl.tagName, excluirEl.textContent);

    await act(async () => {
      fireEvent.click(excluirEl);
    });

    const confirmBtn = await screen.findByRole("button", {
      name: /confirmar/i,
    });
    console.log(
      "Confirm button disabled:",
      confirmBtn.hasAttribute("disabled"),
      "tag:",
      confirmBtn.tagName,
      "data-slot:",
      confirmBtn.getAttribute("data-slot"),
    );

    await act(async () => {
      fireEvent.click(confirmBtn);
    });

    console.log(
      "Remove calls after click:",
      mockedRemove.mock.calls.length,
      JSON.stringify(mockedRemove.mock.calls),
    );
    await waitFor(() => expect(mockedRemove).toHaveBeenCalledWith("abc"));
  });
});
