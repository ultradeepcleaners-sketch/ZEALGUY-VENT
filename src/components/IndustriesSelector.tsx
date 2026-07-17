import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Activity, ShoppingBag, Landmark, GraduationCap, Building2, 
  Hotel, HeartHandshake, Home, HelpCircle, Check, ArrowRight, ShieldCheck 
} from "lucide-react";

interface IndustryItem {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  badge: string;
  tagline: string;
  description: string;
  projects: string[];
  metricLabel: string;
  metricValue: string;
  previewTitle: string;
  previewHeaders: string[];
}

const INDUSTRIES_DATA: IndustryItem[] = [
  {
    id: "healthcare",
    name: "Healthcare",
    icon: Activity,
    color: "emerald",
    badge: "HIPAA COMPLIANT",
    tagline: "Medical portals & smart symptoms guidance.",
    description: "We engineer secure EHR-linked patient channels, encrypted triage routers, and real-time telehealth interfaces matching strict medical standards.",
    projects: ["Solis Care Portal", "NeuroScan Diagnostic Client", "Hera Triage Router"],
    metricLabel: "Patient Telemetry Latency",
    metricValue: "sub-10ms",
    previewTitle: "Solis Healthcare Dashboard",
    previewHeaders: ["Active Encrypted Channels", "EHR Sync Status", "Provider SLA"]
  },
  {
    id: "retail",
    name: "Retail & E-comm",
    icon: ShoppingBag,
    color: "amber",
    badge: "STRIPE PARTNER",
    tagline: "High conversion shopping & premium checkouts.",
    description: "Orchestrating bespoke e-commerce engines, headless checkouts, and CRM loops that maximize lifetime user value (LTV).",
    projects: ["Aura Fashion Headless", "Velvet Wear App", "Apex Dropship Core"],
    metricLabel: "Average Checkout Speed",
    metricValue: "0.24 seconds",
    previewTitle: "Apex Headless Checkout Node",
    previewHeaders: ["Cart Conversion rate", "Taxes & Duties Api", "Inventory Sync"]
  },
  {
    id: "finance",
    name: "Finance & Wealth",
    icon: Landmark,
    color: "blue",
    badge: "SEC & FINRA SAFE",
    tagline: "Sleek wealth telemetry & asset charts.",
    description: "Building military-grade security channels, responsive asset analytics charts, and high-frequency webhook transactions.",
    projects: ["Vanguard Asset Hub", "Meridian Wealth App", "Vertex Broker API"],
    metricLabel: "TLS Handshake Sanity",
    metricValue: "99.999% Verified",
    previewTitle: "Vanguard Asset Portfolio Console",
    previewHeaders: ["Direct Liquidity Pool", "Compliance Auditing", "Risk Ratios"]
  },
  {
    id: "education",
    name: "Education",
    icon: GraduationCap,
    color: "purple",
    badge: "LTI COMPLIANT",
    tagline: "Interactive classrooms & learning portals.",
    description: "Interactive course platforms, custom gamified learning maps, and secure parent-student portal dashboards.",
    projects: ["LearnLab Custom LMS", "Apex Prep Portal", "Academia Global Hub"],
    metricLabel: "Student Engagement Rate",
    metricValue: "+42% Over Baseline",
    previewTitle: "Academia LMS Admin View",
    previewHeaders: ["Active Class Streams", "Curriculum Assets", "SLA Reports"]
  },
  {
    id: "hospitality",
    name: "Hospitality",
    icon: Hotel,
    color: "rose",
    badge: "REAL-TIME SYNC",
    tagline: "Sleek direct booking & property nodes.",
    description: "We eliminate expensive middleman fees with high-performance direct booking websites, calendar feeds, and automated email channels.",
    projects: ["Solis Luxury Retreats", "Aether Lodging Node", "Elite Concierge Web"],
    metricLabel: "Direct Booking Conversion",
    metricValue: "+35% Year-Over-Year",
    previewTitle: "Solis Lodge Scheduler",
    previewHeaders: ["Direct Calendar Sync", "Housekeeping Sockets", "POS Senders"]
  },
  {
    id: "nonprofit",
    name: "Church & Nonprofit",
    icon: HeartHandshake,
    color: "sky",
    badge: "COMMUNITY FIRST",
    tagline: "Secure contribution & live stream channels.",
    description: "Custom donor pipelines, responsive live streaming modules, and volunteer organizers built to unite communities.",
    projects: ["Grace Community Hub", "Aether Hope Project", "Vanguard Impact Core"],
    metricLabel: "Recurring Donor Retention",
    metricValue: "+48% Growth Flow",
    previewTitle: "Grace Community Core",
    previewHeaders: ["Donor Gateway", "Volunteers Checklist", "Live Stream Status"]
  }
];

export default function IndustriesSelector() {
  const [activeIndKey, setActiveIndKey] = useState<string>("healthcare");
  const currentInd = INDUSTRIES_DATA.find((ind) => ind.id === activeIndKey) || INDUSTRIES_DATA[0];

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (index + 1) % INDUSTRIES_DATA.length;
      setActiveIndKey(INDUSTRIES_DATA[nextIndex].id);
      setTimeout(() => {
        const nextBtn = document.getElementById(`industry-btn-${INDUSTRIES_DATA[nextIndex].id}`);
        nextBtn?.focus();
      }, 0);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (index - 1 + INDUSTRIES_DATA.length) % INDUSTRIES_DATA.length;
      setActiveIndKey(INDUSTRIES_DATA[prevIndex].id);
      setTimeout(() => {
        const prevBtn = document.getElementById(`industry-btn-${INDUSTRIES_DATA[prevIndex].id}`);
        prevBtn?.focus();
      }, 0);
    } else if (e.key === "Escape") {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    }
  };

  // Dynamic Tailwind styling helper
  const getColorClasses = (color: string) => {
    switch (color) {
      case "emerald":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
          ring: "ring-emerald-500/20",
          text: "text-emerald-400",
          gradient: "from-emerald-500/20 to-teal-500/0"
        };
      case "amber":
        return {
          bg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
          ring: "ring-amber-500/20",
          text: "text-amber-400",
          gradient: "from-amber-500/20 to-orange-500/0"
        };
      case "blue":
        return {
          bg: "bg-blue-500/10 border-blue-500/30 text-blue-400",
          ring: "ring-blue-500/20",
          text: "text-blue-400",
          gradient: "from-blue-500/20 to-indigo-500/0"
        };
      case "purple":
        return {
          bg: "bg-purple-500/10 border-purple-500/30 text-purple-400",
          ring: "ring-purple-500/20",
          text: "text-purple-400",
          gradient: "from-purple-500/20 to-pink-500/0"
        };
      case "rose":
        return {
          bg: "bg-rose-500/10 border-rose-500/30 text-rose-400",
          ring: "ring-rose-500/20",
          text: "text-rose-400",
          gradient: "from-rose-500/20 to-red-500/0"
        };
      default:
        return {
          bg: "bg-sky-500/10 border-sky-500/30 text-sky-400",
          ring: "ring-sky-500/20",
          text: "text-sky-400",
          gradient: "from-sky-500/20 to-blue-500/0"
        };
    }
  };

  const style = getColorClasses(currentInd.color);

  return (
    <div className="w-full bg-[#090e24]/60 border border-white/10 rounded-2xl p-6 lg:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl" id="industries-vibe-selector">
      {/* Background radial glowing light */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#0C2D70]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />

      {/* Industries buttons list */}
      <div className="flex flex-wrap gap-2.5 justify-center mb-8 pb-6 border-b border-white/5" role="tablist" aria-label="Industry solutions showcase">
        {INDUSTRIES_DATA.map((ind, idx) => {
          const IndIcon = ind.icon;
          const isSelected = activeIndKey === ind.id;
          const indStyle = getColorClasses(ind.color);

          return (
            <button
              key={ind.id}
              id={`industry-btn-${ind.id}`}
              role="tab"
              aria-selected={isSelected}
              aria-controls={`industry-panel-${ind.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setActiveIndKey(ind.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090e24] ${
                isSelected
                  ? `${indStyle.bg} ${indStyle.ring} ring-2 focus-visible:ring-indigo-500`
                  : "bg-[#030614] border-white/5 text-gray-400 hover:text-white focus-visible:ring-gray-400"
              }`}
            >
              <IndIcon className="w-4 h-4 shrink-0" />
              {ind.name}
            </button>
          );
        })}
      </div>

      {/* Layout Grid details */}
      <div 
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        role="tabpanel"
        id={`industry-panel-${currentInd.id}`}
        aria-labelledby={`industry-btn-${currentInd.id}`}
      >
        
        {/* Left Side: Specific details list */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold border ${style.bg}`}>
                {currentInd.badge}
              </span>
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                VERIFIED ECOSYSTEM
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">
                {currentInd.name} Solutions
              </h3>
              <p className={`text-sm font-semibold font-mono ${style.text}`}>
                "{currentInd.tagline}"
              </p>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              {currentInd.description}
            </p>
          </div>

          {/* Active Projects checklist */}
          <div className="space-y-3 bg-[#030614]/80 border border-white/5 p-4 rounded-xl">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">
              REPRESENTATIVE CASE SYSTEMS:
            </span>
            <div className="space-y-2">
              {currentInd.projects.map((proj, idx) => (
                <div key={idx} className="flex gap-2.5 items-center text-xs font-sans text-gray-300">
                  <ShieldCheck className={`w-4 h-4 ${style.text}`} />
                  <span className="font-medium">{proj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Metric Block */}
          <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg flex justify-between items-center text-xs font-mono">
            <span className="text-gray-500 uppercase tracking-wider">{currentInd.metricLabel}</span>
            <span className={`font-bold ${style.text}`}>{currentInd.metricValue}</span>
          </div>
        </div>

        {/* Right Side: Tailored dashboard mockup screen */}
        <div className="lg:col-span-7 flex flex-col bg-[#030614] border border-white/15 rounded-xl overflow-hidden min-h-[340px] shadow-2xl relative justify-between">
          {/* Top Bar browser window */}
          <div className="bg-white/5 px-4 py-2 flex items-center justify-between text-[10px] text-gray-500 border-b border-white/5 font-mono select-none">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500/50" />
              <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
              <span className="w-2 h-2 rounded-full bg-green-500/50" />
            </div>
            <span>secure_node.{currentInd.id}.zealguy.studio</span>
            <span className="text-emerald-400 uppercase text-[9px] font-bold">● ACTIVE</span>
          </div>

          {/* Core content view */}
          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-white tracking-tight">{currentInd.previewTitle}</span>
              <span className={`text-[10px] font-mono ${style.text}`}>{currentInd.badge}</span>
            </div>

            {/* Simulated mini grid widgets */}
            <div className="grid grid-cols-3 gap-3">
              {currentInd.previewHeaders.map((head, i) => (
                <div key={i} className="p-3 bg-white/[0.02] border border-white/5 rounded-lg space-y-1">
                  <span className="text-[8px] font-mono text-gray-500 uppercase block">{head}</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[10px] font-mono text-white font-bold">SECURE</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Decorative layout outline resembling code/charts */}
            <div className="bg-black/40 rounded-lg p-3.5 border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-[9px] font-mono text-gray-500">
                <span>ENCRYPTED REQ SHARDS</span>
                <span>JWT ACCESS FILTER</span>
              </div>
              <div className="h-6 w-full flex items-end gap-1">
                <div className="w-full bg-emerald-500/10 h-[30%] rounded-xs" />
                <div className="w-full bg-emerald-500/20 h-[50%] rounded-xs" />
                <div className="w-full bg-emerald-500/30 h-[95%] rounded-xs" />
                <div className="w-full bg-emerald-500/15 h-[60%] rounded-xs" />
                <div className="w-full bg-[#FF7A00] h-[75%] rounded-xs" />
              </div>
            </div>
          </div>

          {/* Footer guide */}
          <div className="p-3 border-t border-white/5 text-[9px] font-mono text-gray-500 text-center uppercase select-none">
            ✦ Visual compiled live inside the {currentInd.name} ecosystem preview node ✦
          </div>
        </div>

      </div>
    </div>
  );
}
