import { Download, LayoutGrid, Plus, TableProperties } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { ShimmerButton } from "@/shared/components/ui/shimmer-button";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/shared/components/ui/toggle-group";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { ROUTES } from "@/app/router/routes";
import { NewProductDrawer } from "./NewProductDrawer";

export type StockViewMode = "table" | "cards";

type Props = {
  viewMode: StockViewMode;
  onViewModeChange: (v: StockViewMode) => void;
};

export function EstoqueHeader({ viewMode, onViewModeChange }: Props) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const newProductButton = (
    <ShimmerButton
      onClick={isMobile ? undefined : () => navigate(ROUTES.ESTOQUE_NEW)}
      className="h-9 px-4 py-0 text-xs gap-2 [--radius:0.5rem] flex-1 md:flex-none"
    >
      <Plus size={14} />
      Novo produto
    </ShimmerButton>
  );

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div>
        <h2 className="text-2xl font-light">Estoque</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Gerencie os produtos e disponibilidade em todos os marketplaces.
        </p>
      </div>
      <div className="flex items-center gap-2 w-full md:w-auto">
        <ToggleGroup
          value={[viewMode]}
          onValueChange={(values) => {
            const next = values[0] as StockViewMode | undefined;
            if (next) onViewModeChange(next);
          }}
          className="h-9 bg-neutral-900 border border-neutral-800 rounded-lg p-0.5 hidden md:flex"
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
          aria-label="Exportar"
          className="h-9 text-xs gap-2 bg-neutral-900 border-neutral-800 px-2.5 md:px-3"
        >
          <Download size={14} />
          <span className="hidden md:inline">Exportar</span>
        </Button>

        {isMobile ? (
          <NewProductDrawer>{newProductButton}</NewProductDrawer>
        ) : (
          newProductButton
        )}
      </div>
    </div>
  );
}
