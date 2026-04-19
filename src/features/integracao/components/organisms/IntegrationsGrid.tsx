import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import GradientBorder from "@/shared/components/molecules/GradientBorder/GradientBorder";
import { ROUTES } from "@/app/router/routes";
import { IntegrationCard } from "../molecules/IntegrationCard";
import type { Integration } from "../../types/integration.types";

type Props = {
  integrations: Integration[];
};

export function IntegrationsGrid({ integrations }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {integrations.map((i) => (
        <IntegrationCard key={i.id} integration={i} />
      ))}
      <Link to={ROUTES.INTEGRACAO_NEW} className="flex">
        <GradientBorder className="p-[0.8px]! rounded-2xl! from-white/15! via-white/5! to-white/15! flex-1">
          <div className="bg-neutral-900/60 hover:bg-neutral-800/60 transition-colors rounded-2xl p-5 h-full w-full min-h-[180px] flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground">
            <span className="size-10 rounded-full bg-neutral-800 flex items-center justify-center">
              <Plus size={18} />
            </span>
            <span className="text-sm">Nova integração</span>
          </div>
        </GradientBorder>
      </Link>
    </div>
  );
}
