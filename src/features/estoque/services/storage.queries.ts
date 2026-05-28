import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storageService } from "./storage.service";
import type { ProductFormData } from "../schemas/product.schema";

export const STORAGE_KEY = ["storage"] as const;

export const useStoragesQuery = () =>
  useQuery({
    queryKey: STORAGE_KEY,
    queryFn: () => storageService.getAll(),
  });

export const useStorageQuery = (id: string) =>
  useQuery({
    queryKey: [...STORAGE_KEY, id],
    queryFn: () => storageService.getById(id),
    enabled: !!id,
  });

export const useCreateStorageMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductFormData) => storageService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: STORAGE_KEY }),
  });
};

export const useUpdateStorageMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductFormData }) =>
      storageService.update(id, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: STORAGE_KEY });
      qc.invalidateQueries({ queryKey: [...STORAGE_KEY, variables.id] });
    },
  });
};

export const useDeleteStorageMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => storageService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: STORAGE_KEY }),
  });
};
