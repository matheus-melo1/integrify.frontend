import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import GradientBorder from "@/shared/components/molecules/GradientBorder/GradientBorder";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ROUTES } from "@/app/router/routes";
import { IntegrationCard } from "../molecules/IntegrationCard";
import type { Integration } from "../../types/integration.types";

type Props = {
  integrations: Integration[];
  isLoading?: boolean;
};

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 flex flex-col gap-4 min-h-[180px]">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-20 rounded-lg" />
        </div>
        <Skeleton className="size-7 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="flex flex-col gap-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
      <div className="pt-3 border-t border-neutral-700/60">
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
    </div>
  );
}

function AddCard() {
  return (
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
  );
}

export function IntegrationsGrid({ integrations, isLoading }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {isLoading ? (
        Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
      ) : (
        <>
          {integrations.map((i) => (
            <IntegrationCard key={i.id} integration={i} />
          ))}
          <AddCard />
        </>
      )}
    </div>
  );
}
