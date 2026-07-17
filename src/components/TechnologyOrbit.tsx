import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Code, Server, Cpu, Layers, Database, Cloud, Globe, ExternalLink } from "lucide-react";

interface TechDetails {
  name: string;
  category: "Frontend" | "Backend" | "Cloud & AI";
  tagline: string;
  usage: string;
  metric: string;
  color: string;
  icon: React.ComponentType<any>;
}

const TECH_DATA: Record<string, TechDetails> = {
  react: {
    name: "React 19",
    category: "Frontend",
    tagline: "Component-driven declarative interface architecture.",
    usage: "We leverage React with compiled bundlers to deliver highly responsive, interactive interfaces, modularizing complex enterprise states into sleek client-portal hubs.",
    metric: "60fps Fluid Render Speed",
    color: "from-blue-400 to-indigo-500",
    icon: Code,
  },
  nextjs: {
    name: "Next.js",
    category: "Frontend",
    tagline: "React framework for high-speed edge pre-rendering.",
    usage: "Employed for server-side pre-rendering and routing, allowing search engine optimization (SEO) and visual websites to achieve perfect 100/100 Core Web Vitals score.",
    metric: "perfect 100/100 Core Web Vitals",
    color: "from-slate-300 to-slate-500",
    icon: Layers,
  },
  tailwind: {
    name: "Tailwind CSS",
    category: "Frontend",
    tagline: "Utility-first design scaling framework.",
    usage: "Provides complete visual utility customization. Eliminates unused layout code during production compiles, guaranteeing rapid asset load times.",
    metric: "-80% Production CSS Overhead",
    color: "from-teal-400 to-cyan-500",
    icon: Globe,
  },
  flutter: {
    name: "Flutter",
    category: "Frontend",
    tagline: "High-performance multiplatform native compiles.",
    usage: "We compile native mobile applications for iOS and Android with single-codebase velocity, yielding fluid touch animations and seamless biometric hooks.",
    metric: "120Hz Native Screen Smoothness",
    color: "from-sky-400 to-blue-600",
    icon: Layers,
  },
  typescript: {
    name: "TypeScript",
    category: "Frontend",
    tagline: "Strict type-safe modular javascript development.",
    usage: "Guarantees absolute type-safety and visual state sanity across heavy financial dashboards, reducing unexpected client portal runtime errors to near zero.",
    metric: "0% Production Type Failures",
    color: "from-blue-500 to-indigo-600",
    icon: Code,
  },
  node: {
    name: "Node.js (Express)",
    category: "Backend",
    tagline: "Asynchronous backend event pipelines.",
    usage: "Powers high-speed server proxies, routing millions of telemetry tokens to deep learning models and database shards synchronously.",
    metric: "sub-20ms Response Latency",
    color: "from-green-400 to-emerald-600",
    icon: Server,
  },
  supabase: {
    name: "Supabase / SQL",
    category: "Backend",
    tagline: "Relational database shards with instant row tracking.",
    usage: "We implement relational database structures with multi-layer TLS and row-level security (RLS) filters to maintain complete client record integrity.",
    metric: "SSL/TLS Real-time Data Sync",
    color: "from-emerald-500 to-teal-700",
    icon: Database,
  },
  firebase: {
    name: "Firebase / Firestore",
    category: "Backend",
    tagline: "Serverless real-time cloud database structures.",
    usage: "Utilized for instant telemetry streams, anonymous login permissions, and real-time support chat feeds connected to our administrators.",
    metric: "Instant Document Synchronization",
    color: "from-orange-400 to-red-500",
    icon: Database,
  },
  ai: {
    name: "Gemini / Custom LLM",
    category: "Cloud & AI",
    tagline: "Deep reasoning model intelligence integration.",
    usage: "We embed Gemini models server-side, enabling prospects to auto-generate customized business plans and forecast project metrics on the fly.",
    metric: "Pro-level Thinking Insights",
    color: "from-purple-400 to-indigo-500",
    icon: Cpu,
  },
  aws: {
    name: "AWS Ingress",
    category: "Cloud & AI",
    tagline: "Global autoscaling hosting grids.",
    usage: "We orchestrate container pods across cloud architectures, automatically spinning up nodes based on current traffic flow density.",
    metric: "99.99% Guaranteed Server Uptime",
    color: "from-amber-400 to-orange-500",
    icon: Cloud,
  },
  cloudflare: {
    name: "Cloudflare Edge",
    category: "Cloud & AI",
    tagline: "Distributed network protection & edge caching.",
    usage: "Caches assets, files, and static headers directly in 275+ global cities, shielding platforms against heavy bot attacks and reducing TTL lag.",
    metric: "sub-10ms Global TTL Speed",
    color: "from-orange-500 to-amber-600",
    icon: Globe,
  },
  docker: {
    name: "Docker Containers",
    category: "Cloud & AI",
    tagline: "Isolated sandboxed application packages.",
    usage: "We containerize deployment layers to maintain complete architectural isolation, making systems fully portable to Google Cloud or AWS instantly.",
    metric: "100% Sandbox Isolation Security",
    color: "from-blue-400 to-sky-500",
    icon: Layers,
  }
};

export default function TechnologyOrbit() {
  const [selectedTechKey, setSelectedTechKey] = useState<string>("ai");
  const currentTech = TECH_DATA[selectedTechKey];

  return (
    <div className="w-full bg-[#090e24]/60 border border-white/10 rounded-2xl p-6 lg:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl" id="technology-orbit-container">
      {/* Background glow anchors */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#0C2D70]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Orbit Grid Map */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative py-10 min-h-[400px]">
          {/* Orbital grid circles background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            {/* Outer circle: Cloud & AI */}
            <div className="w-[340px] h-[340px] rounded-full border border-white/5 flex items-center justify-center">
              {/* Middle circle: Backend */}
              <div className="w-[240px] h-[240px] rounded-full border border-dashed border-white/10 flex items-center justify-center animate-spin-slow">
                {/* Inner circle: Frontend */}
                <div className="w-[140px] h-[140px] rounded-full border border-white/5 flex items-center justify-center" />
              </div>
            </div>
          </div>

          {/* Interactive floating Tech nodes */}
          <div className="relative w-[340px] h-[340px] flex items-center justify-center z-10">
            {/* Center Node: ZEALGUY Core */}
            <div className="absolute w-14 h-14 bg-[#071E4A] border-2 border-brand-orange rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,122,0,0.4)]">
              <span className="text-[10px] font-black tracking-widest text-white">ZG</span>
            </div>

            {/* Concentric Circle 1 (Frontend Ring - Radius ~70px) */}
            <div className="absolute inset-0 pointer-events-none">
              {/* React */}
              <button
                onClick={() => setSelectedTechKey("react")}
                className={`pointer-events-auto absolute w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  selectedTechKey === "react" ? "bg-blue-500 text-white scale-110 shadow-[0_0_15px_#3b82f6]" : "bg-[#030614]/85 text-blue-400 hover:text-white border border-blue-500/30"
                }`}
                style={{ top: "110px", left: "100px" }}
              >
                <Code className="w-4 h-4" />
              </button>

              {/* Next.js */}
              <button
                onClick={() => setSelectedTechKey("nextjs")}
                className={`pointer-events-auto absolute w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  selectedTechKey === "nextjs" ? "bg-slate-300 text-black scale-110 shadow-[0_0_15px_#fff]" : "bg-[#030614]/85 text-slate-300 hover:text-white border border-slate-300/30"
                }`}
                style={{ top: "110px", right: "100px" }}
              >
                <Layers className="w-4 h-4" />
              </button>

              {/* Tailwind */}
              <button
                onClick={() => setSelectedTechKey("tailwind")}
                className={`pointer-events-auto absolute w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  selectedTechKey === "tailwind" ? "bg-teal-500 text-white scale-110 shadow-[0_0_15px_#14b8a6]" : "bg-[#030614]/85 text-teal-400 hover:text-white border border-teal-500/30"
                }`}
                style={{ bottom: "110px", left: "100px" }}
              >
                <Globe className="w-4 h-4" />
              </button>

              {/* TypeScript */}
              <button
                onClick={() => setSelectedTechKey("typescript")}
                className={`pointer-events-auto absolute w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  selectedTechKey === "typescript" ? "bg-blue-600 text-white scale-110 shadow-[0_0_15px_#2563eb]" : "bg-[#030614]/85 text-blue-500 hover:text-white border border-blue-500/30"
                }`}
                style={{ bottom: "110px", right: "100px" }}
              >
                <Code className="w-4 h-4" />
              </button>
            </div>

            {/* Concentric Circle 2 (Backend Ring - Radius ~120px) */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Node */}
              <button
                onClick={() => setSelectedTechKey("node")}
                className={`pointer-events-auto absolute w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  selectedTechKey === "node" ? "bg-green-600 text-white scale-110 shadow-[0_0_15px_#16a34a]" : "bg-[#030614]/85 text-green-400 hover:text-white border border-green-500/30"
                }`}
                style={{ top: "50px", left: "150px" }}
              >
                <Server className="w-4 h-4" />
              </button>

              {/* Supabase */}
              <button
                onClick={() => setSelectedTechKey("supabase")}
                className={`pointer-events-auto absolute w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  selectedTechKey === "supabase" ? "bg-emerald-600 text-white scale-110 shadow-[0_0_15px_#059669]" : "bg-[#030614]/85 text-emerald-400 hover:text-white border border-emerald-500/30"
                }`}
                style={{ bottom: "50px", left: "150px" }}
              >
                <Database className="w-4 h-4" />
              </button>

              {/* Firebase */}
              <button
                onClick={() => setSelectedTechKey("firebase")}
                className={`pointer-events-auto absolute w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  selectedTechKey === "firebase" ? "bg-orange-500 text-white scale-110 shadow-[0_0_15px_#f97316]" : "bg-[#030614]/85 text-orange-400 hover:text-white border border-orange-500/30"
                }`}
                style={{ top: "150px", right: "45px" }}
              >
                <Database className="w-4 h-4" />
              </button>

              {/* Flutter */}
              <button
                onClick={() => setSelectedTechKey("flutter")}
                className={`pointer-events-auto absolute w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  selectedTechKey === "flutter" ? "bg-sky-500 text-white scale-110 shadow-[0_0_15px_#0ea5e9]" : "bg-[#030614]/85 text-sky-400 hover:text-white border border-sky-500/30"
                }`}
                style={{ top: "150px", left: "45px" }}
              >
                <Layers className="w-4 h-4" />
              </button>
            </div>

            {/* Concentric Circle 3 (Cloud & AI Outer Ring - Radius ~170px) */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Gemini AI */}
              <button
                onClick={() => setSelectedTechKey("ai")}
                className={`pointer-events-auto absolute w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  selectedTechKey === "ai" ? "bg-purple-600 text-white scale-110 shadow-[0_0_20px_#9333ea]" : "bg-[#030614]/85 text-purple-400 hover:text-white border border-purple-500/30"
                }`}
                style={{ top: "8px", left: "94px" }}
              >
                <Cpu className="w-5 h-5" />
              </button>

              {/* AWS */}
              <button
                onClick={() => setSelectedTechKey("aws")}
                className={`pointer-events-auto absolute w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  selectedTechKey === "aws" ? "bg-amber-500 text-white scale-110 shadow-[0_0_15px_#f59e0b]" : "bg-[#030614]/85 text-amber-400 hover:text-white border border-amber-500/30"
                }`}
                style={{ top: "8px", right: "94px" }}
              >
                <Cloud className="w-4 h-4" />
              </button>

              {/* Cloudflare */}
              <button
                onClick={() => setSelectedTechKey("cloudflare")}
                className={`pointer-events-auto absolute w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  selectedTechKey === "cloudflare" ? "bg-orange-600 text-white scale-110 shadow-[0_0_15px_#ea580c]" : "bg-[#030614]/85 text-orange-400 hover:text-white border border-orange-500/30"
                }`}
                style={{ bottom: "8px", right: "94px" }}
              >
                <Globe className="w-4 h-4" />
              </button>

              {/* Docker */}
              <button
                onClick={() => setSelectedTechKey("docker")}
                className={`pointer-events-auto absolute w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  selectedTechKey === "docker" ? "bg-sky-600 text-white scale-110 shadow-[0_0_15px_#0284c7]" : "bg-[#030614]/85 text-sky-400 hover:text-white border border-sky-500/30"
                }`}
                style={{ bottom: "8px", left: "94px" }}
              >
                <Layers className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Stack Details display */}
        <div className="lg:col-span-6 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTechKey}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 bg-[#030614] border border-[#0C2D70]/20 rounded-xl space-y-4 shadow-inner"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-brand-orange uppercase tracking-widest block">
                    {currentTech.category} MODULE
                  </span>
                  <h4 className="text-2xl font-bold text-white tracking-tight font-display">
                    {currentTech.name}
                  </h4>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-br ${currentTech.color} text-white shadow-md`}>
                  {React.createElement(currentTech.icon, { className: "w-5 h-5" })}
                </div>
              </div>

              <p className="text-sm font-medium text-gray-300 italic font-mono leading-relaxed">
                "{currentTech.tagline}"
              </p>

              <div className="h-px bg-white/5" />

              <div className="space-y-2">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">
                  SYSTEM LEVEL EXPLANATION
                </span>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  {currentTech.usage}
                </p>
              </div>

              {/* Proven metrics badge */}
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg flex justify-between items-center text-xs font-mono">
                <span className="text-gray-500">PROVEN SCALE METRIC</span>
                <span className="text-emerald-400 font-bold">{currentTech.metric}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Prompt guide */}
          <p className="text-[10px] font-mono text-gray-500 text-center uppercase tracking-wider">
            ✦ Click any orb in the orbital grid on the left to inspect architectural details ✦
          </p>
        </div>

      </div>
    </div>
  );
}
