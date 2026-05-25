import type { StateStorage } from "zustand/middleware";

const PREFIX = "integrify:";

export const prefixedKey = (key: string) => `${PREFIX}${key}`;

export const prefixedLocalStorage: StateStorage = {
  getItem: (name) => localStorage.getItem(prefixedKey(name)),
  setItem: (name, value) => localStorage.setItem(prefixedKey(name), value),
  removeItem: (name) => localStorage.removeItem(prefixedKey(name)),
};
