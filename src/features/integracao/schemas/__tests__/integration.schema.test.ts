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
