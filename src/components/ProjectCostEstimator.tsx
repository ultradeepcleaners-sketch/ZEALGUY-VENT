import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calculator, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  Plus, 
  Minus, 
  ArrowRight,
  Gauge,
  Check
} from "lucide-react";

interface ProjectCostEstimatorProps {
  onApplyEstimate: (budgetRange: string, details: string) => void;
}

interface ServiceOption {
  id: string;
  name: string;
  description: string;
  basePrice: number;
}

interface ComplexityOption {
  id: string;
  name: string;
  description: string;
  multiplier: number;
}

interface ScaleOption {
  id: string;
  name: string;
  description: string;
  multiplier: number;
}

interface AddonOption {
  id: string;
  name: string;
  description: string;
  price: number;
}

const SERVICES: ServiceOption[] = [
  { id: "web", name: "Bespoke Web Platform", description: "Vite + React single-page systems or server-rendered Express nodes.", basePrice: 8500 },
  { id: "mobile", name: "Custom iOS/Android App", description: "High-performance cross-platform mobile app with deep hardware integrations.", basePrice: 12500 },
  { id: "saas", name: "SaaS / Cloud Dashboard", description: "Complex web system with secure client portals, roles, and databases.", basePrice: 16500 },
  { id: "ai", name: "AI-Powered Ecosystem", description: "Systems with intelligent pipelines, dynamic Gemini API, and ML capabilities.", basePrice: 19500 },
];

const COMPLEXITIES: ComplexityOption[] = [
  { id: "standard", name: "Bespoke Standard", description: "Pristine UI/UX layout, ultra-responsive, standard transitions.", multiplier: 1.0 },
  { id: "premium", name: "Cinematic Premium", description: "Bespoke motion design, interactive charts, customizable theme modules.", multiplier: 1.3 },
  { id: "enterprise", name: "Enterprise Grade", description: "Military-grade data structures, strict WCAG 2.2 AA accessibility, extensive logs.", multiplier: 1.6 },
];

const SCALES: ScaleOption[] = [
  { id: "mvp", name: "Boutique / MVP", description: "Focused core requirements, ideal for rapid product market entry.", multiplier: 1.0 },
  { id: "corporate", name: "Corporate Scale", description: "Architected for high concurrency, integrated CDN edge nodes, deep telemetry.", multiplier: 1.25 },
  { id: "global", name: "Global Enterprise", description: "Multi-regional failovers, active-active servers, custom sub-0.5s pre-render.", multiplier: 1.5 },
];

const ADDONS: AddonOption[] = [
  { id: "oauth", name: "OAuth Secure Connect", description: "Login with Google Workspace, Microsoft Azure, or GitHub.", price: 1500 },
  { id: "gemini", name: "Gemini AI Automation", description: "Server-side smart assistant, dynamic summaries, and image engines.", price: 3500 },
  { id: "payment", name: "Stripe & Digital Wallet", description: "Premium subscription billing with Apple Pay & Google Pay checkouts.", price: 2000 },
  { id: "telemetry", name: "Analytics & Telemetry Dashboard", description: "Real-time user heatmaps, action logs, and performance monitoring.", price: 1800 },
];

export default function ProjectCostEstimator({ onApplyEstimate }: ProjectCostEstimatorProps) {
  const [selectedService, setSelectedService] = useState<string>("web");
  const [selectedComplexity, setSelectedComplexity] = useState<string>("premium");
  const [selectedScale, setSelectedScale] = useState<string>("corporate");
  const [selectedAddons, setSelectedAddons] = useState<string[]>(["oauth", "payment"]);
  const [customPageCount, setCustomPageCount] = useState<number>(5);

  const [prices, setPrices] = useState({ min: 0, max: 0, weeksMin: 0, weeksMax: 0 });

  // Calculate prices dynamically when selections modify
  useEffect(() => {
    const srv = SERVICES.find(s => s.id === selectedService) || SERVICES[0];
    const comp = COMPLEXITIES.find(c => c.id === selectedComplexity) || COMPLEXITIES[0];
    const scale = SCALES.find(s => s.id === selectedScale) || SCALES[0];

    // Page count price calculation
    const pageCost = (customPageCount - 1) * 350;

    // Total Addons calculation
    const addonsPrice = selectedAddons.reduce((sum, addonId) => {
      const addon = ADDONS.find(a => a.id === addonId);
      return sum + (addon ? addon.price : 0);
    }, 0);

    // Compute basic base with multipliers
    const calculatedBase = (srv.basePrice + pageCost) * comp.multiplier * scale.multiplier;
    const finalPriceRaw = calculatedBase + addonsPrice;

    // Add budget range boundaries (±15%)
    const minPrice = Math.round((finalPriceRaw * 0.9) / 100) * 100;
    const maxPrice = Math.round((finalPriceRaw * 1.1) / 100) * 100;

    // Compute estimated duration in weeks
    const baseWeeks = selectedService === "web" ? 4 : selectedService === "mobile" ? 6 : selectedService === "saas" ? 8 : 10;
    const multipliedWeeks = baseWeeks * comp.multiplier * (selectedScale === "global" ? 1.3 : 1.0);
    const minWeeks = Math.max(3, Math.round(multipliedWeeks));
    const maxWeeks = Math.max(minWeeks + 2, Math.round(multipliedWeeks * 1.25));

    setPrices({
      min: minPrice,
      max: maxPrice,
      weeksMin: minWeeks,
      weeksMax: maxWeeks
    });
  }, [selectedService, selectedComplexity, selectedScale, selectedAddons, customPageCount]);

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId]
    );
  };

  const handleApply = () => {
    const srv = SERVICES.find(s => s.id === selectedService)?.name || "";
    const comp = COMPLEXITIES.find(c => c.id === selectedComplexity)?.name || "";
    const scale = SCALES.find(s => s.id === selectedScale)?.name || "";
    const activeAddonNames = selectedAddons.map(id => ADDONS.find(a => a.id === id)?.name).filter(Boolean);

    const budgetString = `$${prices.min.toLocaleString()} - $${prices.max.toLocaleString()}`;
    const detailsMessage = `Cost Estimator Config:
- Project: ${srv} (${customPageCount} Views)
- Standard: ${comp}
- Scale: ${scale}
- Add-ons: ${activeAddonNames.join(", ") || "None"}
- Estimated Lifecycle: ${prices.weeksMin}-${prices.weeksMax} Weeks`;

    onApplyEstimate(budgetString, detailsMessage);
  };

  return (
    <div className="w-full bg-[#090e24]/60 border border-white/10 rounded-2xl p-6 lg:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl" id="project-cost-estimator-container">
      {/* Background neon elements */}
      <div className="absolute top-0 right-1/3 w-80 h-80 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Interactive Configuration (Col-7) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="text-[10px] font-mono text-brand-orange uppercase tracking-widest">Interactive Engineering Sandbox</span>
            <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 mt-1">
              <Calculator className="w-6 h-6 text-brand-orange" />
              Bespoke Project Cost Estimator
            </h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Formulate a precise project profile. Select your platform parameters and toggle custom cloud modules to synthesize a dynamic timeline and budget range.
            </p>
          </div>

          <div className="space-y-5">
            {/* 1. Core Service */}
            <div>
              <span className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-2.5">
                1. Core Platform Architecture
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SERVICES.map((srv) => (
                  <button
                    key={srv.id}
                    onClick={() => setSelectedService(srv.id)}
                    className={`p-3 rounded-xl border text-left transition-all relative cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-orange ${
                      selectedService === srv.id
                        ? "bg-brand-orange/10 border-brand-orange text-white"
                        : "bg-[#030614]/80 border-white/5 text-gray-400 hover:border-white/10 hover:text-gray-300"
                    }`}
                  >
                    {selectedService === srv.id && (
                      <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
                    )}
                    <span className="text-xs font-bold font-mono block mb-0.5 text-white">
                      {srv.name}
                    </span>
                    <span className="text-[10px] font-sans text-gray-400 block leading-normal">
                      {srv.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Page Count Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                  2. Dynamic Interface Scope / Views
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCustomPageCount(prev => Math.max(1, prev - 1))}
                    className="w-6 h-6 bg-white/5 border border-white/10 rounded flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-mono font-bold text-brand-orange bg-brand-orange/10 px-2.5 py-0.5 rounded border border-brand-orange/20">
                    {customPageCount} {customPageCount === 1 ? "View / Page" : "Views / Pages"}
                  </span>
                  <button 
                    onClick={() => setCustomPageCount(prev => Math.min(30, prev + 1))}
                    className="w-6 h-6 bg-white/5 border border-white/10 rounded flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={customPageCount}
                onChange={(e) => setCustomPageCount(Number(e.target.value))}
                className="w-full h-1.5 bg-[#030614] rounded-lg appearance-none cursor-pointer accent-brand-orange border border-white/5"
              />
              <div className="flex justify-between text-[9px] text-gray-500 font-mono mt-1">
                <span>1 View (Single Landing Page)</span>
                <span>15 Views</span>
                <span>30+ Enterprise Pages</span>
              </div>
            </div>

            {/* 3. Complexity & Scale (2 columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Complexity */}
              <div>
                <span className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-2">
                  3. Visual Complexity Standard
                </span>
                <div className="space-y-1.5">
                  {COMPLEXITIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedComplexity(c.id)}
                      className={`w-full p-2.5 rounded-lg border text-left transition-all text-xs font-sans flex items-start gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-orange ${
                        selectedComplexity === c.id
                          ? "bg-white/5 border-brand-orange text-white font-semibold"
                          : "bg-[#030614]/40 border-white/5 text-gray-400 hover:border-white/10 hover:text-gray-300"
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        selectedComplexity === c.id ? "border-brand-orange bg-brand-orange/20" : "border-white/20"
                      }`}>
                        {selectedComplexity === c.id && <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />}
                      </span>
                      <div className="space-y-0.5">
                        <span className="block text-[11px] font-mono text-white leading-none">{c.name}</span>
                        <span className="block text-[9px] text-gray-500 leading-tight">{c.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Scale */}
              <div>
                <span className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-2">
                  4. Traffic & Security Scale
                </span>
                <div className="space-y-1.5">
                  {SCALES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedScale(s.id)}
                      className={`w-full p-2.5 rounded-lg border text-left transition-all text-xs font-sans flex items-start gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-orange ${
                        selectedScale === s.id
                          ? "bg-white/5 border-brand-orange text-white font-semibold"
                          : "bg-[#030614]/40 border-white/5 text-gray-400 hover:border-white/10 hover:text-gray-300"
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        selectedScale === s.id ? "border-brand-orange bg-brand-orange/20" : "border-white/20"
                      }`}>
                        {selectedScale === s.id && <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />}
                      </span>
                      <div className="space-y-0.5">
                        <span className="block text-[11px] font-mono text-white leading-none">{s.name}</span>
                        <span className="block text-[9px] text-gray-500 leading-tight">{s.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Custom Add-ons */}
            <div>
              <span className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-2">
                5. High-Fidelity Add-on Integrations (Select Multiple)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ADDONS.map((addon) => {
                  const isActive = selectedAddons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-2.5 rounded-lg border text-left transition-all flex items-center justify-between gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-orange ${
                        isActive
                          ? "bg-indigo-950/10 border-indigo-500/40 text-white"
                          : "bg-[#030614]/50 border-white/5 text-gray-400 hover:border-white/10 hover:text-gray-300"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="block text-[11px] font-bold font-mono text-white leading-tight">
                          {addon.name}
                        </span>
                        <span className="block text-[9px] text-gray-400 leading-normal">
                          {addon.description}
                        </span>
                      </div>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                        isActive ? "bg-indigo-500/20 border-indigo-400 text-indigo-300" : "border-white/10 text-transparent"
                      }`}>
                        {isActive && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Right Estimation Panel (Col-5) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="w-full bg-[#030614] border border-white/5 rounded-xl p-6 flex flex-col justify-between h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/5 rounded-full blur-xl pointer-events-none" />
            
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-[10px] font-mono text-gray-500">ZEALGUY COMPILER V1.4</span>
                <span className="text-[10px] text-brand-orange font-semibold flex items-center gap-1 font-mono uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 text-brand-orange animate-pulse" />
                  Estimate Compiled
                </span>
              </div>

              {/* Price Range Display */}
              <div className="text-center py-6 bg-white/[0.01] border border-white/5 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-brand-orange/5 to-transparent pointer-events-none" />
                <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase block mb-1">
                  Estimated Project Budget Range
                </span>
                <div className="text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center justify-center gap-1">
                  <span className="text-brand-orange">${prices.min.toLocaleString()}</span>
                  <span className="text-gray-500 text-lg font-mono">to</span>
                  <span className="text-indigo-400">${prices.max.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-emerald-400 font-mono mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  No Hidden Margins • 100% Bespoke Code Rights
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                  <span className="text-[9px] text-gray-500 font-mono block uppercase">Estimated Lifecycle</span>
                  <div className="flex items-center gap-1.5 text-white">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-bold font-mono">{prices.weeksMin} - {prices.weeksMax} Weeks</span>
                  </div>
                </div>
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                  <span className="text-[9px] text-gray-500 font-mono block uppercase">Pre-Render Speed</span>
                  <div className="flex items-center gap-1.5 text-white">
                    <Gauge className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-bold font-mono">&lt; 0.4s response</span>
                  </div>
                </div>
              </div>

              {/* Scope Checklist Summary */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                  Included in this Synthesized Estimate:
                </span>
                <div className="space-y-2 text-[11px] text-gray-300 font-sans">
                  <div className="flex gap-2 items-start">
                    <div className="w-4 h-4 bg-brand-orange/10 rounded flex items-center justify-center text-brand-orange shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Fully bespoke design with no third-party template reuse.</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <div className="w-4 h-4 bg-brand-orange/10 rounded flex items-center justify-center text-brand-orange shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Dynamic production deployment server & optimized Vite bundling.</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <div className="w-4 h-4 bg-brand-orange/10 rounded flex items-center justify-center text-brand-orange shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Technical SEO with micro-data canonical structures & sitemaps.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA action to Apply details directly */}
            <div className="mt-8 pt-4 border-t border-white/5">
              <button
                onClick={handleApply}
                className="w-full py-3 bg-white hover:bg-white/90 text-[#030614] rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-brand-orange/10 hover:shadow-brand-orange/20 hover:-translate-y-0.5"
              >
                Apply Estimate to Blueprint
                <ArrowRight className="w-4 h-4 text-[#030614]" />
              </button>
              <p className="text-[9px] text-gray-500 text-center mt-2 leading-relaxed font-sans">
                Applying will auto-fill your Discovery request budget and open our custom design timeline wizard.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
