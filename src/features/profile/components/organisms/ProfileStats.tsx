import GradientBorder from "@/shared/components/molecules/GradientBorder/GradientBorder";
import { cn } from "@/shared/lib/utils";
import type { Profile } from "../../types/profile.types";

const formatNumber = (n: number) => new Intl.NumberFormat("pt-BR").format(n);

type Props = {
  profile: Profile;
  compact?: boolean;
};

const ENTRIES = [
  { key: "followers", label: "Seguidores" },
  { key: "following", label: "Seguindo" },
  { key: "likes", label: "Curtidas" },
] as const;

function StatRow({ profile, compact }: Required<Props>) {
  return (
    <div
      className={cn(
        "flex items-end",
        compact ? "justify-around gap-3 px-4 py-4" : "gap-8",
      )}
    >
      {ENTRIES.map((entry) => (
        <div
          key={entry.key}
          className={cn(
            "flex flex-col gap-0.5",
            compact && "items-center text-center",
          )}
        >
          <span
            className={cn(
              "text-muted-foreground uppercase tracking-wide",
              compact ? "text-[10px]" : "text-[11px]",
            )}
          >
            {entry.label}
          </span>
          <span
            className={cn(
              "font-light tabular-nums",
              compact ? "text-xl" : "text-2xl",
            )}
          >
            {formatNumber(profile.stats[entry.key])}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ProfileStats({ profile, compact = false }: Props) {
  if (!compact) return <StatRow profile={profile} compact={false} />;

  return (
    <GradientBorder className="p-[0.8px]! rounded-3xl! from-white/15 via-white/5 to-white/15">
      <div className="rounded-3xl bg-neutral-900/80">
        <StatRow profile={profile} compact />
      </div>
    </GradientBorder>
  );
}
