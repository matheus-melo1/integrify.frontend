import { useWatch } from "react-hook-form";
import {
  BadgeCheck,
  Boxes,
  DollarSign,
  FileText,
  Hash,
  ImageIcon,
  Package,
  Store,
} from "lucide-react";
import { InputForm } from "@/shared/components/form/InputForm";
import { SelectForm } from "@/shared/components/form/SelectForm";
import { TextareaForm } from "@/shared/components/form/TextareaForm";
import { Button } from "@/shared/components/ui/button";
import { ShimmerButton } from "@/shared/components/ui/shimmer-button";
import GradientBorder from "@/shared/components/molecules/GradientBorder/GradientBorder";
import { cn } from "@/shared/lib/utils";
import { useProductForm } from "../../hooks/useProductForm";
import {
  MARKETPLACE_OPTIONS,
  STATUS_OPTIONS,
  type ProductFormData,
} from "../../schemas/product.schema";
import type { Stock } from "../../types/stock.types";

export const NEW_PRODUCT_FORM_ID = "new-product-form";

type SectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
};

function Section({
  title,
  description,
  children,
  className,
  compact,
}: SectionProps) {
  return (
    <GradientBorder className="p-[0.8px]! from-white/15 via-white/5 to-white/10 rounded-2xl!">
      <div
        className={cn(
          "rounded-2xl bg-neutral-900/80 flex flex-col",
          compact ? "p-4 gap-3" : "p-5 gap-4",
          className,
        )}
      >
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-medium">{title}</h3>
          {description && (
            <p className="text-[11px] text-muted-foreground">{description}</p>
          )}
        </div>
        {children}
      </div>
    </GradientBorder>
  );
}

function PreviewCard({
  control,
}: {
  control: ReturnType<typeof useProductForm>["control"];
}) {
  const values = useWatch({ control }) as Partial<ProductFormData>;
  const hasImage = !!values.image;
  const marketplaceLabel =
    MARKETPLACE_OPTIONS.find((o) => o.value === values.marketplace)?.label ??
    "—";
  const statusLabel =
    STATUS_OPTIONS.find((o) => o.value === values.status)?.label ?? "—";
  const priceDisplay =
    values.price && values.price.length > 0 ? values.price : "R$ 0,00";

  return (
    <GradientBorder className="p-[0.8px]! self-start sticky top-4 w-auto h-fit from-white/20 via-white/5 to-white/15 rounded-2xl!">
      <div className="rounded-2xl bg-neutral-900/80 overflow-hidden">
        <div className="relative aspect-[4/3] bg-neutral-950 overflow-hidden">
          {hasImage ? (
            <img
              src={values.image}
              alt={values.name ?? "Prévia"}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <ImageIcon size={32} strokeWidth={1.2} />
              <span className="text-[11px]">Prévia da imagem</span>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
              {values.sku || "SKU"}
            </span>
            <span className="text-sm font-medium line-clamp-2">
              {values.name || "Nome do produto"}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
            <span className="text-[11px] text-muted-foreground">
              {marketplaceLabel} · {statusLabel}
            </span>
            <span className="text-sm font-medium">{priceDisplay}</span>
          </div>
        </div>
      </div>
    </GradientBorder>
  );
}

type NewProductFormProps = {
  variant?: "page" | "drawer";
  mode?: "create" | "edit";
  initialStock?: Stock;
  submitLabel?: string;
  onSuccess?: (data: ProductFormData) => void;
  onCancel?: () => void;
  hideActions?: boolean;
};

export function NewProductForm({
  variant = "page",
  mode = "create",
  initialStock,
  submitLabel,
  onSuccess,
  onCancel: onCancelProp,
  hideActions = false,
}: NewProductFormProps) {
  const { control, onSubmit, onCancel, isSubmitting } = useProductForm({
    mode,
    initialStock,
    onSuccess,
    onCancel: onCancelProp,
  });

  const effectiveLabel =
    submitLabel ?? (mode === "edit" ? "Atualizar produto" : "Salvar produto");

  const isDrawer = variant === "drawer";

  const sections = (
    <div className={cn("flex flex-col", isDrawer ? "gap-3" : "gap-4")}>
      <Section
        title="Identificação"
        description="Como o produto aparece no marketplace."
        compact={isDrawer}
      >
        <div
          className={cn(
            "grid gap-3",
            isDrawer ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2",
          )}
        >
          <InputForm
            size="compact"
            control={control}
            name="name"
            label="Nome do produto"
            placeholder="Ex: Cafeteira Elétrica 110V"
            icon={Package}
          />
          <InputForm
            size="compact"
            control={control}
            name="sku"
            label="SKU"
            placeholder="Ex: SKU-10293"
            icon={Hash}
          />
        </div>
        <TextareaForm
          size="compact"
          control={control}
          name="description"
          label="Descrição"
          placeholder="Detalhes, materiais, dimensões…"
          icon={FileText}
          rows={3}
        />
      </Section>

      <Section
        title="Marketplace & status"
        description="Onde e em que estado o produto será listado."
        compact={isDrawer}
      >
        <div
          className={cn(
            "grid gap-3",
            isDrawer ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2",
          )}
        >
          <SelectForm
            size="compact"
            control={control}
            name="marketplace"
            label="Marketplace"
            placeholder="Selecione"
            icon={Store}
            options={[...MARKETPLACE_OPTIONS]}
          />
          <SelectForm
            size="compact"
            control={control}
            name="status"
            label="Status"
            placeholder="Selecione"
            icon={BadgeCheck}
            options={[...STATUS_OPTIONS]}
          />
        </div>
      </Section>

      <Section
        title="Estoque & preço"
        description="Disponibilidade e valor de venda."
        compact={isDrawer}
      >
        <div
          className={cn(
            "grid gap-3",
            isDrawer ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2",
          )}
        >
          <InputForm
            size="compact"
            control={control}
            name="stock"
            label="Quantidade"
            placeholder="0"
            type="number"
            icon={Boxes}
          />
          <InputForm
            size="compact"
            control={control}
            name="price"
            label="Preço"
            placeholder="0,00"
            format="money"
            icon={DollarSign}
          />
        </div>
        <InputForm
          size="compact"
          control={control}
          name="image"
          label="URL da imagem"
          placeholder="https://…"
          icon={ImageIcon}
        />
      </Section>

      {!hideActions && (
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
            disabled={isSubmitting}
            className="h-9 px-4 py-0 text-xs gap-2 [--radius:0.5rem]"
          >
            {effectiveLabel}
          </ShimmerButton>
        </div>
      )}
    </div>
  );

  if (isDrawer) {
    return (
      <form id={NEW_PRODUCT_FORM_ID} onSubmit={onSubmit}>
        {sections}
      </form>
    );
  }

  return (
    <form
      id={NEW_PRODUCT_FORM_ID}
      onSubmit={onSubmit}
      className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5"
    >
      {sections}
      <PreviewCard control={control} />
    </form>
  );
}
