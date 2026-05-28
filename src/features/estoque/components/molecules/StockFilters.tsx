import { ChevronDown, Search } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import type { StockStatus } from "../../types/stock.types";

const STATUS_LABELS: Record<string, string> = {
  all: "Todos os status",
  active: "Ativo",
  low: "Estoque baixo",
  "out-of-stock": "Esgotado",
  paused: "Pausado",
};

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  status: StockStatus | "all";
  onStatusChange: (v: StockStatus | "all") => void;
};

export function StockFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: Props) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center">
      <div className="relative w-full md:flex-1 md:min-w-[220px]">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por produto ou SKU..."
          className="pl-9 h-9 bg-neutral-900 border-neutral-800 text-sm"
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              className="w-full md:w-[160px] h-9 text-xs bg-neutral-900 border-neutral-800 justify-between font-normal"
            />
          }
        >
          <span className="truncate">{STATUS_LABELS[status]}</span>
          <ChevronDown size={14} className="opacity-50 shrink-0" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={6}
          className="min-w-(--anchor-width)"
        >
          <DropdownMenuRadioGroup
            value={status}
            onValueChange={(v) => onStatusChange(v as StockStatus | "all")}
          >
            <DropdownMenuRadioItem value="all">
              Todos os status
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="active">Ativo</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="low">
              Estoque baixo
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="out-of-stock">
              Esgotado
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="paused">
              Pausado
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
