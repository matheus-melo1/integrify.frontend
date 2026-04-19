import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ShimmerButton } from "@/shared/components/ui/shimmer-button";
import { ROUTES } from "@/app/router/routes";

type Props = {
  total: number;
  connected: number;
  issues: number;
};

export function IntegrationsHeader({ total, connected, issues }: Props) {
  const navigate = useNavigate();
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-2xl font-light">Integrações</h2>
        <p className="text-xs text-muted-foreground mt-1">
          {total} conectadas · {connected} ativas · {issues} com atenção
        </p>
      </div>
      <ShimmerButton
        onClick={() => navigate(ROUTES.INTEGRACAO_NEW)}
        className="h-9 px-4 py-0 text-xs gap-2 [--radius:0.5rem]"
      >
        <Plus size={14} />
        Nova integração
      </ShimmerButton>
    </div>
  );
}
