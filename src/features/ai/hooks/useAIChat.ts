import { useCallback, useRef, useState } from "react";
import type { AIMessage } from "../types/ai.types";

const MOCK_REPLIES = [
  "Analisei os dados dos seus marketplaces e encontrei alguns pontos interessantes.",
  "O Mercado Livre cresceu 18% em receita no período, enquanto a Shopee recuou 4%. A Amazon manteve-se estável com leve alta de 2%.",
  "Recomendo focar campanhas em categorias de alta margem no Mercado Livre nas próximas duas semanas e revisar o catálogo da Shopee para identificar SKUs com ruptura.",
  "Quer que eu gere um relatório detalhado ou abra os próximos passos como tarefas?",
];

const pickReply = () => MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export const useAIChat = () => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const timeoutsRef = useRef<number[]>([]);

  const clearTimers = () => {
    timeoutsRef.current.forEach((t) => window.clearTimeout(t));
    timeoutsRef.current = [];
  };

  const streamAssistant = useCallback((fullText: string) => {
    const assistantId = uid();
    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: "assistant",
        content: "",
        createdAt: Date.now(),
        streaming: true,
      },
    ]);

    const words = fullText.split(" ");
    words.forEach((word, index) => {
      const handle = window.setTimeout(
        () => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    content: m.content ? `${m.content} ${word}` : word,
                    streaming: index < words.length - 1,
                  }
                : m,
            ),
          );
          if (index === words.length - 1) setIsStreaming(false);
        },
        120 + index * 45,
      );
      timeoutsRef.current.push(handle);
    });
  }, []);

  const sendMessage = useCallback(
    (content: string) => {
      const text = content.trim();
      if (!text || isStreaming) return;

      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "user",
          content: text,
          createdAt: Date.now(),
        },
      ]);
      setIsStreaming(true);

      const handle = window.setTimeout(() => streamAssistant(pickReply()), 550);
      timeoutsRef.current.push(handle);
    },
    [isStreaming, streamAssistant],
  );

  const reset = useCallback(() => {
    clearTimers();
    setMessages([]);
    setIsStreaming(false);
  }, []);

  return {
    messages,
    isStreaming,
    hasMessages: messages.length > 0,
    sendMessage,
    reset,
  };
};
