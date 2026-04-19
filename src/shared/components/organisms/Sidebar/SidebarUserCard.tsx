import { ChevronDown } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import GradientBorder from "../../molecules/GradientBorder/GradientBorder";
import { SidebarUserDropdown } from "./SidebarUserDropdown";
import { useSidebarUserMenu } from "@/shared/hooks/useSidebarUserMenu";

type Props = {
  name: string;
};

export function SidebarUserCard({ name }: Props) {
  const { items } = useSidebarUserMenu();

  return (
    <SidebarUserDropdown
      items={items}
      trigger={
        <GradientBorder className="p-[1px] !rounded-2xl! cursor-pointer">
          <div className="group w-full h-full bg-background flex items-center justify-between p-2.5 rounded-full transition-all duration-200 hover:bg-neutral-900/60">
            <div className="flex items-center gap-2.5">
              <GradientBorder className="p-[0.2px] from-white/20 via-white/15 to-white/20 w-auto rounded-xl">
                <FaUserCircle size={30} className="text-zinc-900" />
              </GradientBorder>
              <p className="font-normal truncate">{name}</p>
            </div>

            <GradientBorder className="p-[0.2px] from-white/20 via-white/5 to-white/20 w-auto rounded-xl">
              <span className="flex items-center justify-center size-9 rounded-xl bg-background group-hover:bg-neutral-900/60">
                <ChevronDown size={20} />
              </span>
            </GradientBorder>
          </div>
        </GradientBorder>
      }
    />
  );
}
