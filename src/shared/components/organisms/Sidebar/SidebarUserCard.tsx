import { ChevronDown } from "lucide-react";
import GradientBorder from "../../molecules/GradientBorder/GradientBorder";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { SidebarUserDropdown } from "./SidebarUserDropdown";
import { useSidebarUserMenu } from "@/shared/hooks/useSidebarUserMenu";

const AVATAR_URL =
  "https://img.icons8.com/liquid-glass/96/user-male-circle.png";

const initialsOf = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "?";

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
            <div className="flex items-center gap-2.5 min-w-0">
              <GradientBorder className="p-[1px]! w-fit! h-fit! from-white/40! via-neutral-900/40! to-white/30!">
                <Avatar className="size-8!">
                  <AvatarImage src={AVATAR_URL} alt={name} />
                  <AvatarFallback>{initialsOf(name)}</AvatarFallback>
                </Avatar>
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
