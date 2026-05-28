import { api } from "@/shared/lib/axios";
import type { ApiResponse } from "@/shared/types/api.types";
import { normalizeStatus, type Stock } from "../types/stock.types";
import type { ProductFormData } from "../schemas/product.schema";

interface IStorageService {
  getAll(): Promise<Stock[]>;
  getById(id: string): Promise<Stock>;
  create(data: ProductFormData): Promise<Stock>;
  update(id: string, data: ProductFormData): Promise<Stock>;
  remove(id: string): Promise<void>;
}

const parseBRLToNumber = (s: string): number => {
  const digits = String(s ?? "").replace(/\D/g, "");
  if (!digits) return 0;
  return Number(digits) / 100;
};

const toBody = (data: ProductFormData) => ({
  sku: data.sku,
  name: data.name,
  stock: Number(data.stock) || 0,
  price: parseBRLToNumber(data.price),
  status: data.status,
  image: data.image || "",
  description: data.description || "",
});

const normalizeStock = (s: Stock): Stock => ({
  ...s,
  status: normalizeStatus(s.status),
});

class StorageService implements IStorageService {
  getAll() {
    return api
      .get<ApiResponse<Stock[]>>("/api/storage")
      .then((r) => (r.data.data ?? []).map(normalizeStock));
  }

  getById(id: string) {
    return api
      .get<ApiResponse<Stock>>(`/api/storage/${id}`)
      .then((r) => normalizeStock(r.data.data));
  }

  create(data: ProductFormData) {
    return api
      .post<ApiResponse<Stock>>("/api/storage", toBody(data))
      .then((r) => normalizeStock(r.data.data));
  }

  update(id: string, data: ProductFormData) {
    return api
      .put<ApiResponse<Stock>>(`/api/storage/${id}`, toBody(data))
      .then((r) => normalizeStock(r.data.data));
  }

  async remove(id: string) {
    await api.delete(`/api/storage/${id}`);
  }
}

export const storageService = new StorageService();
