import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import type { ApiResponse } from "@/shared/types/api.types";
import type { RefreshTokenResponse } from "@/features/auth/types/auth.types";

const BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

const processQueue = (token: string | null) => {
  pendingQueue.forEach((cb) => cb(token));
  pendingQueue = [];
};

const failAuth = () => {
  useAuthStore.getState().logout();
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

const isAuthEndpoint = (url?: string) =>
  !!url && /\/api\/auth\//.test(url);

const refreshTokens = async (refreshToken: string) => {
  const response = await axios.post<ApiResponse<RefreshTokenResponse>>(
    "/api/auth/refresh",
    { refresh_token: refreshToken },
    { baseURL: BASE_URL, headers: { "Content-Type": "application/json" } },
  );
  return response.data.data;
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const status = error.response?.status;

    // eslint-disable-next-line no-console
    console.log("[refresh] interceptor hit", {
      status,
      url: original?.url,
      hasOriginal: !!original,
      retry: original?._retry,
      isRefreshing,
      isAuthEndpoint: original ? isAuthEndpoint(original.url) : null,
      hasRefreshTokenInStore: !!useAuthStore.getState().refreshToken,
    });

    if (status !== 401 || !original) {
      // eslint-disable-next-line no-console
      console.log("[refresh] bail: not 401 or missing config");
      return Promise.reject(error);
    }

    if (isAuthEndpoint(original.url)) {
      // eslint-disable-next-line no-console
      console.log("[refresh] bail: auth endpoint");
      return Promise.reject(error);
    }

    if (original._retry) {
      // eslint-disable-next-line no-console
      console.log("[refresh] bail: already retried");
      failAuth();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // eslint-disable-next-line no-console
      console.log("[refresh] queue: refresh in flight");
      return new Promise((resolve, reject) => {
        pendingQueue.push((newToken) => {
          if (!newToken) {
            reject(error);
            return;
          }
          original.headers.Authorization = `Bearer ${newToken}`;
          original._retry = true;
          resolve(api(original as AxiosRequestConfig));
        });
      });
    }

    const storedRefresh = useAuthStore.getState().refreshToken;
    if (!storedRefresh) {
      // eslint-disable-next-line no-console
      console.log("[refresh] bail: no refresh token in store");
      failAuth();
      return Promise.reject(error);
    }

    original._retry = true;
    isRefreshing = true;

    try {
      // eslint-disable-next-line no-console
      console.log("[refresh] POST /api/auth/refresh");
      const tokens = await refreshTokens(storedRefresh);
      // eslint-disable-next-line no-console
      console.log("[refresh] success, retrying original");
      useAuthStore.getState().setTokens({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: tokens.expires_at,
        refreshExpiresAt: tokens.refresh_expires_at,
      });
      processQueue(tokens.access_token);
      original.headers.Authorization = `Bearer ${tokens.access_token}`;
      return api(original as AxiosRequestConfig);
    } catch (refreshError) {
      processQueue(null);
      failAuth();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
