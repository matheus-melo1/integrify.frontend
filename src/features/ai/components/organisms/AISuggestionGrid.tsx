import { AISuggestionCard } from "../molecules/AISuggestionCard";
import type { AISuggestion } from "../../types/ai.types";

type Props = {
  suggestions: AISuggestion[];
  onSelect?: (id: string) => void;
};

export function AISuggestionGrid({ suggestions, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
      {suggestions.map((s) => (
        <AISuggestionCard
          key={s.id}
          icon={s.icon}
          highlight={s.highlight}
          description={s.description}
          onClick={() => onSelect?.(s.id)}
        />
      ))}
    </div>
  );
}
