import { motion } from "framer-motion";
import { Sparkles, User } from "lucide-react";
import GradientBorder from "@/shared/components/molecules/GradientBorder/GradientBorder";
import { cn } from "@/shared/lib/utils";
import type { AIMessage } from "../../types/ai.types";
import { AITypingIndicator } from "./AITypingIndicator";

type Props = {
  message: AIMessage;
};

export function AIMessageBubble({ message }: Props) {
  const isUser = message.role === "user";
  const isEmptyStreaming = message.streaming && message.content.length === 0;

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "flex items-end gap-2.5 w-full",
        isUser && "flex-row-reverse",
      )}
    >
      <GradientBorder
        className={cn(
          "p-[0.6px]! size-8 shrink-0 rounded-full!",
          isUser
            ? "from-primary/60! via-primary/10! to-primary/40!"
            : "from-amber-400/50! via-white/5! to-amber-400/30!",
        )}
      >
        <div
          className={cn(
            "size-full rounded-full flex items-center justify-center",
            isUser
              ? "bg-primary/15 text-primary"
              : "bg-neutral-900 text-amber-400",
          )}
        >
          {isUser ? <User size={13} /> : <Sparkles size={13} />}
        </div>
      </GradientBorder>

      <GradientBorder
        className={cn(
          "p-[0.6px]! w-fit max-w-[78%]",
          isUser
            ? "from-primary/50! via-primary/10! to-primary/40! rounded-2xl! rounded-br-md!"
            : "from-white/25! via-white/5! to-white/15! rounded-2xl! rounded-bl-md!",
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
            isUser
              ? "rounded-br-md bg-neutral-800/90 text-foreground"
              : "rounded-bl-md bg-neutral-900/90 text-foreground",
          )}
        >
          {isEmptyStreaming ? (
            <AITypingIndicator />
          ) : (
            <span className="whitespace-pre-wrap [overflow-wrap:anywhere]">
              {message.content}
              {message.streaming && (
                <motion.span
                  aria-hidden
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                  className="inline-block ml-0.5 translate-y-[1px] w-[2px] h-[1em] bg-current align-middle"
                />
              )}
            </span>
          )}
        </div>
      </GradientBorder>
    </motion.div>
  );
}
