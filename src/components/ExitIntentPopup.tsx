import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Gift, Sparkles, ArrowRight } from "lucide-react";

interface ExitIntentPopupProps {
  onTriggerAudit: () => void;
}

export default function ExitIntentPopup({ onTriggerAudit }: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    // Check if it already popped up in this session
    const shown = sessionStorage.getItem("exit_intent_shown");
    if (shown) {
      setHasTriggered(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // If cursor leaves viewport from the top
      if (e.clientY < 20 && !hasTriggered) {
        setIsVisible(true);
        setHasTriggered(true);
        sessionStorage.setItem("exit_intent_shown", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasTriggered]);

  const handleAccept = () => {
    setIsVisible(false);
    onTriggerAudit();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVisible(false)}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            className="bg-gradient-to-br from-[#0c1435] to-[#050816] border-2 border-[#FF7A00]/40 rounded-[32px] max-w-md w-full p-6 relative overflow-hidden shadow-[0_0_50px_rgba(255,122,0,0.2)] z-10"
          >
            {/* Corner Decorative lights */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF7A00]/10 rounded-full blur-2xl pointer-events-none" />

            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-5">
              <div className="mx-auto w-14 h-14 bg-[#FF7A00]/10 border border-[#FF7A00]/30 rounded-full flex items-center justify-center text-[#FF7A00] shadow-[0_0_15px_rgba(255,122,0,0.15)] animate-pulse">
                <Gift className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 justify-center text-xs font-mono text-purple-400">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>WAIT! BEFORE YOU GO...</span>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight font-display">
                  Unlock Your Free Growth Blueprint
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed font-sans px-2">
                  Don't leave empty-handed. Let our team architect a sub-0.5s web layout mockup and custom database plan specifically for your business, absolutely free.
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={handleAccept}
                  className="w-full h-12 min-h-[48px] bg-gradient-to-r from-purple-600 to-[#FF7A00] hover:from-purple-500 hover:to-orange-500 text-white font-mono text-xs font-bold rounded-[14px] shadow-lg hover:shadow-[0_0_20px_rgba(255,122,0,0.3)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Claim My Free Growth Audit
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="w-full h-12 min-h-[48px] bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-mono text-xs rounded-[14px] transition-colors border border-white/5 flex items-center justify-center"
                >
                  No thanks, I'll miss out
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
