import { useState } from "react";
import { Link } from "react-router-dom";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { SurfaceCard } from "@/shared/components/molecules/SurfaceCard/SurfaceCard";
import { MarketplaceLogo } from "@/shared/components/molecules/MarketplaceLogo";
import { buildIntegracaoEditPath } from "@/app/router/routes";
import { useDeleteIntegration } from "../../hooks/useDeleteIntegration";
import { IntegrationStatusBadge } from "./IntegrationStatusBadge";
import type { Integration } from "../../types/integration.types";

const maskApiKey = (key: string) =>
  key.length <= 6 ? key : `${key.slice(0, 3)}••••••••${key.slice(-3)}`;

type Props = {
  integration: Integration;
};

export function IntegrationCard({ integration }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { remove, isDeleting } = useDeleteIntegration();

  return (
    <SurfaceCard innerClassName="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-2">
          <h4 className="font-medium leading-tight">{integration.name}</h4>
          <MarketplaceLogo marketplace={integration.marketplace} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Mais opções"
              className="size-7 rounded-full text-muted-foreground"
            >
              <MoreHorizontal size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-32">
            <DropdownMenuItem>
              <Link to={buildIntegracaoEditPath(integration.id)}>
                <Pencil className="mr-2 size-3.5" />
                Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setConfirmOpen(true)}
              closeOnClick={false}
              className="text-red-400 focus:text-red-300"
            >
              <Trash2 className="mr-2 size-3.5" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground">Chave de API</span>
          <span className="text-[11px] font-mono truncate">
            {maskApiKey(integration.api_key)}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground">Sincronização</span>
          <span className="text-[11px]">
            {integration.stock_sync ? "Estoque" : "—"}
            {integration.stock_sync && integration.order_sync ? " · " : ""}
            {integration.order_sync ? "Pedidos" : ""}
            {!integration.stock_sync && !integration.order_sync
              ? "Desativada"
              : ""}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-neutral-700/60">
        <IntegrationStatusBadge status={integration.status} />
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir integração?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação remove a integração <strong>{integration.name}</strong>{" "}
              da sua carteira. Não dá pra desfazer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={() =>
                remove(integration.id, {
                  onSuccess: () => setConfirmOpen(false),
                })
              }
              className="bg-red-600 hover:bg-red-700"
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SurfaceCard>
  );
}
