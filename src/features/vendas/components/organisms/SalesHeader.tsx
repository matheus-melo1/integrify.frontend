import { Download, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ShimmerButton } from "@/shared/components/ui/shimmer-button";

export function SalesHeader() {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-2xl font-light">Vendas</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Acompanhe os pedidos de todos os seus marketplaces.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="h-9 text-xs gap-2 bg-neutral-900 border-neutral-800"
        >
          <Download size={14} />
          Exportar
        </Button>
        <ShimmerButton className="h-9 px-4 py-0 text-xs gap-2 [--radius:0.5rem]">
          <Plus size={14} />
          Nova venda
        </ShimmerButton>
      </div>
    </div>
  );
}
