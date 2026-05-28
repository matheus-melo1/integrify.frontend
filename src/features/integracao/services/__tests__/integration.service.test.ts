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
