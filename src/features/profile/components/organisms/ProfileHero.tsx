import { Pencil, Share2 } from "lucide-react";
import GradientBorder from "@/shared/components/molecules/GradientBorder/GradientBorder";
import { GradientBadge } from "@/shared/components/molecules/GradientBadge/GradientBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { ShimmerButton } from "@/shared/components/ui/shimmer-button";
import { cn } from "@/shared/lib/utils";
import { AchievementBadge } from "../molecules/AchievementBadge";
import { ProfileStats } from "./ProfileStats";
import { EditProfileDrawer } from "./EditProfileDrawer";
import type { Profile } from "../../types/profile.types";

const initialsOf = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "?";

type Props = {
  profile: Profile;
  isMobile: boolean;
};

export function ProfileHero({ profile, isMobile }: Props) {
  const editButton = (
    <ShimmerButton
      className={cn(
        "h-9 px-4 py-0 text-xs gap-2 [--radius:0.5rem]",
        isMobile ? "w-full" : "w-auto",
      )}
    >
      <Pencil size={14} />
      Editar perfil
    </ShimmerButton>
  );

  return (
    <GradientBorder className="p-[0.8px]! rounded-3xl! from-white/15 via-white/5 to-white/15">
      <div
        className={cn(
          "rounded-3xl bg-neutral-900/80",
          isMobile ? "p-5" : "p-6",
        )}
      >
        {isMobile ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <GradientBorder className="p-[1.2px]! rounded-full! w-fit! h-fit! from-white/40! via-white/10! to-white/30!">
              <Avatar className="size-20!">
                <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                <AvatarFallback>{initialsOf(profile.name)}</AvatarFallback>
              </Avatar>
            </GradientBorder>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-light">{profile.name}</h1>
                {profile.plan === "pro" && (
                  <GradientBadge color="purple">PRO</GradientBadge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {profile.headline} · {profile.location}
              </p>
            </div>
            <EditProfileDrawer>{editButton}</EditProfileDrawer>
          </div>
        ) : (
          <div className="relative flex items-center gap-6">
            <div className="absolute top-0 right-0 flex items-center gap-2">
              {profile.achievements.map((a) => (
                <AchievementBadge
                  key={a.id}
                  count={a.count}
                  label={a.label}
                  accent={a.accent}
                />
              ))}
            </div>

            <GradientBorder className="p-[1.2px]! rounded-full! w-fit! h-fit! shrink-0 from-white/40! via-white/10! to-white/30!">
              <Avatar className="size-32!">
                <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                <AvatarFallback className="text-2xl">
                  {initialsOf(profile.name)}
                </AvatarFallback>
              </Avatar>
            </GradientBorder>

            <div className="flex flex-col gap-3 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-light truncate">{profile.name}</h1>
                {profile.plan === "pro" && (
                  <GradientBadge color="purple">PRO</GradientBadge>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {profile.headline}
                <br />
                {profile.location}
              </p>
              <div className="flex items-center gap-2">
                <EditProfileDrawer>{editButton}</EditProfileDrawer>
                <Button
                  variant="outline"
                  className="h-9 text-xs gap-2 bg-neutral-900 border-neutral-800"
                >
                  <Share2 size={14} />
                  Compartilhar
                </Button>
              </div>
            </div>

            <div className="shrink-0 self-end">
              <ProfileStats profile={profile} />
            </div>
          </div>
        )}
      </div>
    </GradientBorder>
  );
}
