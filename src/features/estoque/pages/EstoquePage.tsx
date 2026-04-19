import { useState } from "react";
import { useStockList } from "../hooks/useStockList";
import {
  EstoqueHeader,
  type StockViewMode,
} from "../components/organisms/EstoqueHeader";
import { EstoqueTableView } from "../components/organisms/EstoqueTableView";
import { EstoqueCardsView } from "../components/organisms/EstoqueCardsView";

const EstoquePage = () => {
  const [viewMode, setViewMode] = useState<StockViewMode>("table");
  const list = useStockList();

  return (
    <div className="h-full w-full flex flex-col gap-4">
      <EstoqueHeader viewMode={viewMode} onViewModeChange={setViewMode} />
      <div className="flex-1 min-h-0">
        {viewMode === "table" ? (
          <EstoqueTableView list={list} />
        ) : (
          <EstoqueCardsView list={list} />
        )}
      </div>
    </div>
  );
};

export default EstoquePage;
