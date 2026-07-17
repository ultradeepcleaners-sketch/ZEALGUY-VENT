import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Globe, 
  Linkedin, 
  Twitter, 
  Github 
} from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function ContactView() {
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState("10k-25k");
  const [launch, setLaunch] = useState("");
  const [msg, setMsg] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || isSubmitting) return;
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "contact_submissions"), {
        name: name.trim(),
        email: email.trim(),
        budget,
        launchDate: launch.trim() || "Immediate / Undefined",
        message: `${msg.trim()} | Selected Slot: ${selectedSlot || "None"}`,
        createdAt: serverTimestamp()
      });

      setSubmitted(true);
      setIsSubmitting(false);
      setTimeout(() => {
        setSubmitted(false);
        setName("");
        setEmail("");
        setLaunch("");
        setMsg("");
        setSelectedSlot("");
      }, 6000);
    } catch (err) {
      console.error("Submission failed:", err);
      setIsSubmitting(false);
    }
  };

  const slots = [
    "Mon 10:00 AM EST",
    "Tues 2:00 PM EST",
    "Wed 11:30 AM EST",
    "Thurs 4:00 PM EST"
  ];

  return (
    <div className="space-y-16 py-12 text-left">
      {/* Top Section */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-brand-orange uppercase tracking-widest animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ESTABLISH VIP COORDINATES</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Initiate Architectural Discovery</h1>
        <p className="text-xs text-gray-400 font-sans leading-relaxed">
          Provide your project dimensions to lock down a 30-minute system consultation with our lead software architect.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5vw mx-auto items-start">
        {/* Left Column: Coordinates & Information */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#070c24]/30 border border-white/5 rounded-[32px] p-6 sm:p-8 space-y-6">
            <span className="text-[10px] font-mono text-[#FF7A00] uppercase tracking-widest block">Direct Channels</span>
            
            <div className="space-y-4">
              {/* Phone */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-[14px] bg-white/5 border border-white/10 flex items-center justify-center text-[#FF7A00] flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Direct Hotline</h4>
                  <p className="text-xs font-mono text-gray-400 hover:text-white transition-colors">+1 (555) 823-7446</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-[14px] bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Secure Email</h4>
                  <p className="text-xs font-mono text-gray-400 hover:text-white transition-colors">hello@zealguyventure.com</p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-[14px] bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">WhatsApp Secure Link</h4>
                  <a 
                    href="https://wa.me/233555055963" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    Open Instant Chat <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-4 font-mono text-[11px] text-gray-400">
              {/* Business Hours */}
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-500" /> Business Hours:</span>
                <span className="text-white font-bold">Mon - Fri, 9AM - 6PM EST</span>
              </div>

              {/* Response SLA */}
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500 animate-pulse" /> Response SLA:</span>
                <span className="text-emerald-400 font-bold">Under 2 Hours</span>
              </div>

              {/* Headquarters */}
              <div className="flex justify-between items-start">
                <span className="flex items-center gap-1.5 flex-shrink-0"><MapPin className="w-4 h-4 text-gray-500" /> HQ Location:</span>
                <span className="text-right text-white">Digital Headquarters / London, UK</span>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="h-44 bg-slate-950/80 border border-white/5 rounded-[24px] overflow-hidden relative flex items-center justify-center text-center p-6">
            <div className="absolute inset-0 bg-gradient-radial from-blue-500/5 via-transparent to-transparent opacity-60" />
            <div className="space-y-2 relative">
              <Globe className="w-8 h-8 text-blue-500/40 mx-auto animate-spin" style={{ animationDuration: "12s" }} />
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Interactive Network Map Connected</p>
              <p className="text-[9px] text-gray-600 font-sans">Serving enterprise clients across London, San Francisco, Dubai, and Singapore.</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4 py-2">
            <a href="#" className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:border-[#FF7A00] hover:text-[#FF7A00] transition-all" aria-label="Twitter">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:border-blue-400 hover:text-blue-400 transition-all" aria-label="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:border-purple-400 hover:text-purple-400 transition-all" aria-label="GitHub">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right Column: Dynamic Consultation Form */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form 
                key="contact-view-form"
                onSubmit={handleSubmit} 
                className="bg-[#090e24]/60 border border-white/10 rounded-[32px] p-6 sm:p-8 space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-gray-400 uppercase">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Satoshi"
                      className="w-full h-12 min-h-[48px] bg-[#030614] border border-white/10 rounded-[14px] px-3.5 py-3 text-xs text-white focus:outline-none focus:border-[#FF7A00] focus:scale-[1.01] font-mono transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-gray-400 uppercase">Your Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. satoshi@bitcoin.org"
                      className="w-full h-12 min-h-[48px] bg-[#030614] border border-white/10 rounded-[14px] px-3.5 py-3 text-xs text-white focus:outline-none focus:border-[#FF7A00] focus:scale-[1.01] font-mono transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-gray-400 uppercase">Project Budget</label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full h-12 min-h-[48px] bg-[#030614] border border-white/10 rounded-[14px] px-3 py-3 text-xs text-white focus:outline-none focus:border-[#FF7A00] focus:scale-[1.01] font-mono transition-all duration-200 cursor-pointer"
                    >
                      <option value="5k-10k">$5,000 - $10,000</option>
                      <option value="10k-25k">$10,000 - $25,000</option>
                      <option value="25k-50k">$25,000 - $50,000</option>
                      <option value="50k+">$50,000+ Premium</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-gray-400 uppercase">Target Launch</label>
                    <input
                      type="text"
                      value={launch}
                      onChange={(e) => setLaunch(e.target.value)}
                      placeholder="e.g. Next 30 Days"
                      className="w-full h-12 min-h-[48px] bg-[#030614] border border-white/10 rounded-[14px] px-3.5 py-3 text-xs text-white focus:outline-none focus:border-[#FF7A00] focus:scale-[1.01] font-mono transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono text-gray-400 uppercase">Interactive Calendar Slots (Optional)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {slots.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`h-12 min-h-[48px] p-2 flex items-center justify-center rounded-[10px] text-center border transition-all text-[10px] font-mono cursor-pointer ${
                          selectedSlot === slot
                            ? "bg-[#FF7A00]/10 border-brand-orange text-white"
                            : "bg-white/5 border-white/5 hover:bg-white/10 text-gray-400"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono text-gray-400 uppercase">Project Brief / Core Vision</label>
                  <textarea
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="Describe your design aesthetics, desired functionalities, or compliance requirements..."
                    rows={4}
                    className="w-full bg-[#030614] border border-white/10 rounded-[14px] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF7A00] focus:scale-[1.01] font-sans resize-none transition-all duration-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 min-h-[48px] bg-[#FF7A00] hover:bg-orange-500 text-white font-mono text-xs font-bold rounded-[14px] shadow-lg hover:shadow-[0_0_15px_rgba(255,122,0,0.3)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? "Dispatching Metadata..." : "Schedule Architectural Session"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="contact-view-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#090e24]/60 border border-white/10 rounded-[32px] p-8 text-center space-y-6 flex flex-col items-center justify-center h-full min-h-[400px]"
              >
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-xl font-bold text-white tracking-tight">VIP Channel Synchronized</h4>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                    Thank you <span className="text-white font-semibold">{name}</span>. Your system requirements and request have been securely stored.
                  </p>
                </div>

                <div className="bg-[#030614] border border-white/5 p-4 rounded-[24px] text-xs font-mono text-gray-500 w-full max-w-sm text-left space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span>Database Connection:</span>
                    <span className="text-emerald-400 font-bold">SYNCHRONIZED</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Assigned Contact:</span>
                    <span className="text-gray-300">{email}</span>
                  </div>
                  {selectedSlot && (
                    <div className="flex justify-between items-center">
                      <span>Locked Slot:</span>
                      <span className="text-blue-400 font-semibold">{selectedSlot}</span>
                    </div>
                  )}
                </div>

                <div className="w-full max-w-sm bg-white/5 border border-white/10 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 6, ease: "linear" }}
                    className="bg-emerald-500 h-full"
                  />
                </div>
                <p className="text-[10px] text-gray-500 font-mono animate-pulse">Readying database for secondary triggers...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
