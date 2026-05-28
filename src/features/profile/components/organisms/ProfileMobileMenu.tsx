import { useState } from "react";
import { Bell, Clock, CreditCard, Moon, Shield } from "lucide-react";
import GradientBorder from "@/shared/components/molecules/GradientBorder/GradientBorder";
import { Switch } from "@/shared/components/ui/switch";
import { ProfileMenuItem } from "../molecules/ProfileMenuItem";

export function ProfileMobileMenu() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <GradientBorder className="p-[0.8px]! rounded-3xl! from-white/15 via-white/5 to-white/15">
      <div className="rounded-3xl bg-neutral-900/80 overflow-hidden divide-y divide-neutral-800/80">
        <ProfileMenuItem
          icon={CreditCard}
          label="Meu cartão"
          description="Métodos de pagamento e cobrança"
        />
        <ProfileMenuItem
          icon={Shield}
          label="Segurança"
          description="Senha, 2FA e dispositivos"
        />
        <ProfileMenuItem
          icon={Bell}
          label="Notificações"
          description="Pedidos, integrações e alertas"
        />
        <ProfileMenuItem
          icon={Clock}
          label="Histórico de transações"
          description="Sincronizações e cobranças recentes"
        />
        <ProfileMenuItem
          icon={Moon}
          label="Modo escuro"
          description="Sempre ativo neste app"
          asButton={false}
          trailing={<Switch checked={darkMode} onCheckedChange={setDarkMode} />}
        />
      </div>
    </GradientBorder>
  );
}
