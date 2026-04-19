import { Controller, useWatch } from "react-hook-form";
import {
  BadgeCheck,
  KeyRound,
  Tag,
  Zap,
} from "lucide-react";
import GradientBorder from "@/shared/components/molecules/GradientBorder/GradientBorder";
import { InputForm } from "@/shared/components/form/InputForm";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { ShimmerButton } from "@/shared/components/ui/shimmer-button";
import { MarketplaceLogo } from "@/shared/components/molecules/MarketplaceLogo";
import { cn } from "@/shared/lib/utils";
import { MarketplaceOptionCard } from "../molecules/MarketplaceOptionCard";
import { useNewIntegration } from "../../hooks/useNewIntegration";
import type { IntegrationFormData } from "../../schemas/integration.schema";

type SectionProps = {
  step: number;
  title: string;
  description?: string;
  children: React.ReactNode;
};

function Section({ step, title, description, children }: SectionProps) {
  return (
    <GradientBorder className="p-[0.8px]! from-white/15 via-white/5 to-white/10 rounded-2xl!">
      <div className="rounded-2xl bg-neutral-900/80 p-5 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <span className="shrink-0 size-6 rounded-full bg-primary/15 border border-primary/40 text-primary text-[11px] font-medium flex items-center justify-center">
            {step}
          </span>
          <div className="flex flex-col gap-0.5">
            <h3 className="text-sm font-medium">{title}</h3>
            {description && (
              <p className="text-[11px] text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {children}
      </div>
    </GradientBorder>
  );
}

type ToggleRowProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
};

function ToggleRow({
  icon,
  title,
  description,
  checked,
  onCheckedChange,
}: ToggleRowProps) {
  return (
    <label className="flex items-start justify-between gap-3 rounded-lg border border-neutral-800 bg-neutral-950/50 p-3 cursor-pointer hover:border-neutral-700 transition-colors">
      <div className="flex items-start gap-3 min-w-0">
        <span className="shrink-0 mt-0.5 size-7 rounded-md bg-neutral-800 flex items-center justify-center text-muted-foreground">
          {icon}
        </span>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-xs font-medium">{title}</span>
          <span className="text-[11px] text-muted-foreground">
            {description}
          </span>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </label>
  );
}

function PreviewCard({
  control,
}: {
  control: ReturnType<typeof useNewIntegration>["control"];
}) {
  const values = useWatch({ control }) as Partial<IntegrationFormData>;
  const name = values.name?.trim() || "Minha integração";
  const apiKeyMask = values.apiKey
    ? `${values.apiKey.slice(0, 3)}••••••••${values.apiKey.slice(-3)}`
    : "—";

  return (
    <GradientBorder className="p-[0.8px]! self-start sticky top-4 w-auto h-fit from-white/20 via-white/5 to-white/15 rounded-2xl!">
      <div className="rounded-2xl bg-neutral-900/80 overflow-hidden">
        <div className="relative h-28 bg-gradient-to-br from-primary/25 via-neutral-900 to-neutral-950 flex items-center justify-center">
          {values.marketplace && (
            <div className="scale-[1.4]">
              <MarketplaceLogo marketplace={values.marketplace} hideLabel />
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Apelido
            </span>
            <span className="text-sm font-medium line-clamp-1">{name}</span>
          </div>
          <div className="flex flex-col gap-0.5 pt-2 border-t border-neutral-800">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Chave de API
            </span>
            <span className="text-xs font-mono text-muted-foreground truncate">
              {apiKeyMask}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Estoque
              </span>
              <span
                className={cn(
                  "text-[11px]",
                  values.syncStock ? "text-emerald-400" : "text-muted-foreground",
                )}
              >
                {values.syncStock ? "Sincronizar" : "Desativado"}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Pedidos
              </span>
              <span
                className={cn(
                  "text-[11px]",
                  values.syncOrders ? "text-emerald-400" : "text-muted-foreground",
                )}
              >
                {values.syncOrders ? "Sincronizar" : "Desativado"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </GradientBorder>
  );
}

export function NewIntegrationForm() {
  const {
    options,
    control,
    setValue,
    onSubmit,
    onCancel,
    isValid,
    isSubmitting,
  } = useNewIntegration();

  const marketplace = useWatch({ control, name: "marketplace" });

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5"
    >
      <div className="flex flex-col gap-4">
        <Section
          step={1}
          title="Escolha o marketplace"
          description="Qual canal você quer conectar agora."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {options.map((o) => (
              <MarketplaceOptionCard
                key={o.marketplace}
                marketplace={o.marketplace}
                description={o.description}
                selected={marketplace === o.marketplace}
                onClick={() =>
                  setValue("marketplace", o.marketplace, { shouldValidate: true })
                }
              />
            ))}
          </div>
        </Section>

        <Section
          step={2}
          title="Credenciais"
          description="Os dados ficam criptografados e só são usados para sincronizar sua carteira."
        >
          <div className="flex flex-col gap-3">
            <InputForm
              size="compact"
              control={control}
              name="name"
              label="Apelido da integração"
              placeholder="Ex: Loja principal · Mercado Livre"
              icon={Tag}
            />
            <InputForm
              size="compact"
              control={control}
              name="apiKey"
              type="password"
              label="Chave de API / Token"
              placeholder="Cole aqui a chave gerada no marketplace"
              icon={KeyRound}
            />
          </div>
        </Section>

        <Section
          step={3}
          title="O que sincronizar"
          description="Você pode ajustar isso depois nas configurações da integração."
        >
          <div className="flex flex-col gap-3">
            <Controller
              control={control}
              name="syncStock"
              render={({ field }) => (
                <ToggleRow
                  icon={<BadgeCheck size={14} />}
                  title="Estoque"
                  description="Atualize a quantidade disponível a cada mudança."
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="syncOrders"
              render={({ field }) => (
                <ToggleRow
                  icon={<Zap size={14} />}
                  title="Pedidos"
                  description="Importe novos pedidos em tempo quase real."
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </Section>

        <div className="flex items-center justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="h-9 text-xs bg-neutral-900 border-neutral-800"
          >
            Cancelar
          </Button>
          <ShimmerButton
            type="submit"
            disabled={!isValid || isSubmitting}
            className={cn(
              "h-9 px-4 py-0 text-xs gap-2 [--radius:0.5rem]",
              (!isValid || isSubmitting) && "opacity-50 cursor-not-allowed",
            )}
          >
            Conectar marketplace
          </ShimmerButton>
        </div>
      </div>

      <PreviewCard control={control} />
    </form>
  );
}
