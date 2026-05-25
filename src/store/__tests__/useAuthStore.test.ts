import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "../useAuthStore";

const initial = useAuthStore.getState();

beforeEach(() => {
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
});

const tokens = {
  accessToken: "acc",
  refreshToken: "ref",
  expiresAt: "2026-05-24T17:15:00Z",
  refreshExpiresAt: "2026-05-26T17:00:00Z",
};

const user = { id: "u1", name: "Mat", email: "a@b.com", role: "admin" };

describe("useAuthStore.setAuth", () => {
  it("popula todos os campos de auth", () => {
    initial.setAuth(tokens, user);
    const s = useAuthStore.getState();
    expect(s.token).toBe("acc");
    expect(s.refreshToken).toBe("ref");
    expect(s.expiresAt).toBe(tokens.expiresAt);
    expect(s.refreshExpiresAt).toBe(tokens.refreshExpiresAt);
    expect(s.user).toEqual(user);
    expect(s.isAuthenticated).toBe(true);
  });

  it("persiste sob chave integrify:auth", () => {
    initial.setAuth(tokens, user);
    const raw = localStorage.getItem("integrify:auth");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.state.token).toBe("acc");
    expect(parsed.state.refreshToken).toBe("ref");
    expect(localStorage.getItem("auth-storage")).toBeNull();
  });
});

describe("useAuthStore.setTokens", () => {
  it("atualiza apenas os tokens e preserva o user", () => {
    initial.setAuth(tokens, user);
    initial.setTokens({
      accessToken: "acc2",
      refreshToken: "ref2",
      expiresAt: "2026-06-01T00:00:00Z",
      refreshExpiresAt: "2026-06-03T00:00:00Z",
    });
    const s = useAuthStore.getState();
    expect(s.token).toBe("acc2");
    expect(s.refreshToken).toBe("ref2");
    expect(s.user).toEqual(user);
  });
});

describe("useAuthStore.logout", () => {
  it("zera todos os campos de auth", () => {
    initial.setAuth(tokens, user);
    initial.logout();
    const s = useAuthStore.getState();
    expect(s.token).toBeNull();
    expect(s.refreshToken).toBeNull();
    expect(s.expiresAt).toBeNull();
    expect(s.refreshExpiresAt).toBeNull();
    expect(s.user).toBeNull();
    expect(s.isAuthenticated).toBe(false);
  });
});
