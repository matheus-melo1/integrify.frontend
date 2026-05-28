import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { api } from "../axios";
import { useAuthStore } from "@/store/useAuthStore";

const tokens = {
  access_token: "acc",
  refresh_token: "ref",
  expires_at: "2026-05-24T17:15:00Z",
  refresh_expires_at: "2026-05-26T17:00:00Z",
};

const newTokens = {
  ...tokens,
  access_token: "acc2",
  refresh_token: "ref2",
};

const seedAuth = () => {
  useAuthStore.getState().setAuth(
    {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: tokens.expires_at,
      refreshExpiresAt: tokens.refresh_expires_at,
    },
    { id: "u1", name: "n", email: "e", role: "admin" },
  );
};

const originalAdapter = api.defaults.adapter;
const originalLocation = window.location;

beforeEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  useAuthStore.setState({
    token: null,
    refreshToken: null,
    expiresAt: null,
    refreshExpiresAt: null,
    user: null,
    isAuthenticated: false,
    loginTransition: "idle",
  });
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { href: "", pathname: "/app/dashboard" },
  });
});

afterEach(() => {
  api.defaults.adapter = originalAdapter;
  Object.defineProperty(window, "location", {
    configurable: true,
    value: originalLocation,
  });
});

const makeAdapter = (
  handler: (config: InternalAxiosRequestConfig) => {
    status: number;
    data?: unknown;
  },
) => {
  return (async (config: InternalAxiosRequestConfig) => {
    const { status, data } = handler(config);
    const response = {
      data: data ?? {},
      status,
      statusText: status === 200 ? "OK" : "ERR",
      headers: {},
      config,
    };
    if (status >= 200 && status < 300) return response;
    throw new AxiosError(
      `Request failed with status code ${status}`,
      String(status),
      config,
      null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      response as any,
    );
  }) as typeof api.defaults.adapter;
};

describe("api response interceptor — refresh token", () => {
  it("refresh válido: chama /api/auth/refresh, atualiza store e refaz request original", async () => {
    seedAuth();
    let protectedCalls = 0;
    const seenHeaders: string[] = [];
    api.defaults.adapter = makeAdapter((config) => {
      if (config.url === "/protected") {
        protectedCalls++;
        seenHeaders.push(String(config.headers.Authorization));
        if (protectedCalls === 1) return { status: 401 };
        return { status: 200, data: { ok: true } };
      }
      return { status: 404 };
    });

    const postSpy = vi.spyOn(axios, "post").mockResolvedValue({
      data: { success: true, status: 200, data: newTokens },
    } as never);

    const res = await api.get("/protected");

    expect(res.status).toBe(200);
    expect(protectedCalls).toBe(2);
    expect(postSpy).toHaveBeenCalledTimes(1);
    expect(postSpy).toHaveBeenCalledWith(
      "/api/auth/refresh",
      { refresh_token: "ref" },
      expect.objectContaining({ headers: expect.any(Object) }),
    );
    expect(useAuthStore.getState().token).toBe("acc2");
    expect(useAuthStore.getState().refreshToken).toBe("ref2");
    expect(seenHeaders[1]).toBe("Bearer acc2");
  });

  it("requests paralelos com 401: refresh executa uma única vez", async () => {
    seedAuth();
    const calls: Record<string, number> = { a: 0, b: 0 };
    api.defaults.adapter = makeAdapter((config) => {
      const key = config.url === "/a" ? "a" : config.url === "/b" ? "b" : null;
      if (!key) return { status: 404 };
      calls[key]++;
      if (calls[key] === 1) return { status: 401 };
      return { status: 200, data: { url: key } };
    });

    const postSpy = vi.spyOn(axios, "post").mockResolvedValue({
      data: { success: true, status: 200, data: newTokens },
    } as never);

    const [resA, resB] = await Promise.all([api.get("/a"), api.get("/b")]);
    expect(resA.status).toBe(200);
    expect(resB.status).toBe(200);
    expect(postSpy).toHaveBeenCalledTimes(1);
    expect(calls).toEqual({ a: 2, b: 2 });
  });

  it("refresh inválido: faz logout e redireciona para /login", async () => {
    seedAuth();
    api.defaults.adapter = makeAdapter(() => ({ status: 401 }));
    vi.spyOn(axios, "post").mockRejectedValue(new Error("expired"));

    await expect(api.get("/protected")).rejects.toBeDefined();
    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(window.location.href).toBe("/login");
  });

  it("401 em /api/auth/sign não tenta refresh", async () => {
    seedAuth();
    api.defaults.adapter = makeAdapter(() => ({ status: 401 }));
    const postSpy = vi.spyOn(axios, "post");

    await expect(api.post("/api/auth/sign", {})).rejects.toBeDefined();
    expect(postSpy).not.toHaveBeenCalled();
    expect(useAuthStore.getState().token).toBe("acc");
  });

  it("sem refresh token armazenado: faz logout direto", async () => {
    api.defaults.adapter = makeAdapter(() => ({ status: 401 }));
    const postSpy = vi.spyOn(axios, "post");

    await expect(api.get("/protected")).rejects.toBeDefined();
    expect(postSpy).not.toHaveBeenCalled();
    expect(window.location.href).toBe("/login");
  });
});
