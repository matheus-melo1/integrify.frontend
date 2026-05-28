import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ShimmerButton } from "@/shared/components/ui/shimmer-button";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { ROUTES } from "@/app/router/routes";
import { NewIntegrationDrawer } from "./NewIntegrationDrawer";

type Props = {
  total: number;
  connected: number;
  issues: number;
};

export function IntegrationsHeader({ total, connected, issues }: Props) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const newIntegrationButton = (
    <ShimmerButton
      onClick={isMobile ? undefined : () => navigate(ROUTES.INTEGRACAO_NEW)}
      className="h-9 px-4 py-0 text-xs gap-2 [--radius:0.5rem] w-full md:w-auto"
    >
      <Plus size={14} />
      Nova integração
    </ShimmerButton>
  );

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div>
        <h2 className="text-2xl font-light">Integrações</h2>
        <p className="text-xs text-muted-foreground mt-1">
          {total} conectadas · {connected} ativas · {issues} com atenção
        </p>
      </div>
      {isMobile ? (
        <NewIntegrationDrawer>{newIntegrationButton}</NewIntegrationDrawer>
      ) : (
        newIntegrationButton
      )}
    </div>
  );
}
