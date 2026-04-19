import { cn } from "@/shared/lib/utils";
import type { Member } from "@/shared/types/marketplace.types";

type Props = {
  members: Member[];
  max?: number;
  size?: "sm" | "md";
  className?: string;
};

const SIZES = {
  sm: "size-6 text-[10px]",
  md: "size-8 text-xs",
} as const;

export function AvatarStack({
  members,
  max = 3,
  size = "sm",
  className,
}: Props) {
  const visible = members.slice(0, max);
  const overflow = Math.max(0, members.length - max);

  return (
    <div className={cn("flex items-center -space-x-2", className)}>
      {visible.map((m) => (
        <div
          key={m.id}
          className={cn(
            SIZES[size],
            "rounded-full border-2 border-neutral-900 bg-neutral-700 text-white flex items-center justify-center font-medium uppercase",
          )}
        >
          {m.name[0]}
        </div>
      ))}
      {overflow > 0 && (
        <div
          className={cn(
            SIZES[size],
            "rounded-full border-2 border-neutral-900 bg-neutral-800 text-muted-foreground flex items-center justify-center font-medium",
          )}
        >
          +{overflow > 99 ? "99" : overflow}
        </div>
      )}
    </div>
  );
}
