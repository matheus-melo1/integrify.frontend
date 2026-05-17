import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { integrationService } from "./integration.service";
import type { IntegrationRequest } from "../types/integration.types";

export const integrationKeys = {
  all: ["integrations"] as const,
  detail: (id: string) => ["integrations", id] as const,
};

const errorMessage = (e: unknown) =>
  e instanceof Error ? e.message : "Algo deu errado";

export const useIntegrationsQuery = () =>
  useQuery({
    queryKey: integrationKeys.all,
    queryFn: () => integrationService.list(),
  });

export const useIntegrationQuery = (id: string | undefined) =>
  useQuery({
    queryKey: integrationKeys.detail(id ?? ""),
    queryFn: () => integrationService.getById(id!),
    enabled: !!id,
  });

export const useCreateIntegrationMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: IntegrationRequest) => integrationService.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: integrationKeys.all });
      toast.success("Integração criada");
    },
    onError: (e) => toast.error(errorMessage(e)),
  });
};

export const useUpdateIntegrationMutation = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: IntegrationRequest) => integrationService.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: integrationKeys.all });
      qc.invalidateQueries({ queryKey: integrationKeys.detail(id) });
      toast.success("Integração atualizada");
    },
    onError: (e) => toast.error(errorMessage(e)),
  });
};

export const useDeleteIntegrationMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => integrationService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: integrationKeys.all });
      toast.success("Integração removida");
    },
    onError: (e) => toast.error(errorMessage(e)),
  });
};
