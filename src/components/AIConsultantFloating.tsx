import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Cpu, Calendar, RefreshCw, Compass } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function AIConsultantFloating() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Welcome to Zealguy Venture. I am Zealguy, your AI Client Partner & Systems Architect. Describe your business goals, and I will instantly formulate optimized software stack recommendations, calculate costs, or guide you into our Discovery Wizard!"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userMsg = inputText.trim();
    setInputText("");
    const updatedMessages = [...messages, { role: "user", content: userMsg } as ChatMessage];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat-consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages })
      });
      if (!res.ok) throw new Error("Connection timed out.");
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      console.warn("Fallback chat assistant triggered...", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "That sounds like a brilliant candidate for our custom engineering pipeline! To coordinate precise database sharding, caching parameters, and SLA details, please fill out our 6-step interactive Project Discovery Wizard on this page, or choose a slots call!"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadChip = (text: string) => {
    setInputText(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="ai-consultant-floating-wrapper">
      <AnimatePresence>
        {isOpen ? (
          /* expanded terminal window */
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="w-[340px] sm:w-[380px] h-[480px] bg-[#090e24] border border-white/15 rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden relative"
          >
            {/* Ambient background light */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="p-4 bg-slate-950 border-b border-white/5 flex justify-between items-center z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-orange to-bright-orange flex items-center justify-center text-white">
                  <Cpu className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-mono leading-none">Zealguy AI</h4>
                  <span className="text-[9px] font-mono text-emerald-400 mt-1 block">● ARCHITECT_ONLINE</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer"
                aria-label="Close Chat"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-black/20 relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.01)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
              
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-[11px] leading-relaxed shadow-sm font-sans ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-tr-none"
                        : "bg-white/[0.03] border border-white/5 text-gray-200 rounded-tl-none font-mono text-[10px]"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/[0.03] border border-white/5 rounded-2xl rounded-tl-none p-3 flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-brand-orange animate-spin" />
                    <span className="text-[9px] font-mono text-gray-500">Formulating solution paths...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chips & Options row */}
            <div className="px-3 py-2 bg-[#030614]/80 flex gap-2 overflow-x-auto border-t border-white/5 scrollbar-none z-10 items-center min-h-[64px]">
              <button
                onClick={() => loadChip("What technology stack do you recommend for SaaS?")}
                className="h-10 min-h-[40px] text-[9px] font-mono px-3 bg-white/5 border border-white/10 hover:border-white/20 text-gray-300 rounded-full shrink-0 transition-all cursor-pointer flex items-center justify-center"
              >
                ✦ Suggest Tech Stack
              </button>
              <button
                onClick={() => loadChip("Estimate cost & schedule for a mobile app")}
                className="h-10 min-h-[40px] text-[9px] font-mono px-3 bg-white/5 border border-white/10 hover:border-white/20 text-gray-300 rounded-full shrink-0 transition-all cursor-pointer flex items-center justify-center"
              >
                ✦ Estimate App Cost
              </button>
              <button
                onClick={() => loadChip("How do you guarantee HIPAA compliance?")}
                className="h-10 min-h-[40px] text-[9px] font-mono px-3 bg-white/5 border border-white/10 hover:border-white/20 text-gray-300 rounded-full shrink-0 transition-all cursor-pointer flex items-center justify-center"
              >
                ✦ HIPAA Compliance
              </button>
            </div>

            {/* Input Form footer */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-white/5 flex gap-2 items-center z-10">
              <input
                type="text"
                placeholder="Query systems details..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 h-12 min-h-[48px] bg-black border border-white/10 rounded-xl px-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange font-mono"
              />
              <button
                type="submit"
                className="w-12 h-12 min-w-[48px] bg-gradient-to-r from-brand-orange to-bright-orange text-white rounded-xl hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center"
                aria-label="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        ) : (
          /* round action trigger button */
          <motion.button
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 bg-gradient-to-r from-brand-orange via-indigo-600 to-indigo-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-indigo-500/20 cursor-pointer relative group"
            id="floating-chatbot-trigger"
          >
            {/* Subtle external ping halo animation */}
            <span className="absolute inset-0 rounded-full bg-brand-orange/20 animate-ping group-hover:animate-none opacity-75" />
            
            <MessageSquare className="w-6 h-6 stroke-[2.2] group-hover:rotate-6 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
