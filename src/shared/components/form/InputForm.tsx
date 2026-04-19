import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { formatCEP } from "@/shared/utils/format-cep";
import { formatCNPJ } from "@/shared/utils/format-cnpj";
import { formatCPF } from "@/shared/utils/format-cpf";
import { formatPhone } from "@/shared/utils/format-phone";
import { formatRG } from "@/shared/utils/format-rg";
import { cn } from "@/shared/lib/utils";
import { formatPriceInput } from "@/shared/utils/format-price";
import { formatCardNumber } from "@/shared/utils/format-card-number";
import { formatCardValidity } from "@/shared/utils/format-card-validity";
import { formatCardCvv } from "@/shared/utils/format-card-cvv";
import { CircleX, Eye, EyeOff, type LucideIcon } from "lucide-react";
import { createElement, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export type InputFormat =
  | "phone"
  | "cnpj"
  | "cpf"
  | "cep"
  | "rg"
  | "money"
  | "cardNumber"
  | "cardValidity"
  | "cardCvv";

export type InputFormSize = "default" | "large" | "compact";

type InputFormProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  format?: InputFormat;
  placeholder?: string;
  type?: "text" | "password" | "number" | string;
  disabled?: boolean;
  icon?: LucideIcon;
  className?: string;
  maxLength?: number;
  size?: InputFormSize;
};

export const InputForm = <T extends FieldValues>({
  name,
  control,
  label,
  maxLength,
  format,
  placeholder,
  type = "text",
  icon,
  disabled,
  className,
  size = "default",
}: InputFormProps<T>) => {
  const [eye, setEye] = useState(type === "password");

  const toggleEye = () => setEye((prev) => !prev);

  const handleFormat = (value: string) => {
    const formats = {
      phone: formatPhone(value),
      cnpj: formatCNPJ(value),
      cep: formatCEP(value),
      cpf: formatCPF(value),
      rg: formatRG(value),
      money: formatPriceInput(value),
      cardNumber: formatCardNumber(value),
      cardValidity: formatCardValidity(value),
      cardCvv: formatCardCvv(value),
    };

    return format ? formats[format] : value;
  };

  const maxLengths = {
    phone: 15,
    cnpj: 18,
    cep: 9,
    cpf: 14,
    rg: 12,
    money: 99,
    cardNumber: 19,
    cardValidity: 5,
    cardCvv: 4,
  };

  const compact = size === "compact";
  const large = size === "large";

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="relative">
          {type === "password" && (
            <Button
              type="button"
              variant="ghost"
              className={cn(
                "absolute top-1/2 -translate-y-1/2 right-1 z-10",
                compact && "h-7 w-7",
              )}
              onClick={toggleEye}
            >
              {eye ? <EyeOff /> : <Eye />}
            </Button>
          )}

          {label && (
            <Label
              htmlFor={name}
              className={cn(
                "absolute flex items-center gap-1.5 z-10 pointer-events-none transition-colors",
                compact
                  ? "top-2 left-3 text-[11px] text-muted-foreground"
                  : "top-3 left-3.5",
                large && "text-lg!",
                fieldState.error && "text-red-500!",
              )}
            >
              {fieldState.error ? (
                <CircleX
                  className={cn(compact ? "h-3 w-3" : "h-4 w-4")}
                />
              ) : (
                icon &&
                createElement(icon, {
                  className: cn(compact ? "w-3 h-3" : "w-4 h-4"),
                })
              )}
              {fieldState.error ? fieldState.error.message : label}
            </Label>
          )}

          <Input
            id={name}
            placeholder={placeholder}
            type={type === "password" ? (eye ? type : "text") : type}
            maxLength={format ? maxLengths[format] : maxLength}
            disabled={disabled}
            {...field}
            value={handleFormat(String(field.value ?? ""))}
            className={cn(
              compact &&
                "text-sm! px-3 py-2.5! pt-7! h-auto bg-neutral-950/50 border-neutral-800 rounded-lg",
              large &&
                "text-xl! px-4 py-7! pt-14! rounded-2xl",
              size === "default" &&
                "text-lg! px-4 py-6! pt-12! bg-background",
              fieldState.error && "border-red-500!",
              className,
            )}
          />
        </div>
      )}
    />
  );
};
