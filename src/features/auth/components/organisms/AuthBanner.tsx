import Logo from "@/shared/components/molecules/Logo/Logo";
import Beams from "@/shared/components/Beams";
import { MorphingText } from "@/shared/components/ui/morphing-text";
import { cn } from "@/shared/lib/utils";

const marketplaces = ["Amazon", "Mercado Livre", "Shopee", "Magalu"];

type Props = {
  hidden?: boolean;
};

export const AuthBanner = ({ hidden }: Props) => {
  return (
    <div
      data-auth-banner
      className={cn(
        "relative w-full overflow-hidden rounded-2xl max-md:hidden transition-opacity duration-300",
        hidden && "opacity-0",
      )}
    >
      <div className="absolute top-7 left-7 z-50 flex items-center gap-3">
        <Logo />
      </div>

      <div className="absolute top-1/2 left-0 h-full w-full -translate-y-1/2">
        <Beams
          beamWidth={3}
          beamHeight={30}
          beamNumber={20}
          lightColor="#ffffff"
          speed={3}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={30}
        />
      </div>
      <div className="w-full absolute left-7 bottom-2">
        <p className="mb-4 text-2xl font-light text-white">Integre com</p>
        <MorphingText
          texts={marketplaces}
          className="text-white text-left! max-w-none! mx-0! text-6xl! font-medium!"
        />
      </div>
    </div>
  );
};
