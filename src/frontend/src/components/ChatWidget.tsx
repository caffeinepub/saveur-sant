import { Textarea } from "@/components/ui/textarea";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { getChatbotReply } from "../utils/chatbotEngine";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
}

export default function ChatWidget() {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, setIsPending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Reset and re-greet when language changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset only on language change
  useEffect(() => {
    if (open) {
      setMessages([
        { id: `greeting-${language}`, role: "bot", text: t("chat.greeting") },
      ]);
    }
  }, [language]);

  // Initialize with greeting when first opened
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ id: "greeting", role: "bot", text: t("chat.greeting") }]);
    }
  }, [open, messages.length, t]);

  // Scroll to bottom on new messages
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional scroll on messages/pending change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isPending) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsPending(true);

    // Small delay to simulate thinking
    await new Promise((resolve) => setTimeout(resolve, 400));

    const reply = getChatbotReply(trimmed);
    const botMsg: Message = {
      id: `b-${Date.now()}`,
      role: "bot",
      text: reply,
    };
    setMessages((prev) => [...prev, botMsg]);
    setIsPending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25 }}
            className="w-80 sm:w-96 rounded-2xl overflow-hidden shadow-2xl"
            data-ocid="chat.panel"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ backgroundColor: "oklch(0.36 0.082 163)" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white font-sans">
                    {t("chat.title")}
                  </div>
                  <div className="text-xs text-white/70 font-sans">
                    {t("chat.subtitle")}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-white/70 hover:text-white transition-colors p-1"
                aria-label="Close chat"
                data-ocid="chat.close_button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              className="h-72 overflow-y-auto p-4 space-y-3"
              style={{ backgroundColor: "oklch(0.98 0.008 80)" }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className="max-w-[80%] px-3 py-2 rounded-xl text-sm font-sans leading-relaxed whitespace-pre-wrap"
                    style={{
                      backgroundColor:
                        msg.role === "user" ? "oklch(0.36 0.082 163)" : "white",
                      color: msg.role === "user" ? "white" : "oklch(0.145 0 0)",
                      boxShadow:
                        msg.role === "bot"
                          ? "0 1px 4px rgba(0,0,0,0.08)"
                          : "none",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isPending && (
                <div
                  className="flex justify-start"
                  data-ocid="chat.loading_state"
                >
                  <div
                    className="px-3 py-2 rounded-xl bg-white text-sm text-[oklch(0.56_0.016_65)] font-sans"
                    style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
                  >
                    <span className="flex gap-1 items-center">
                      <span
                        className="w-1.5 h-1.5 bg-[oklch(0.36_0.082_163)] rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 bg-[oklch(0.36_0.082_163)] rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 bg-[oklch(0.36_0.082_163)] rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </span>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              className="flex items-end gap-2 p-3 border-t"
              style={{
                backgroundColor: "white",
                borderColor: "oklch(0.9 0.02 80)",
              }}
            >
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("chat.placeholder")}
                className="flex-1 min-h-[36px] max-h-24 resize-none text-sm rounded-lg border-[oklch(0.9_0.02_80)] font-sans"
                rows={1}
                data-ocid="chat.textarea"
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={isPending || !input.trim()}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:opacity-90 disabled:opacity-40 flex-shrink-0"
                style={{ backgroundColor: "oklch(0.72 0.09 75)" }}
                aria-label="Send message"
                data-ocid="chat.submit_button"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-200"
        style={{ backgroundColor: "oklch(0.72 0.09 75)" }}
        aria-label="Open chat"
        data-ocid="chat.open_modal_button"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
