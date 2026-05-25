import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type Props = {
  icon: LucideIcon;
  label: string;
  description?: string;
  trailing?: React.ReactNode;
  onClick?: () => void;
  asButton?: boolean;
};

export function ProfileMenuItem({
  icon: Icon,
  label,
  description,
  trailing,
  onClick,
  asButton = true,
}: Props) {
  const content = (
    <>
      <span className="size-9 rounded-xl bg-neutral-800 flex items-center justify-center text-muted-foreground shrink-0">
        <Icon size={16} />
      </span>
      <div className="flex flex-col gap-0.5 min-w-0 flex-1 text-left">
        <span className="text-sm font-medium">{label}</span>
        {description && (
          <span className="text-[11px] text-muted-foreground line-clamp-1">
            {description}
          </span>
        )}
      </div>
      <span className="shrink-0 text-muted-foreground">
        {trailing ?? <ChevronRight size={16} />}
      </span>
    </>
  );

  const baseClass = cn(
    "w-full flex items-center gap-3 px-4 py-3 transition-colors",
    asButton && "hover:bg-white/5 active:bg-white/10",
  );

  if (asButton) {
    return (
      <button type="button" className={baseClass} onClick={onClick}>
        {content}
      </button>
    );
  }

  return <div className={baseClass}>{content}</div>;
}
