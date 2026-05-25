import {
  AtSign,
  CalendarDays,
  FileText,
  Mail,
  Phone,
  User,
} from "lucide-react";
import GradientBorder from "@/shared/components/molecules/GradientBorder/GradientBorder";
import { GradientBadge } from "@/shared/components/molecules/GradientBadge/GradientBadge";
import { InputForm } from "@/shared/components/form/InputForm";
import { TextareaForm } from "@/shared/components/form/TextareaForm";
import { Button } from "@/shared/components/ui/button";
import { ShimmerButton } from "@/shared/components/ui/shimmer-button";
import { cn } from "@/shared/lib/utils";
import { useEditProfile } from "../../hooks/useEditProfile";
import type { EditProfileFormData } from "../../schemas/profile.schema";
import { useProfileData } from "../../hooks/useProfileData";

export const EDIT_PROFILE_FORM_ID = "edit-profile-form";

type SectionProps = {
  title: string;
  description?: string;
  trailing?: React.ReactNode;
  children: React.ReactNode;
  compact?: boolean;
};

function Section({
  title,
  description,
  trailing,
  children,
  compact,
}: SectionProps) {
  return (
    <GradientBorder className="p-[0.8px]! from-white/15 via-white/5 to-white/10 rounded-2xl!">
      <div
        className={cn(
          "rounded-2xl bg-neutral-900/80 flex flex-col",
          compact ? "p-4 gap-3" : "p-5 gap-4",
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-sm font-medium">{title}</h3>
            {description && (
              <p className="text-[11px] text-muted-foreground">{description}</p>
            )}
          </div>
          {trailing}
        </div>
        {children}
      </div>
    </GradientBorder>
  );
}

type Props = {
  variant?: "page" | "drawer";
  onSuccess?: (data: EditProfileFormData) => void;
  onCancel?: () => void;
  hideActions?: boolean;
};

export function EditProfileForm({
  variant = "page",
  onSuccess,
  onCancel: onCancelProp,
  hideActions = false,
}: Props) {
  const profile = useProfileData();
  const { control, onSubmit, onCancel, isSubmitting, isValid } = useEditProfile({
    onSuccess,
    onCancel: onCancelProp,
  });

  const isDrawer = variant === "drawer";

  return (
    <form
      id={EDIT_PROFILE_FORM_ID}
      onSubmit={onSubmit}
      className={cn("flex flex-col", isDrawer ? "gap-3" : "gap-4")}
    >
      <Section
        title="Detalhes"
        description="Informações que aparecem no seu perfil."
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
            label="Nome completo"
            placeholder="Como você quer ser chamado"
            icon={User}
          />
          <InputForm
            size="compact"
            control={control}
            name="username"
            label="Nome de usuário"
            placeholder="seu.usuario"
            icon={AtSign}
          />
        </div>
        <div className="relative">
          <InputForm
            size="compact"
            control={control}
            name="email"
            label="E-mail"
            placeholder="voce@exemplo.com"
            icon={Mail}
          />
          {profile.emailVerified && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <GradientBadge color="green">Verificado</GradientBadge>
            </div>
          )}
        </div>
        <div
          className={cn(
            "grid gap-3",
            isDrawer ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2",
          )}
        >
          <InputForm
            size="compact"
            control={control}
            name="phone"
            label="Telefone"
            placeholder="(11) 90000-0000"
            format="phone"
            icon={Phone}
          />
          <InputForm
            size="compact"
            control={control}
            name="birthDate"
            label="Data de nascimento"
            placeholder="DD/MM/AAAA"
            icon={CalendarDays}
          />
        </div>
        <TextareaForm
          size="compact"
          control={control}
          name="bio"
          label="Bio"
          placeholder="Conte um pouco sobre você"
          icon={FileText}
          rows={3}
        />
      </Section>

      <Section
        title="Documentos"
        description="Identidade verificada via NPMP."
        trailing={<GradientBadge color="blue">e-KYC</GradientBadge>}
        compact={isDrawer}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-3 flex items-center gap-3">
            <span className="size-9 rounded-md bg-neutral-800 flex items-center justify-center text-muted-foreground">
              <FileText size={14} />
            </span>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-xs font-medium truncate">documento.pdf</span>
              <span className="text-[11px] text-muted-foreground">
                234 KB · Enviado
              </span>
            </div>
          </div>
          <div className="rounded-lg border border-dashed border-neutral-800 bg-neutral-950/30 p-3 flex items-center justify-center text-[11px] text-muted-foreground">
            + Anexar comprovante
          </div>
        </div>
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
            disabled={!isValid || isSubmitting}
            className={cn(
              "h-9 px-4 py-0 text-xs gap-2 [--radius:0.5rem]",
              (!isValid || isSubmitting) && "opacity-50 cursor-not-allowed",
            )}
          >
            Salvar alterações
          </ShimmerButton>
        </div>
      )}
    </form>
  );
}
