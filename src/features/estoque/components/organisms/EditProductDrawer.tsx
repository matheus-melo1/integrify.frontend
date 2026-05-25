import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/components/ui/drawer";
import { Button } from "@/shared/components/ui/button";
import { ShimmerButton } from "@/shared/components/ui/shimmer-button";
import { NewProductForm, NEW_PRODUCT_FORM_ID } from "./NewProductForm";
import type { Stock } from "../../types/stock.types";

type Props = {
  stock: Stock;
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export function EditProductDrawer({ stock, open, onOpenChange }: Props) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-neutral-900/70 backdrop-blur-xl border-neutral-800/80">
        <DrawerHeader className="text-left">
          <DrawerTitle>Editar produto</DrawerTitle>
          <DrawerDescription>
            Atualize os dados do produto e salve as alterações.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {open && (
            <NewProductForm
              variant="drawer"
              mode="edit"
              initialStock={stock}
              hideActions
              onSuccess={() => onOpenChange(false)}
              onCancel={() => onOpenChange(false)}
            />
          )}
        </div>

        <DrawerFooter className="flex-row justify-end gap-2 border-t border-neutral-800/60 bg-neutral-900/40">
          <DrawerClose asChild>
            <Button
              type="button"
              variant="outline"
              className="h-9 text-xs bg-neutral-900 border-neutral-800 flex-1"
            >
              Cancelar
            </Button>
          </DrawerClose>
          <ShimmerButton
            type="submit"
            form={NEW_PRODUCT_FORM_ID}
            className="h-9 px-4 py-0 text-xs gap-2 [--radius:0.5rem] flex-1"
          >
            Atualizar produto
          </ShimmerButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
