import { useMemo, useState } from "react";
import {
  BarChart3,
  FileText,
  Lightbulb,
  LineChart,
  Megaphone,
  PackageSearch,
  Tag,
  Wallet,
} from "lucide-react";
import type { AIMode, AISuggestion } from "../types/ai.types";

const MODES: AIMode[] = [
  { id: "sales", label: "Análise de Vendas", icon: BarChart3 },
  { id: "ads", label: "Otimizar Anúncios", icon: Megaphone },
  { id: "stock", label: "Estoque", icon: PackageSearch },
  { id: "report", label: "Relatório", icon: FileText },
];

const SUGGESTIONS: AISuggestion[] = [
  {
    id: "compare-marketplaces",
    icon: LineChart,
    highlight: "Compare a performance",
    description:
      "do Mercado Livre, Shopee e Amazon nos últimos 30 dias e mostre quem cresceu mais.",
  },
  {
    id: "low-stock",
    icon: PackageSearch,
    highlight: "Liste produtos com estoque baixo",
    description:
      "que vendem mais de 10 unidades por semana, agrupados por marketplace.",
  },
  {
    id: "pricing",
    icon: Tag,
    highlight: "Sugira ajustes de preço",
    description:
      "para os anúncios pendentes baseando-se na concorrência da última semana.",
  },
  {
    id: "revenue",
    icon: Wallet,
    highlight: "Explique a queda de faturamento",
    description:
      "deste mês comparado ao anterior e aponte os principais responsáveis.",
  },
];

export const useAIComposer = () => {
  const [mode, setMode] = useState<string>(MODES[0].id);
  const [prompt, setPrompt] = useState("");

  const modes = useMemo(() => MODES, []);
  const suggestions = useMemo(() => SUGGESTIONS, []);

  return {
    mode,
    setMode,
    prompt,
    setPrompt,
    modes,
    suggestions,
    placeholder: "Pergunte sobre vendas, anúncios, estoque ou marketplaces...",
    disclaimer:
      "A IA pode cometer erros. Confirme informações sensíveis antes de agir.",
    greeting: "Boa noite, Matheus.",
    subtitle: "O que vamos analisar hoje nos seus marketplaces?",
    tip: Lightbulb,
  };
};
