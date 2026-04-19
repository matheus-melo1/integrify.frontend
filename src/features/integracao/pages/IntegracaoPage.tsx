import { IntegrationsHeader } from "../components/organisms/IntegrationsHeader";
import { IntegrationsGrid } from "../components/organisms/IntegrationsGrid";
import { useIntegrations } from "../hooks/useIntegrations";

const IntegracaoPage = () => {
  const { integrations, stats } = useIntegrations();

  return (
    <div className="min-h-full w-full flex flex-col gap-6">
      <IntegrationsHeader
        total={stats.total}
        connected={stats.connected}
        issues={stats.issues}
      />
      <IntegrationsGrid integrations={integrations} />
    </div>
  );
};

export default IntegracaoPage;
