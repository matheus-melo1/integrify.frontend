import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
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
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { buildEstoqueEditPath } from "@/app/router/routes";
import { useDeleteStorageMutation } from "../../services/storage.queries";
import { EditProductDrawer } from "../organisms/EditProductDrawer";
import type { Stock } from "../../types/stock.types";

type Props = {
  stock: Stock;
  triggerClassName?: string;
};

export function StockActionsMenu({ stock, triggerClassName }: Props) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteMutation = useDeleteStorageMutation();

  const onEdit = () => {
    if (isMobile) {
      setEditDrawerOpen(true);
      return;
    }
    navigate(buildEstoqueEditPath(stock.id));
  };

  const onConfirmDelete = async () => {
    try {
      await deleteMutation.mutateAsync(stock.id);
      toast.success("Produto excluído");
      setDeleteOpen(false);
    } catch {
      toast.error("Erro ao excluir produto");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            size="icon"
            variant="ghost"
            className={triggerClassName ?? "size-7 rounded-full"}
            aria-label="Ações do produto"
          >
            <MoreHorizontal size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={onEdit} className="gap-2 text-xs">
            <Pencil size={14} /> Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="gap-2 text-xs text-destructive focus:text-destructive"
          >
            <Trash2 size={14} /> Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O produto{" "}
              <strong>{stock.name}</strong> será removido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="max-md:p-4!"
              disabled={deleteMutation.isPending}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="max-md:p-4!"
              onClick={onConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Excluindo…" : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isMobile && (
        <EditProductDrawer
          stock={stock}
          open={editDrawerOpen}
          onOpenChange={setEditDrawerOpen}
        />
      )}
    </>
  );
}
