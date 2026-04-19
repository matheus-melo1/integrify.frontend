import { ArrowUp, ChevronDown, Mic, Plus, Sparkles } from "lucide-react";
import GradientBorder from "@/shared/components/molecules/GradientBorder/GradientBorder";
import { Button } from "@/shared/components/ui/button";
import { AIModeTab } from "../molecules/AIModeTab";
import type { AIMode } from "../../types/ai.types";

type Props = {
  prompt: string;
  onPromptChange: (value: string) => void;
  placeholder: string;
  modes: AIMode[];
  activeMode: string;
  onModeChange: (id: string) => void;
  onSubmit?: () => void;
  disabled?: boolean;
};

export function AIPromptComposer({
  prompt,
  onPromptChange,
  placeholder,
  modes,
  activeMode,
  onModeChange,
  onSubmit,
  disabled,
}: Props) {
  const canSubmit = prompt.trim().length > 0 && !disabled;

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex flex-wrap gap-2 justify-center">
        {modes.map((m) => (
          <AIModeTab
            key={m.id}
            label={m.label}
            icon={m.icon}
            active={activeMode === m.id}
            onClick={() => onModeChange(m.id)}
          />
        ))}
      </div>

      <GradientBorder className="p-[0.8px]! rounded-2xl! from-white/30! via-white/5! to-white/30!">
        <div className="w-full bg-neutral-800 p-3 rounded-2xl flex flex-col gap-3">
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder={placeholder}
            rows={2}
            className="w-full resize-none bg-transparent outline-none p-2 text-sm placeholder:text-muted-foreground"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && canSubmit) {
                e.preventDefault();
                onSubmit?.();
              }
            }}
          />

          <div className="w-full flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <GradientBorder className="p-[0.2px] from-white/70 via-white/5 to-white/30 w-auto rounded-xl">
                <Button
                  variant="secondary"
                  className="flex items-center justify-center size-9 rounded-xl border"
                >
                  <Plus size={18} />
                </Button>
              </GradientBorder>
              <GradientBorder className="p-[0.2px] from-white/70 via-white/5 to-white/30 w-auto rounded-xl">
                <Button
                  variant="secondary"
                  className="h-9 rounded-xl border px-3 text-xs gap-1.5"
                >
                  <Sparkles size={14} className="text-amber-400" />
                  integrify-ai
                  <ChevronDown size={14} className="text-muted-foreground" />
                </Button>
              </GradientBorder>
            </div>

            <div className="flex gap-2 items-center">
              <GradientBorder className="p-[0.2px] from-white/70 via-white/5 to-white/30 w-auto rounded-xl">
                <Button
                  variant="secondary"
                  className="flex items-center justify-center size-9 rounded-xl border"
                >
                  <Mic size={18} />
                </Button>
              </GradientBorder>
              <Button
                disabled={!canSubmit}
                onClick={onSubmit}
                className="flex items-center justify-center size-9 rounded-xl border disabled:opacity-40"
              >
                <ArrowUp size={18} />
              </Button>
            </div>
          </div>
        </div>
      </GradientBorder>
    </div>
  );
}
