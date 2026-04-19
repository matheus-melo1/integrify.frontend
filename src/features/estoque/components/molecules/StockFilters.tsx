import { Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { Marketplace } from "@/shared/types/marketplace.types";
import type { StockStatus } from "../../types/stock.types";

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  marketplace: Marketplace | "all";
  onMarketplaceChange: (v: Marketplace | "all") => void;
  status: StockStatus | "all";
  onStatusChange: (v: StockStatus | "all") => void;
};

export function StockFilters({
  search,
  onSearchChange,
  marketplace,
  onMarketplaceChange,
  status,
  onStatusChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="relative flex-1 min-w-[220px]">
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

      <Select
        value={marketplace}
        onValueChange={(v) => onMarketplaceChange(v as Marketplace | "all")}
      >
        <SelectTrigger className="w-[160px] h-9 text-xs bg-neutral-900 border-neutral-800">
          <SelectValue placeholder="Marketplace" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os marketplaces</SelectItem>
          <SelectItem value="mercado-livre">Mercado Livre</SelectItem>
          <SelectItem value="shopee">Shopee</SelectItem>
          <SelectItem value="amazon">Amazon</SelectItem>
          <SelectItem value="amazon-us">Amazon US</SelectItem>
          <SelectItem value="magalu">Magalu</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={status}
        onValueChange={(v) => onStatusChange(v as StockStatus | "all")}
      >
        <SelectTrigger className="w-[160px] h-9 text-xs bg-neutral-900 border-neutral-800">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="active">Ativo</SelectItem>
          <SelectItem value="low">Estoque baixo</SelectItem>
          <SelectItem value="out-of-stock">Esgotado</SelectItem>
          <SelectItem value="paused">Pausado</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
