import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { CircleX, type LucideIcon } from "lucide-react";
import { createElement } from "react";
import { cn } from "@/shared/lib/utils";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export type TextareaFormSize = "default" | "compact";

type TextareaFormProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  icon?: LucideIcon;
  className?: string;
  rows?: number;
  size?: TextareaFormSize;
};

export const TextareaForm = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  icon,
  disabled,
  className,
  rows = 4,
  size = "default",
}: TextareaFormProps<T>) => {
  const compact = size === "compact";
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="relative">
          {label && (
            <Label
              htmlFor={name}
              className={cn(
                "absolute flex items-center gap-1.5 z-10 pointer-events-none",
                compact
                  ? "top-2 left-3 text-[11px] text-muted-foreground"
                  : "top-3 left-3.5",
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

          <Textarea
            id={name}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            {...field}
            value={field.value ?? ""}
            className={cn(
              compact
                ? "text-sm! px-3 py-2.5! pt-7! bg-neutral-950/50 border-neutral-800 rounded-lg resize-none break-all [overflow-wrap:anywhere]"
                : "text-base! px-4 py-4! pt-10! bg-background resize-none break-all [overflow-wrap:anywhere]",
              fieldState.error && "border-red-500!",
              className,
            )}
          />
        </div>
      )}
    />
  );
};
