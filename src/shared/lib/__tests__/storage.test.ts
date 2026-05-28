import { describe, it, expect, beforeEach } from "vitest";
import { prefixedKey, prefixedLocalStorage } from "../storage";

beforeEach(() => {
  localStorage.clear();
});

describe("prefixedKey", () => {
  it("prefixa com integrify:", () => {
    expect(prefixedKey("foo")).toBe("integrify:foo");
  });
});

describe("prefixedLocalStorage", () => {
  it("setItem grava no localStorage com prefixo", () => {
    prefixedLocalStorage.setItem("x", "1");
    expect(localStorage.getItem("integrify:x")).toBe("1");
    expect(localStorage.getItem("x")).toBeNull();
  });

  it("getItem lê do localStorage com prefixo", () => {
    localStorage.setItem("integrify:y", "abc");
    expect(prefixedLocalStorage.getItem("y")).toBe("abc");
  });

  it("removeItem apaga a chave prefixada", () => {
    localStorage.setItem("integrify:z", "v");
    prefixedLocalStorage.removeItem("z");
    expect(localStorage.getItem("integrify:z")).toBeNull();
  });
});
