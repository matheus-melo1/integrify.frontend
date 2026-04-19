import { Download, LayoutGrid, Plus, TableProperties } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { ShimmerButton } from "@/shared/components/ui/shimmer-button";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/shared/components/ui/toggle-group";
import { ROUTES } from "@/app/router/routes";

export type StockViewMode = "table" | "cards";

type Props = {
  viewMode: StockViewMode;
  onViewModeChange: (v: StockViewMode) => void;
};

export function EstoqueHeader({ viewMode, onViewModeChange }: Props) {
  const navigate = useNavigate();
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-2xl font-light">Estoque</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Gerencie os produtos e disponibilidade em todos os marketplaces.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <ToggleGroup
          value={[viewMode]}
          onValueChange={(values) => {
            const next = values[0] as StockViewMode | undefined;
            if (next) onViewModeChange(next);
          }}
          className="h-9 bg-neutral-900 border border-neutral-800 rounded-lg p-0.5"
        >
          <ToggleGroupItem
            value="table"
            aria-label="Visualização em tabela"
            className="h-8 text-xs gap-1.5 px-2.5"
          >
            <TableProperties size={14} />
            Tabela
          </ToggleGroupItem>
          <ToggleGroupItem
            value="cards"
            aria-label="Visualização em cards"
            className="h-8 text-xs gap-1.5 px-2.5"
          >
            <LayoutGrid size={14} />
            Cards
          </ToggleGroupItem>
        </ToggleGroup>

        <Button
          variant="outline"
          className="h-9 text-xs gap-2 bg-neutral-900 border-neutral-800"
        >
          <Download size={14} />
          Exportar
        </Button>
        <ShimmerButton
          onClick={() => navigate(ROUTES.ESTOQUE_NEW)}
          className="h-9 px-4 py-0 text-xs gap-2 [--radius:0.5rem]"
        >
          <Plus size={14} />
          Novo produto
        </ShimmerButton>
      </div>
    </div>
  );
}
