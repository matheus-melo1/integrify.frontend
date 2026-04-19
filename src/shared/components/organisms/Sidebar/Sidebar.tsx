import { useState } from "react";
import { useLocation } from "react-router-dom";
import { LayoutGroup } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { protectedRoutes } from "@/app/router/protectedRoutes";
import { SidebarNavItem } from "./SidebarNavItem";
import { SidebarUserCard } from "./SidebarUserCard";
import Logo from "../../molecules/Logo/Logo";

export function Sidebar() {
  const [open] = useState(true);
  const { pathname } = useLocation();

  return (
    <div className="h-full max-sm:h-fit max-md:p-0">
      <nav
        className={cn(
          open ? "w-60" : "w-[4.7rem] max-md:w-fit",
          "h-full py-4 px-3 transition-all overflow-hidden flex flex-col max-md:z-[9999] max-md:h-fit max-md:rounded-full max-md:left-1/2 max-md:-translate-x-1/2 max-md:flex-row max-md:fixed max-md:bottom-10 max-md:shadow-lg max-md:border",
        )}
      >
        <div className="px-2 py-2 h-full flex flex-col justify-between gap-1.5 max-md:flex-row">
          <div className="w-full flex flex-col items-start gap-1.5 max-md:flex-row">
            <Logo />

            <LayoutGroup>
              {protectedRoutes.map((route) => (
                <SidebarNavItem
                  key={route.path}
                  route={route}
                  open={open}
                  isSelected={pathname === route.path}
                />
              ))}
            </LayoutGroup>
          </div>

          <div className="flex flex-col gap-2">
            <SidebarUserCard name="Matheus" />
          </div>
        </div>
      </nav>
    </div>
  );
}
