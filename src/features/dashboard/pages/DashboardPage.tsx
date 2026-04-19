import { StoresAccessHeader } from "../components/organisms/StoresAccessHeader";
import { OverviewCard } from "../components/organisms/OverviewCard";
import { RevenueCard } from "../components/organisms/RevenueCard";
import { TopStoresCarousel } from "../components/organisms/TopStoresCarousel";
import { PopularAdsTable } from "../components/organisms/PopularAdsTable";

const DashboardPage = () => (
  <div className="min-h-full w-full flex flex-col gap-4">
    <StoresAccessHeader />

    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
      <div className="lg:col-span-4 min-h-0">
        <OverviewCard />
      </div>

      <div className="lg:col-span-8 min-h-0">
        <RevenueCard />
      </div>
    </div>

    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
      <div className="lg:col-span-4 min-h-0">
        <TopStoresCarousel />
      </div>
      <div className="lg:col-span-8 min-h-0">
        <PopularAdsTable />
      </div>
    </div>
  </div>
);

export default DashboardPage;
