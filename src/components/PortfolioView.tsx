import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FolderOpen, 
  ArrowRight, 
  ExternalLink, 
  Layers, 
  Cpu, 
  LineChart, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Maximize2,
  Calendar,
  RotateCcw
} from "lucide-react";

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  category: string;
  image: string;
  challenge: string;
  objectives: string[];
  solution: string;
  techStack: string[];
  timeline: string;
  results: { label: string; value: string; desc: string }[];
  features: string[];
  accentColor: string; // Tailwind class border
  liveUrl?: string;
}

interface PortfolioViewProps {
  onTriggerConsultation: () => void;
}

export default function PortfolioView({ onTriggerConsultation }: PortfolioViewProps) {
  const [activeCaseId, setActiveCaseId] = useState("biometric-vault");

  const caseStudies: CaseStudy[] = [
    {
      id: "biometric-vault",
      title: "Biometric Medical Vault",
      client: "BioGate Healthcare Inc.",
      industry: "Healthcare & HIPAA Security",
      category: "Bespoke HIPAA Portal",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
      challenge: "BioGate was operating with outdated PHP medical portals that leaked critical session cookies and lagged under concurrent file uploads. Patient biometric files (MRIs and CT scans) took over 15 seconds to pre-render and index securely, directly violating HIPAA audit regulations.",
      objectives: [
        "Eliminate high-latency server loading times below 1.0 second.",
        "Implement military-grade biometric document hash encryption.",
        "Achieve complete regulatory HIPAA/ISO compliance parameters.",
        "Design a responsive desktop and touch-target tablet panel."
      ],
      solution: "We engineered a secure headless patient portal with instant server-side TS type-stripping, complete with an Express API proxy backend. Biometric uploads are routed through localized memory streams and hashed instantly via high-performance encryption keys. Patient files are pre-rendered into static pages at sub-0.4s response velocities.",
      techStack: ["React 19", "Vite", "Express API Router", "SQLite Cipher", "Tailwind CSS", "Lucide Icons"],
      timeline: "6 Weeks (Concept to Compliance)",
      results: [
        { label: "Rendering Velocity", value: "0.35s", desc: "Average patient profile loading speed" },
        { label: "Encryption Security", value: "256-Bit", desc: "AES end-to-end data packet encryption" },
        { label: "Compliance Status", value: "100%", desc: "HIPAA & GDPR external audit score" }
      ],
      features: [
        "Instant responsive file-upload with drag-and-drop capability",
        "Biometric multi-factor session validation checks",
        "Encrypted SQLite audit log tracing every operator write event",
        "Dynamic high-contrast visual display optimized for tablet screens"
      ],
      accentColor: "border-blue-500/30 text-blue-400 hover:border-blue-400"
    },
    {
      id: "ai-financial-forecast",
      title: "Predictive Capital Forecaster",
      client: "Aegis Wealth Management",
      industry: "Quantitative Finance",
      category: "AI Data Platform",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
      challenge: "Aegis wealth specialists had to manually compile spreadsheets from hundreds of client stocks. Manual forecasting was highly error-prone, took 12 hours per client portfolio, and could not dynamically handle stock price ticks or model structured risk portfolios.",
      objectives: [
        "Incorporate a server-side AI analytical model with strict structured schema output.",
        "Compile automated portfolio risk metrics dynamically in real-time.",
        "Reduce portfolio compilation time from 12 hours to less than 15 seconds.",
        "Provide a secure quantitative administrator control dashboard."
      ],
      solution: "We integrated Google GenAI SDK utilizing Gemini 3.1 Pro via secure Express api proxy routers. We modeled strict structured JSON outputs, analyzing client parameters instantly against live stock tickers. We wrapped this in a gorgeous modern dark-mode canvas dashboard showing responsive Recharts graphs.",
      techStack: ["Google GenAI", "Gemini 3.1 Pro", "Recharts", "Node.js Express", "Tailwind CSS", "Motion"],
      timeline: "5 Weeks (Setup to Launch)",
      results: [
        { label: "Computation Velocity", value: "12s", desc: "Risk model synthesis and compilation" },
        { label: "Precision Rate", value: "99.4%", desc: "Structured JSON schema validation score" },
        { label: "Client Capacity Boost", value: "8.5x", desc: "Aegis advisors can manage 850% more portfolios" }
      ],
      features: [
        "Structured Risk-Analysis models featuring stock-ticks weighting",
        "Responsive bento-grid data visualizer showing interactive price graphs",
        "Instant administrative spreadsheet CSV export trigger with one tap",
        "Secure server-side API proxy, keeping corporate tokens fully hidden"
      ],
      accentColor: "border-purple-500/30 text-purple-400 hover:border-purple-400"
    },
    {
      id: "retail-checkout-scale",
      title: "High-Frequency Retail Pipeline",
      client: "Veloce Streetwear",
      industry: "Global E-Commerce Logistics",
      category: "Automated Checkout",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
      challenge: "Veloce streetwear brand experienced major site crashes on high-frequency limited drops. Database writes on standard MySQL locked up under 5,000 concurrent writes, resulting in checkout lag, duplicate charges, and over $50,000 in lost drop revenue.",
      objectives: [
        "Maintain zero-downtime database integrity during 5,000+ concurrent requests.",
        "Achieve sub-0.3s inventory validation and payment processing speed.",
        "Add secure social registration pipelines (Google and Apple OAuth).",
        "Design full responsive shopping views optimized for mobile users."
      ],
      solution: "We established a high-frequency checkout pipeline utilizing Firestore with strict database triggers and Google Cloud Functions. We designed the interface using a custom mobile-first checkout view. We incorporated Firebase Auth to verify user accounts instantly on high-speed servers.",
      techStack: ["Firebase Auth", "Firestore", "Google Cloud Functions", "Vite React", "Tailwind CSS"],
      timeline: "4 Weeks (Analysis to Live Dropping)",
      results: [
        { label: "Concurrent Request Capacity", value: "25,000/m", desc: "Sustained server checkout write hits" },
        { label: "Inventory Speed", value: "0.18s", desc: "Stock verification and lock speed" },
        { label: "Revenue Recovery", value: "98.7%", desc: "Zero double-charge or abandoned checkout states" }
      ],
      features: [
        "Real-time synchronized database counting drops inventory down to single units",
        "Frictionless instant OAuth user checkout logins (Google/Apple)",
        "Mobile-optimized tactile checkout grid, with 48px minimal touch targets",
        "Immediate PDF transaction receipt generator dispatched to email"
      ],
      accentColor: "border-emerald-500/30 text-emerald-400 hover:border-emerald-400"
    },
    {
      id: "tradersphere-africa",
      title: "TraderSphere Africa Portal",
      client: "TraderSphere Network",
      industry: "FinTech & Financial Education",
      category: "Financial Ecosystem Hub",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80",
      challenge: "TraderSphere Africa requested a high-stability, low-latency, and user-centric platform to deliver advanced educational tools, real-time trading metrics, and interactive financial resources to retail traders across Africa without performance decay on cellular devices.",
      objectives: [
        "Design a fast-loading, highly-responsive educational portal.",
        "Implement modern visual modules for real-time market insights.",
        "Minimize server processing overhead and page loading times.",
        "Achieve flawless responsive support across modern mobile screens."
      ],
      solution: "We engineered a clean, high-performance financial ecosystem. Featuring client-side performance caching, lightning-fast routes, and low-bandwidth responsive visual layers, this system provides seamless learning analytics and live portal utilities for cross-continental users.",
      techStack: ["React 19", "Vite", "Tailwind CSS", "Motion", "Lucide Icons", "Bespoke Portals"],
      timeline: "5 Weeks (Discovery to Production)",
      results: [
        { label: "Page Response Time", value: "0.28s", desc: "Average system routing navigation speed" },
        { label: "Uptime Rating", value: "99.99%", desc: "Verified system uptime under market load waves" },
        { label: "User Engagement", value: "+140%", desc: "Increase in retail trader class completion rate" }
      ],
      features: [
        "Highly optimized content distribution delivering interactive modules instantly",
        "Mobile-centric layouts featuring 48px minimal physical touch targets",
        "Integrated financial learning tools and user growth metrics tracking",
        "Unified interface aligning seamlessly with secure web transaction vectors"
      ],
      accentColor: "border-amber-500/30 text-amber-400 hover:border-amber-400",
      liveUrl: "https://tradersphere.africa"
    }
  ];

  const activeCase = caseStudies.find(c => c.id === activeCaseId) || caseStudies[0];

  return (
    <div className="space-y-16 py-12 text-left">
      {/* Top Header */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-purple-400 uppercase tracking-widest animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PROVEN SYSTEMS IN PRODUCTION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Case Portfolio</h1>
        <p className="text-xs text-gray-400 font-sans leading-relaxed">
          Examine four detailed architectural case studies demonstrating high speed, military-grade security, and massive ROI.
        </p>
      </section>

      {/* Case Studies Toggle Menu */}
      <div className="flex flex-col sm:flex-row justify-center items-stretch gap-4 max-w-3xl mx-auto">
        {caseStudies.map((cs) => {
          const isActive = cs.id === activeCaseId;
          return (
            <button
              key={cs.id}
              onClick={() => setActiveCaseId(cs.id)}
              className={`flex-1 p-4 rounded-[20px] border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isActive 
                  ? "bg-[#0c1435] border-[#FF7A00] text-white shadow-[0_0_15px_rgba(255,122,0,0.15)]" 
                  : "bg-[#050816]/60 border-white/5 hover:border-white/15 text-gray-400 hover:text-white"
              }`}
            >
              <div className="space-y-1">
                <span className="text-[9px] font-mono uppercase tracking-widest block text-gray-500">{cs.client}</span>
                <h4 className="text-xs font-bold font-mono tracking-tight text-white">{cs.title}</h4>
              </div>
              <span className={`text-[10px] font-mono font-bold ${isActive ? "text-[#FF7A00]" : "text-gray-400"}`}>
                ✦ {cs.category}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Detailed Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCase.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="bg-[#070c24]/30 border border-white/5 rounded-[32px] overflow-hidden"
        >
          {/* Top banner / image */}
          <div className="h-56 sm:h-72 w-full relative">
            <img 
              src={activeCase.image} 
              alt={activeCase.title}
              className="w-full h-full object-cover filter brightness-[0.45] saturate-[0.8]"
              referrerPolicy="no-referrer"
            />
            {/* Ambient gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030817] via-[#030817]/60 to-transparent" />
            <div className="absolute bottom-6 left-6 sm:left-10 text-left space-y-1">
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full">
                {activeCase.industry}
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white font-display tracking-tight">{activeCase.title}</h2>
              <p className="text-xs text-gray-400 font-mono">Client Entity: <strong className="text-white">{activeCase.client}</strong></p>
            </div>
          </div>

          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Main specifications */}
            <div className="lg:col-span-8 space-y-6">
              {/* Challenge */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono text-red-400 flex items-center gap-1.5">
                  <Maximize2 className="w-4 h-4" /> The Operational Challenge
                </h3>
                <p className="text-xs text-gray-400 font-sans leading-relaxed">{activeCase.challenge}</p>
              </div>

              {/* Solution */}
              <div className="space-y-2 pt-4 border-t border-white/5">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono text-emerald-400 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" /> Customized Solution Engineering
                </h3>
                <p className="text-xs text-gray-400 font-sans leading-relaxed">{activeCase.solution}</p>
              </div>

              {/* Key Objectives */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Key Project Objectives</h4>
                  <ul className="space-y-2 text-xs text-gray-400 font-sans">
                    {activeCase.objectives.map((obj, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Key Features Implemented</h4>
                  <ul className="space-y-2 text-xs text-gray-400 font-sans">
                    {activeCase.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FF7A00] flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column - Results Matrix */}
            <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
              {/* Results */}
              <div className="bg-slate-950/60 border border-white/15 rounded-[24px] p-6 space-y-5 text-left">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> AUDITED PERFORMANCE METRICS
                </h4>
                
                <div className="space-y-4">
                  {activeCase.results.map((r, idx) => (
                    <div key={idx} className="space-y-0.5 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">{r.label}</span>
                        <span className="text-lg font-bold text-white font-mono">{r.value}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-sans leading-tight">{r.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Stats */}
              <div className="bg-[#050816]/40 p-5 rounded-[24px] border border-white/5 space-y-3 text-left font-mono text-[11px] text-gray-400">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-400" /> Timeline:</span>
                  <span className="text-white font-bold">{activeCase.timeline}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-[#FF7A00]" /> Tech Stack:</span>
                  <div className="text-right flex flex-wrap justify-end gap-1 max-w-[150px]">
                    {activeCase.techStack.map((tech, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] text-gray-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  {activeCase.liveUrl && (
                    <a
                      href={activeCase.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-12 min-h-[48px] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-[14px] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg hover:shadow-[0_0_15px_rgba(147,51,234,0.2)]"
                    >
                      Visit Live Website
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={onTriggerConsultation}
                    className="w-full h-12 min-h-[48px] bg-[#FF7A00] hover:bg-orange-500 text-white text-xs font-bold rounded-[14px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Request Similar Implementation
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
