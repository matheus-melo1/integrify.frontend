import { describe, it, expect, vi, beforeEach } from "vitest";
import { api } from "@/shared/lib/axios";
import { authService } from "../auth.service";
import type {
  LoginResponse,
  RefreshTokenResponse,
} from "../../types/auth.types";

vi.mock("@/shared/lib/axios", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mocked = api as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
};

const tokens: LoginResponse = {
  access_token: "acc",
  refresh_token: "ref",
  expires_at: "2026-05-24T17:15:00Z",
  refresh_expires_at: "2026-05-26T17:00:00Z",
};

const ok = <T>(data: T) => ({ data: { success: true, status: 200, data } });

beforeEach(() => {
  vi.clearAllMocks();
});

describe("authService.login", () => {
  it("posta em /api/auth/sign e desempacota envelope", async () => {
    mocked.post.mockResolvedValueOnce(ok(tokens));
    await expect(
      authService.login({ email: "a@b.com", password: "x" }),
    ).resolves.toEqual(tokens);
    expect(mocked.post).toHaveBeenCalledWith("/api/auth/sign", {
      email: "a@b.com",
      password: "x",
    });
  });
});

describe("authService.refresh", () => {
  it("posta em /api/auth/refresh e desempacota envelope", async () => {
    const next: RefreshTokenResponse = { ...tokens, access_token: "acc2", refresh_token: "ref2" };
    mocked.post.mockResolvedValueOnce(ok(next));
    await expect(
      authService.refresh({ refresh_token: "ref" }),
    ).resolves.toEqual(next);
    expect(mocked.post).toHaveBeenCalledWith("/api/auth/refresh", {
      refresh_token: "ref",
    });
  });

  it("propaga erro do axios", async () => {
    mocked.post.mockRejectedValueOnce(new Error("expired"));
    await expect(
      authService.refresh({ refresh_token: "bad" }),
    ).rejects.toThrow("expired");
  });
});
