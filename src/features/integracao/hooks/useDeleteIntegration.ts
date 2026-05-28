import { useDeleteIntegrationMutation } from "../services/integration.queries";

export const useDeleteIntegration = () => {
  const { mutate, isPending } = useDeleteIntegrationMutation();
  return { remove: mutate, isDeleting: isPending };
};
