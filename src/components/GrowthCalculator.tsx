import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, DollarSign, TrendingUp, HelpCircle, ArrowRight, CheckCircle2 } from "lucide-react";

export default function GrowthCalculator() {
  const [industry, setIndustry] = useState("ecommerce");
  const [revenue, setRevenue] = useState(15000);
  const [goal, setGoal] = useState("double"); // double, triple, automate

  // Premium Business calculations based on inputs
  const multiplier = industry === "ecommerce" ? 2.4 : industry === "saas" ? 3.1 : industry === "healthcare" ? 1.8 : 2.1;
  const growthRate = goal === "double" ? 2.0 : goal === "triple" ? 3.0 : 1.5;
  
  const estimatedImpactY1 = Math.round(revenue * multiplier * 12 * 0.45);
  const estimatedImpactY3 = Math.round(revenue * multiplier * growthRate * 12 * 0.85);

  const keyImprovements = 
    industry === "ecommerce" ? [
      "Dynamic Apple-level checkout pipeline reducing abandonment by 40%",
      "Algorithmic dynamic upselling powered by localized user cookies",
      "PWA framework yielding 0.4s content load speeds on mobile networks"
    ] : industry === "saas" ? [
      "Stripe-style interactive pricing toggle modules driving high-tier onboarding",
      "Auto-generated business telemetry maps tracking dynamic user churn",
      "Seamless self-serve client portals with invoice integration"
    ] : industry === "healthcare" ? [
      "HIPAA-compliant instant appointment flow with calendar sync",
      "Automated symptoms checker filtering diagnostic triage",
      "High-security medical records storage and client vault"
    ] : [
      "Bespoke high-contrast display showcasing your agency's creative portfolio",
      "Dynamic interactive service galaxy simulating production builds live",
      "Embedded AI consult assistant responding immediately 24/7"
    ];

  return (
    <div className="w-full bg-[#090e24]/60 border border-white/10 rounded-2xl p-6 lg:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl" id="growth-calculator-container">
      {/* Background radial soft light */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Interactive Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">Growth Engine</span>
            <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 mt-1">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
              Business Growth Calculator
            </h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Estimate the potential direct and compounding business value of transitioning to a custom luxury platform engineered by Zealguy Venture.
            </p>
          </div>

          <div className="space-y-4">
            {/* Industry Selector */}
            <div>
              <label className="block text-[11px] font-mono text-gray-400 mb-2 uppercase tracking-wider">Your Core Industry</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "ecommerce", label: "E-Commerce" },
                  { id: "saas", label: "SaaS / Tech" },
                  { id: "healthcare", label: "Healthcare" },
                  { id: "agency", label: "Agency / Other" }
                ].map((ind) => (
                  <button
                    key={ind.id}
                    onClick={() => setIndustry(ind.id)}
                    className={`px-3 py-2.5 rounded-lg border text-xs font-mono transition-all text-left ${
                      industry === ind.id
                        ? "bg-indigo-500/10 border-indigo-500 text-white font-bold"
                        : "bg-[#030614] border-white/5 text-gray-400 hover:border-white/10 hover:text-white"
                    }`}
                  >
                    ✦ {ind.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Monthly Revenue Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider">Current Monthly Revenue</label>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  ${revenue.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="250000"
                step="5000"
                value={revenue}
                onChange={(e) => setRevenue(Number(e.target.value))}
                className="w-full h-1.5 bg-[#030614] rounded-lg appearance-none cursor-pointer accent-indigo-500 border border-white/5"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
                <span>$5K</span>
                <span>$120K</span>
                <span>$250K+</span>
              </div>
            </div>

            {/* Growth Goal */}
            <div>
              <label className="block text-[11px] font-mono text-gray-400 mb-2 uppercase tracking-wider">Primary Strategic Goal</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "double", label: "Double Conversions" },
                  { id: "triple", label: "3X Lead Gen" },
                  { id: "automate", label: "Automate Ops" }
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={`px-2.5 py-2 rounded-lg border text-[10px] font-mono transition-all ${
                      goal === g.id
                        ? "bg-emerald-500/10 border-emerald-500 text-white font-bold"
                        : "bg-[#030614] border-white/5 text-gray-400 hover:border-white/10 hover:text-white"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Compounding Projections */}
        <div className="lg:col-span-7">
          <div className="w-full bg-[#030614] border border-white/5 rounded-xl p-6 flex flex-col justify-between min-h-[380px]">
            <div>
              <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                <span className="text-[10px] font-mono text-gray-500">ZEALGUY IMPACT ALGORITHM V1.1</span>
                <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  compounding_analysis
                </span>
              </div>

              {/* Projections breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl">
                  <span className="block text-[10px] text-gray-500 font-mono">ESTIMATED COMPREHENSIVE GROWTH (YEAR 1)</span>
                  <span className="text-2xl font-extrabold text-white tracking-tight block mt-1">+${estimatedImpactY1.toLocaleString()}</span>
                  <span className="text-[10px] text-emerald-400 font-mono mt-1 block">✦ Compounded via speed optimization</span>
                </div>
                <div className="p-4 bg-gradient-to-r from-emerald-950/20 to-blue-950/20 border border-emerald-500/20 rounded-xl">
                  <span className="block text-[10px] text-emerald-300 font-mono">ESTIMATED DIRECT IMPACT (YEAR 3)</span>
                  <span className="text-2xl font-extrabold text-emerald-400 tracking-tight block mt-1">+${estimatedImpactY3.toLocaleString()}</span>
                  <span className="text-[10px] text-emerald-300 font-mono mt-1 block">✦ compounding growth curve</span>
                </div>
              </div>

              {/* Dynamic Key Improvements */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Engineered Platform Improvements:</span>
                <div className="space-y-2">
                  {keyImprovements.map((imp, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start text-xs text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{imp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulated mini visual bar charts */}
            <div className="mt-6 pt-4 border-t border-white/5 space-y-2">
              <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
                <span>PROJECTED PLATFORM REVENUE COMPOSITION</span>
                <span>PROGRESSIVE Compounding</span>
              </div>
              <div className="space-y-1.5 font-mono text-[10px]">
                {/* Year 1 */}
                <div className="flex items-center gap-3">
                  <span className="w-12 text-gray-400">YEAR 1</span>
                  <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-indigo-500/50" 
                      initial={{ width: 0 }}
                      animate={{ width: "45%" }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <span className="text-indigo-300 w-12 text-right">+45%</span>
                </div>
                {/* Year 2 */}
                <div className="flex items-center gap-3">
                  <span className="w-12 text-gray-400">YEAR 2</span>
                  <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-purple-500/60" 
                      initial={{ width: 0 }}
                      animate={{ width: "70%" }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                    />
                  </div>
                  <span className="text-purple-300 w-12 text-right">+70%</span>
                </div>
                {/* Year 3 */}
                <div className="flex items-center gap-3">
                  <span className="w-12 text-gray-400">YEAR 3</span>
                  <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-emerald-500/80" 
                      initial={{ width: 0 }}
                      animate={{ width: "95%" }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>
                  <span className="text-emerald-300 w-12 text-right">+135%</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
