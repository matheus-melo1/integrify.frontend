import { Outlet } from "react-router-dom";
import { Sidebar } from "@/shared/components/organisms/Sidebar/Sidebar";
import { Header } from "@/shared/components/organisms/Header/Header";
import { useUIStore } from "@/store/useUIStore";

export const MainLayout = () => {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  return (
    <div className="flex h-screen">
      <Sidebar open={sidebarOpen} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
