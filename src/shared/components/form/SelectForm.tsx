import { Label } from "@/shared/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";
import { Check, ChevronDown, CircleX, type LucideIcon } from "lucide-react";
import { createElement } from "react";
import {
  type FieldValues,
  type Path,
  type Control,
  Controller,
} from "react-hook-form";

export type SelectFormSize = "default" | "compact";

export type SelectFormOption = {
  value: string;
  label: string;
};

type SelectFormProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  options: SelectFormOption[];
  label?: string;
  placeholder?: string;
  className?: string;
  icon?: LucideIcon;
  size?: SelectFormSize;
  disabled?: boolean;
};

export const SelectForm = <T extends FieldValues>({
  name,
  control,
  options,
  label,
  placeholder,
  icon,
  className,
  size = "default",
  disabled,
}: SelectFormProps<T>) => {
  const compact = size === "compact";

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selected = options.find((o) => o.value === field.value);
        return (
          <div className="relative">
            {label && (
              <Label
                htmlFor={name}
                className={cn(
                  "absolute flex items-center gap-1.5 z-10 pointer-events-none",
                  compact
                    ? "top-2 left-3 text-[11px] text-muted-foreground"
                    : "top-3 left-4",
                  fieldState.error && "text-red-500!",
                )}
              >
                {fieldState.error ? (
                  <CircleX className={cn(compact ? "h-3 w-3" : "h-4 w-4")} />
                ) : (
                  icon &&
                  createElement(icon, {
                    className: cn(compact ? "w-3 h-3" : "w-4 h-4"),
                  })
                )}
                {fieldState.error ? fieldState.error.message : label}
              </Label>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger
                id={name}
                disabled={disabled}
                className={cn(
                  "flex w-full items-center justify-between gap-2 border border-input outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[popup-open]:border-ring",
                  compact
                    ? "bg-neutral-900/50 px-3 py-2.5 pt-7 text-sm rounded-lg"
                    : "bg-neutral-900 px-4 py-6 pt-12 text-lg rounded-lg",
                  fieldState.error && "border-red-500",
                  !selected && "text-muted-foreground",
                  className,
                )}
              >
                <span
                  className={cn(
                    "flex-1 text-left truncate",
                    selected ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {selected?.label ?? placeholder}
                </span>
                <ChevronDown
                  className={cn(
                    "shrink-0 text-muted-foreground",
                    compact ? "w-4 h-4" : "w-5 h-5",
                  )}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={6}
                className="min-w-(--anchor-width) max-h-64"
              >
                {options.map((o) => {
                  const isActive = o.value === field.value;
                  return (
                    <DropdownMenuItem
                      key={o.value}
                      onClick={() => field.onChange(o.value)}
                      className={cn(
                        "justify-between gap-2 px-2 py-1.5 text-sm",
                        isActive && "bg-accent/40 text-accent-foreground",
                      )}
                    >
                      <span className="truncate">{o.label}</span>
                      {isActive && (
                        <Check className="w-4 h-4 text-primary shrink-0" />
                      )}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      }}
    />
  );
};
