import { Zap } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { SurfaceCard } from "@/shared/components/molecules/SurfaceCard/SurfaceCard";

export function PromoCard() {
  return (
    <SurfaceCard className="h-full" innerClassName="flex flex-col gap-4">
      <div className="flex items-start justify-between text-xs text-muted-foreground">
        <div>
          <p>Anúncios</p>
          <p className="text-[10px] mt-0.5">Powered by Carbon</p>
        </div>
        <button className="hover:text-foreground transition-colors">
          Próximo →
        </button>
      </div>

      <div className="rounded-full bg-neutral-800 px-3 py-1.5 text-xs w-fit text-center mx-auto">
        Apenas hoje!
      </div>

      <div className="flex items-center gap-2">
        <Zap size={20} className="text-amber-400" fill="currentColor" />
        <h3 className="text-lg font-medium">
          Vire Premium com{" "}
          <span className="bg-amber-400 text-neutral-950 px-2 py-0.5 rounded-md text-sm font-semibold">
            40%
          </span>
        </h3>
      </div>
      <p className="text-xs text-muted-foreground">
        Esta é a sua chance incrível!
      </p>

      <p className="text-[11px] text-muted-foreground leading-relaxed">
        Nossa assinatura premium eleva sua experiência com benefícios feitos
        para você.
      </p>

      <button className="text-xs underline w-fit text-muted-foreground hover:text-foreground transition-colors">
        Saiba mais →
      </button>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-neutral-800">
        <button className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">
          Não mostrar de novo
        </button>
        <Button
          size="sm"
          className="bg-white text-neutral-900 hover:bg-neutral-200 rounded-full h-8 text-xs"
        >
          Começar
        </Button>
      </div>
    </SurfaceCard>
  );
}
