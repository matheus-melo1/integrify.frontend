import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AIMessageBubble } from "../molecules/AIMessageBubble";
import type { AIMessage } from "../../types/ai.types";

type Props = {
  messages: AIMessage[];
  isStreaming: boolean;
};

export function AIChatThread({ messages, isStreaming }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isStreaming]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full flex-1 min-h-0 overflow-y-auto px-1 pb-4 [mask-image:linear-gradient(to_bottom,transparent,black_24px,black_calc(100%-24px),transparent)]"
    >
      <div className="flex flex-col gap-5 pt-6">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <AIMessageBubble key={m.id} message={m} />
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </motion.div>
  );
}
