import { AnimatePresence, motion } from "framer-motion";
import { AIGreeting } from "../components/organisms/AIGreeting";
import { AIPromptComposer } from "../components/organisms/AIPromptComposer";
import { AISuggestionGrid } from "../components/organisms/AISuggestionGrid";
import { AIChatThread } from "../components/organisms/AIChatThread";
import { useAIComposer } from "../hooks/useAIComposer";
import { useAIChat } from "../hooks/useAIChat";

const AIPage = () => {
  const {
    mode,
    setMode,
    prompt,
    setPrompt,
    modes,
    suggestions,
    placeholder,
    disclaimer,
    greeting,
    subtitle,
  } = useAIComposer();

  const { messages, isStreaming, hasMessages, sendMessage } = useAIChat();

  const handleSubmit = () => {
    const text = prompt.trim();
    if (!text) return;
    sendMessage(text);
    setPrompt("");
  };

  const handleSuggestion = (id: string) => {
    const item = suggestions.find((s) => s.id === id);
    if (!item) return;
    const text = `${item.highlight} ${item.description}`;
    setPrompt("");
    sendMessage(text);
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-full flex flex-col py-6">
      <AnimatePresence mode="wait" initial={false}>
        {hasMessages ? (
          <motion.div
            key="thread"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex-1 min-h-0 flex flex-col"
          >
            <AIChatThread messages={messages} isStreaming={isStreaming} />
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col justify-center gap-8"
          >
            <AIGreeting greeting={greeting} subtitle={subtitle} />
            <AISuggestionGrid
              suggestions={suggestions}
              onSelect={handleSuggestion}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-3 pt-4"
      >
        <AIPromptComposer
          prompt={prompt}
          onPromptChange={setPrompt}
          placeholder={placeholder}
          modes={modes}
          activeMode={mode}
          onModeChange={setMode}
          onSubmit={handleSubmit}
          disabled={isStreaming}
        />
        <p className="text-[11px] text-muted-foreground text-center">
          {disclaimer}
        </p>
      </motion.div>
    </div>
  );
};

export default AIPage;
