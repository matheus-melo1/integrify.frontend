import { Sparkles } from "lucide-react";

type Props = {
  greeting: string;
  subtitle: string;
};

export function AIGreeting({ greeting, subtitle }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <Sparkles className="text-muted-foreground" size={40} strokeWidth={1.2} />
      <h1 className="text-3xl md:text-5xl font-light tracking-tight bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent drop-shadow-[0_1px_0_rgba(255,255,255,0.1)]">
        {greeting}
      </h1>
      <h3 className="text-lg md:text-xl font-light text-muted-foreground max-w-xl">
        {subtitle}
      </h3>
    </div>
  );
}
