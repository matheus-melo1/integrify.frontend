import { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/components/ui/drawer";
import { Button } from "@/shared/components/ui/button";
import { ShimmerButton } from "@/shared/components/ui/shimmer-button";
import {
  NewIntegrationForm,
  NEW_INTEGRATION_FORM_ID,
} from "./NewIntegrationForm";

type Props = {
  children: React.ReactNode;
};

export function NewIntegrationDrawer({ children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="bg-neutral-900/70 backdrop-blur-xl border-neutral-800/80">
        <DrawerHeader className="text-left">
          <DrawerTitle>Nova integração</DrawerTitle>
          <DrawerDescription>
            Conecte mais um marketplace à sua carteira em dois passos.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {open && (
            <NewIntegrationForm
              variant="drawer"
              hideActions
              onSuccess={() => setOpen(false)}
              onCancel={() => setOpen(false)}
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
            form={NEW_INTEGRATION_FORM_ID}
            className="h-9 px-4 py-0 text-xs gap-2 [--radius:0.5rem] flex-1"
          >
            Conectar
          </ShimmerButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
