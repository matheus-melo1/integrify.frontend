import { useMemo } from "react";
import { useIntegrationsQuery } from "../services/integration.queries";

export const useIntegrations = () => {
  const { data, isLoading, isError, refetch } = useIntegrationsQuery();
  const integrations = data ?? [];

  const stats = useMemo(
    () => ({
      total: integrations.length,
      connected: integrations.filter((i) => i.status === "connected").length,
      issues: integrations.filter(
        (i) => i.status === "error" || i.status === "disconnected",
      ).length,
    }),
    [integrations],
  );

  return { integrations, stats, isLoading, isError, refetch };
};
