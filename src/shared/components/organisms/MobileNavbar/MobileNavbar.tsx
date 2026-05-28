import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ChevronsUpDown } from "lucide-react";
import {
  protectedRoutes,
  protectedRoutesAboutUsers,
} from "@/app/router/protectedRoutes";
import { ROUTES } from "@/app/router/routes";
import { MobileNavItem } from "./MobileNavItem";
import GradientBorder from "../../molecules/GradientBorder/GradientBorder";
import { cn } from "@/shared/lib/cn";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

const PRIMARY_COUNT = 2;

export function MobileNavbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [expanded, setExpanded] = useState(false);

  const primary = protectedRoutes.slice(0, PRIMARY_COUNT);
  const overflow = [
    ...protectedRoutes.slice(PRIMARY_COUNT),
    ...protectedRoutesAboutUsers,
  ];

  const activeOverflow = overflow.find((r) => r.path === pathname);
  const MoreIcon = activeOverflow?.icon ?? ChevronsUpDown;

  const handleNavigate = (path: string) => {
    navigate(path);
    setExpanded(false);
  };

  return (
    <>
      <motion.nav
        layout
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        className={cn(
          expanded ? "rounded-xl" : "rounded-3xl",
          "fixed bottom-6 left-1/2 z-[20] transition-all duration-300 flex -translate-x-1/2 flex-col items-center gap-1 border border-white/15 bg-neutral-900/65 p-1.5 shadow-2xl shadow-black/70 backdrop-blur ring-1 ring-black/40",
        )}
      >
        <LayoutGroup>
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="overflow"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="flex w-full min-w-44 flex-col items-stretch gap-1 overflow-hidden"
              >
                {overflow.map((route) => (
                  <MobileNavItem
                    key={route.path}
                    icon={route.icon}
                    label={route.name}
                    isSelected={pathname === route.path}
                    onClick={() => handleNavigate(route.path)}
                    showLabel
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-1">
            {primary.map((route) => (
              <MobileNavItem
                key={route.path}
                icon={route.icon}
                label={route.name}
                isSelected={pathname === route.path}
                onClick={() => handleNavigate(route.path)}
              />
            ))}
            <MobileNavItem
              icon={MoreIcon}
              endIcon={activeOverflow ? ChevronsUpDown : undefined}
              label={activeOverflow?.name ?? "More"}
              isSelected={expanded || !!activeOverflow}
              onClick={() => setExpanded((v) => !v)}
            />
            {/* <GradientBorder className="p-0"> */}
            {/*   <MobileNavItem */}
            {/*     icon={Plus} */}
            {/*     label="Add" */}
            {/*     isSelected={false} */}
            {/*     className="bg-neutral-900/65" */}
            {/*     onClick={() => {}} */}
            {/*   /> */}
            {/* </GradientBorder> */}

            <Link
              to={ROUTES.PROFILE}
              aria-label="Abrir perfil"
              onClick={() => setExpanded(false)}
            >
              <GradientBorder className="p-[1.2px] from-white/40! via-neutral-900/40!  to-white/30!">
                <Avatar className={"w-11.5! h-11.5!"}>
                  <AvatarImage
                    src="https://i.pinimg.com/originals/0e/99/fb/0e99fb7da38a7d3bd2062895f9e07741.gif"
                    alt="profile_pic"
                  />
                  <AvatarFallback>MA</AvatarFallback>
                </Avatar>
              </GradientBorder>
            </Link>
          </div>
        </LayoutGroup>
      </motion.nav>
    </>
  );
}
