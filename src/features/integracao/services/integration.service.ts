import { api } from "@/shared/lib/axios";
import type { ApiResponse } from "@/shared/types/api.types";
import type { Integration, IntegrationRequest } from "../types/integration.types";

interface IIntegrationService {
  list(): Promise<Integration[]>;
  getById(id: string): Promise<Integration>;
  create(body: IntegrationRequest): Promise<Integration>;
  update(id: string, body: IntegrationRequest): Promise<void>;
  remove(id: string): Promise<void>;
}

const unwrap = <T>(envelope: ApiResponse<T>): T => {
  if (!envelope.success) {
    throw new Error(envelope.error ?? "Erro desconhecido");
  }
  return envelope.data;
};

class IntegrationService implements IIntegrationService {
  list() {
    return api
      .get<ApiResponse<Integration[] | null>>("/integration")
      .then((r) => unwrap(r.data) ?? []);
  }

  getById(id: string) {
    return api
      .get<ApiResponse<Integration>>(`/integration/${id}`)
      .then((r) => unwrap(r.data));
  }

  create(body: IntegrationRequest) {
    return api
      .post<ApiResponse<Integration>>("/integration", body)
      .then((r) => unwrap(r.data));
  }

  update(id: string, body: IntegrationRequest) {
    return api
      .put<ApiResponse<null>>(`/integration/${id}`, body)
      .then((r) => {
        unwrap(r.data);
      });
  }

  remove(id: string) {
    return api
      .delete<ApiResponse<null>>(`/integration/${id}`)
      .then((r) => {
        unwrap(r.data);
      });
  }
}

export const integrationService = new IntegrationService();
