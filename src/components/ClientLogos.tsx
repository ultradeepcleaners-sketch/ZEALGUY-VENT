import React from "react";
import { motion } from "motion/react";
import { Cpu, Globe, Shield, Activity, Zap, Compass } from "lucide-react";

const LOGOS = [
  { name: "Aether FinTech", icon: Globe, color: "text-indigo-400" },
  { name: "Vanguard Cyber", icon: Shield, color: "text-blue-400" },
  { name: "Vertex AI", icon: Cpu, color: "text-purple-400" },
  { name: "Meridian Space", icon: Compass, color: "text-brand-orange" },
  { name: "Apex Energy", icon: Zap, color: "text-yellow-400" },
  { name: "Chronos Health", icon: Activity, color: "text-emerald-400" },
];

export default function ClientLogos() {
  // Duplicate for seamless infinite loop scroll
  const scrollItems = [...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS];

  return (
    <div className="w-full bg-[#030817] py-8 border-y border-[#0C2D70]/20 overflow-hidden relative" id="client-logos-scroller">
      {/* Absolute side fade gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#030817] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#030817] to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-3 text-center">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">
          ✦ ENTERPRISE SYSTEMS DEPLOYED ACROSS GLOBAL NETWORKS ✦
        </span>
      </div>

      {/* Scrolling wrapper */}
      <div className="flex select-none overflow-hidden mt-4">
        <motion.div
          className="flex gap-16 items-center whitespace-nowrap"
          animate={{ x: [0, -1000] }}
          transition={{
            repeat: Infinity,
            duration: 25,
            ease: "linear",
          }}
          style={{ width: "fit-content" }}
          whileHover={{ style: { animationPlayState: "paused" } }} // CSS hint: standard pause on hover
        >
          {scrollItems.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-2.5 px-4 opacity-50 hover:opacity-100 transition-all duration-300 cursor-default group"
              >
                <IconComponent className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform`} />
                <span className="text-sm font-extrabold font-display text-white tracking-wider">
                  {item.name}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
