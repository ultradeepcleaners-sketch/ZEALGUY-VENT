import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, CheckCircle2, Globe, ArrowRight, ShieldCheck, Mail } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

interface WebsiteAuditModalProps {
  isOpen: boolean;
  onClose: () => { void } | any;
}

export default function WebsiteAuditModal({ isOpen, onClose }: WebsiteAuditModalProps) {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteUrl.trim() || !email.trim() || isSubmitting) return;
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "audit_requests"), {
        name: name.trim() || "Web Guest",
        websiteUrl: websiteUrl.trim(),
        email: email.trim(),
        status: "pending",
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
      setIsSubmitting(false);
      setTimeout(() => {
        setSubmitted(false);
        setWebsiteUrl("");
        setEmail("");
        setName("");
        onClose();
      }, 5000);
    } catch (err) {
      console.error("Audit request failed:", err);
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
          />

          <motion.div
            initial={isMobile ? { y: "100%", opacity: 0.5 } : { scale: 0.95, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={isMobile ? { y: "100%", opacity: 0.5 } : { scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="bg-[#090e24]/95 border-t border-x sm:border border-white/10 rounded-t-[32px] sm:rounded-[32px] rounded-b-none sm:rounded-b-[32px] max-w-lg w-full p-6 sm:p-8 relative overflow-hidden shadow-2xl z-10 backdrop-blur-xl max-h-[90vh] overflow-y-auto"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-gradient-radial from-[#FF7A00]/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-gradient-radial from-purple-500/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="audit-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF7A00]/10 border border-[#FF7A00]/30 rounded-full text-[10px] font-mono text-[#FF7A00] uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Complimentary Optimization</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-tight font-display">
                      Get a Free Comprehensive Website & Growth Audit
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-sans">
                      Our elite systems engineers and SEO architects will manually audit your speed, visual design, UX flaws, and SEO positioning. No automated templates — a real, actionable blueprint.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono text-gray-400 uppercase">Your Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Satoshi Nakamoto"
                        className="w-full h-12 min-h-[48px] bg-[#030614] border border-white/10 rounded-[14px] px-3.5 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FF7A00] focus:scale-[1.01] focus:shadow-[0_0_12px_rgba(255,122,0,0.25)] font-sans transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono text-gray-400 uppercase">Website URL *</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={websiteUrl}
                          onChange={(e) => setWebsiteUrl(e.target.value)}
                          placeholder="e.g. https://yourcompany.com"
                          className="w-full h-12 min-h-[48px] bg-[#030614] border border-white/10 rounded-[14px] px-3.5 py-3 pl-10 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FF7A00] focus:scale-[1.01] focus:shadow-[0_0_12px_rgba(255,122,0,0.25)] font-sans transition-all duration-200"
                        />
                        <Globe className="w-4 h-4 text-gray-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono text-gray-400 uppercase">Your Business Email *</label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. satoshi@bitcoin.org"
                          className="w-full h-12 min-h-[48px] bg-[#030614] border border-white/10 rounded-[14px] px-3.5 py-3 pl-10 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FF7A00] focus:scale-[1.01] focus:shadow-[0_0_12px_rgba(255,122,0,0.25)] font-sans transition-all duration-200"
                        />
                        <Mail className="w-4 h-4 text-gray-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>We respect your privacy. 100% Secure & confidential.</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 min-h-[48px] bg-[#FF7A00] hover:bg-orange-500 text-white font-mono text-xs font-bold rounded-[14px] shadow-lg hover:shadow-[0_0_15px_rgba(255,122,0,0.3)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? "Generating Ticket..." : "Request Premium Audit"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="audit-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-6 space-y-4 flex flex-col items-center justify-center"
                >
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] mb-2 animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-white tracking-tight font-display">
                    Audit Ticket Synchronized!
                  </h4>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                    Thank you <span className="text-white font-semibold">{name || "there"}</span>. We have successfully registered your URL <span className="text-blue-400 font-mono text-[11px] block mt-1">{websiteUrl}</span>.
                  </p>
                  <p className="text-[11px] text-gray-500 font-sans max-w-xs leading-relaxed">
                    Our lead architect will inspect your platform and deliver a tailored diagnostic report to <strong className="text-gray-300">{email}</strong> within 24-48 business hours.
                  </p>
                  <div className="w-full bg-white/5 border border-white/10 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "100%" }}
                      animate={{ width: "0%" }}
                      transition={{ duration: 5, ease: "linear" }}
                      className="bg-emerald-500 h-full"
                    />
                  </div>
                  <span className="text-[9px] text-gray-500 font-mono uppercase">Closing modal...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
