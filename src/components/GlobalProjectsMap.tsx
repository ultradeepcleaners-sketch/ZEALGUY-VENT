import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, ShieldCheck, Globe, HelpCircle, ArrowRight } from "lucide-react";

interface HubLocation {
  id: string;
  city: string;
  country: string;
  coordinates: { x: string; y: string }; // CSS positioning offsets
  deployment: string;
  scope: string;
  latency: string;
  uptime: string;
  color: string;
}

const HUBS: HubLocation[] = [
  {
    id: "san_fran",
    city: "San Francisco",
    country: "United States",
    coordinates: { x: "18%", y: "38%" },
    deployment: "Vanguard Asset Portfolio Web",
    scope: "Finance high-frequency charts syncing real-time index records via custom Node.js server proxies.",
    latency: "6ms",
    uptime: "99.999%",
    color: "text-blue-400"
  },
  {
    id: "london",
    city: "London",
    country: "United Kingdom",
    coordinates: { x: "47%", y: "26%" },
    deployment: "Solis Medical Triage CRM",
    scope: "HIPAA-compliant administrative dashboard integrating volunteer triage queues and direct encrypted patient databases.",
    latency: "12ms",
    uptime: "99.99%",
    color: "text-purple-400"
  },
  {
    id: "frankfurt",
    city: "Frankfurt",
    country: "Germany",
    coordinates: { x: "51%", y: "28%" },
    deployment: "Aether Supply Chain Core",
    scope: "Industrial container tracking and fleet schedules automated using headless microservice pipelines.",
    latency: "14ms",
    uptime: "100%",
    color: "text-amber-400"
  },
  {
    id: "tokyo",
    city: "Tokyo",
    country: "Japan",
    coordinates: { x: "82%", y: "36%" },
    deployment: "Velvet Retail Headless Node",
    scope: "Headless direct e-commerce booking platform delivering sub-0.5s pre-rendered pages to mobile shopping apps.",
    latency: "8ms",
    uptime: "99.98%",
    color: "text-emerald-400"
  },
  {
    id: "sydney",
    city: "Sydney",
    country: "Australia",
    coordinates: { x: "88%", y: "76%" },
    deployment: "Apex Energy Telemetry App",
    scope: "Native iOS/Android biometric interfaces visualizing active solar sensor streams globally.",
    latency: "19ms",
    uptime: "99.999%",
    color: "text-sky-400"
  }
];

export default function GlobalProjectsMap() {
  const [selectedHubKey, setSelectedHubKey] = useState<string>("san_fran");
  const activeHub = HUBS.find((h) => h.id === selectedHubKey) || HUBS[0];

  return (
    <div className="w-full bg-[#090e24]/60 border border-white/10 rounded-2xl p-6 lg:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl" id="global-map-showcase">
      {/* Background glowing lights */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#FF7A00]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Dynamic dot-matrix style world map SVG */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative bg-[#030614] rounded-xl border border-white/5 p-4 min-h-[360px] overflow-hidden">
          {/* Custom vector schematic representing stylized global map */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:12px_12px] z-0" />

          {/* Continents outlines (Stylized custom map graphic representation) */}
          <svg className="w-full h-full min-h-[260px] opacity-15 select-none z-10" viewBox="0 0 500 250" preserveAspectRatio="none">
            {/* North America */}
            <path d="M 50 40 L 150 40 L 130 110 L 90 140 Z" fill="currentColor" className="text-gray-400" />
            {/* South America */}
            <path d="M 110 140 L 150 140 L 130 220 L 110 240 Z" fill="currentColor" className="text-gray-400" />
            {/* Eurasia / Europe */}
            <path d="M 180 30 L 400 30 L 380 120 L 220 120 Z" fill="currentColor" className="text-gray-400" />
            {/* Africa */}
            <path d="M 220 120 L 280 120 L 260 210 L 220 170 Z" fill="currentColor" className="text-gray-400" />
            {/* Australia */}
            <path d="M 390 180 L 460 180 L 440 230 L 380 210 Z" fill="currentColor" className="text-gray-400" />
          </svg>

          {/* Map Pins overlay layer */}
          <div className="absolute inset-0 z-20">
            {HUBS.map((hub) => {
              const isSelected = selectedHubKey === hub.id;
              return (
                <button
                  key={hub.id}
                  onClick={() => setSelectedHubKey(hub.id)}
                  className="absolute transition-all cursor-pointer group"
                  style={{ left: hub.coordinates.x, top: hub.coordinates.y }}
                >
                  <div className="relative flex items-center justify-center">
                    {/* Ring ping ripple indicator */}
                    <span className={`absolute inline-flex rounded-full opacity-75 ${
                      isSelected ? "w-8 h-8 bg-brand-orange/30 animate-ping" : "w-6 h-6 bg-blue-500/10 group-hover:animate-ping"
                    }`} />
                    
                    {/* Centered pin icon */}
                    <MapPin className={`w-5 h-5 transition-transform ${
                      isSelected ? "text-brand-orange scale-125" : "text-gray-500 group-hover:text-white"
                    }`} />

                    {/* Pop hover label tooltip */}
                    <span className="absolute bottom-6 bg-slate-950 text-[9px] font-mono border border-white/10 px-1.5 py-0.5 rounded text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30 shadow-md">
                      {hub.city}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom guidelines */}
          <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-[9px] font-mono text-gray-500 z-20">
            <span>MAP SYSTEM V1.0</span>
            <span>✦ CLICK ON TARGET SATELLITE HUBS TO EXPAND ✦</span>
          </div>
        </div>

        {/* Right Side: Active hub metadata details card */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedHubKey}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 bg-[#030614] border border-[#0C2D70]/20 rounded-xl space-y-5 shadow-inner"
            >
              <div className="space-y-1.5 border-b border-white/5 pb-3">
                <span className={`text-[9px] font-mono font-bold uppercase tracking-widest ${activeHub.color}`}>
                  ✦ Deploy Hub: {activeHub.country}
                </span>
                <h4 className="text-2xl font-bold text-white tracking-tight font-display">
                  {activeHub.city} Gateway
                </h4>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">
                  SYSTEM LEVEL DEPLOYMENT:
                </span>
                <p className="text-xs font-bold text-white font-sans">
                  {activeHub.deployment}
                </p>
                <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                  {activeHub.scope}
                </p>
              </div>

              {/* Deployment key parameters panel */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg space-y-0.5 font-mono text-xs">
                  <span className="text-[9px] text-gray-500 uppercase block">CDN GATEWAY LATENCY</span>
                  <span className="text-emerald-400 font-extrabold">{activeHub.latency}</span>
                </div>
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg space-y-0.5 font-mono text-xs">
                  <span className="text-[9px] text-gray-500 uppercase block">SYSTEM HEALTH SLA</span>
                  <span className="text-white font-extrabold">{activeHub.uptime}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <p className="text-[10px] font-mono text-gray-500 text-center uppercase tracking-wider">
            ✦ Worldwide network operations monitored live via cloud endpoints ✦
          </p>
        </div>

      </div>
    </div>
  );
}
