import { SalesHeader } from "../components/organisms/SalesHeader";
import { SalesKpis } from "../components/organisms/SalesKpis";
import { SalesTable } from "../components/organisms/SalesTable";

const VendasPage = () => (
  <div className="h-full w-full flex flex-col gap-4">
    <SalesHeader />
    <SalesKpis />
    <div className="flex-1 min-h-0">
      <SalesTable />
    </div>
  </div>
);

export default VendasPage;
