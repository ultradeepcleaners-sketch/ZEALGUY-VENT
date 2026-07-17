import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cpu, Globe, Smartphone, BarChart3, Play, RefreshCw, Layers, CheckCircle, Palette, X } from "lucide-react";
import { ServiceOrb } from "../types";

const SERVICES: ServiceOrb[] = [
  {
    id: "web",
    title: "Website Development",
    description: "Ultra-performance Next.js platforms mimicking Apple & Stripe levels of visual and technical sophistication.",
    icon: "Globe",
    themeColor: "blue",
    interactiveType: "website"
  },
  {
    id: "mobile",
    title: "Mobile App Platforms",
    description: "Bespoke high-performance native iOS & Android applications compiled through lightweight frameworks.",
    icon: "Smartphone",
    themeColor: "emerald",
    interactiveType: "app"
  },
  {
    id: "ai",
    title: "AI & Intelligent Systems",
    description: "Deep thinking LLM reasoning workflows, vector index search setups, and real-time smart agents.",
    icon: "Cpu",
    themeColor: "purple",
    interactiveType: "ai"
  },
  {
    id: "software",
    title: "Custom Software & Portals",
    description: "Tailored administrative hubs, medical chart integrations, and secure business dashboard portals.",
    icon: "Layers",
    themeColor: "blue",
    interactiveType: "software"
  },
  {
    id: "branding",
    title: "Brand Strategy & Luxury Assets",
    description: "High-fidelity vector graphic styling, aesthetic logo layouts, and complete brand design guidelines.",
    icon: "Palette",
    themeColor: "purple",
    interactiveType: "branding"
  },
  {
    id: "growth",
    title: "Growth Engineering & SEO",
    description: "Advanced dashboard analytics, near-perfect PageSpeed tuning, and automated customer CRM funnels.",
    icon: "BarChart3",
    themeColor: "emerald",
    interactiveType: "marketing"
  }
];

export default function ServiceGalaxy() {
  const [selectedService, setSelectedService] = useState<ServiceOrb | null>(null);
  const [buildStep, setBuildStep] = useState<number>(0);
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [themePreset, setThemePreset] = useState<"midnight" | "royal" | "neon">("midnight");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBuilding) {
      interval = setInterval(() => {
        setBuildStep((prev) => {
          if (prev >= 4) {
            setIsBuilding(false);
            return 4;
          }
          return prev + 1;
        });
      }, 900);
    }
    return () => clearInterval(interval);
  }, [isBuilding]);

  const triggerLiveBuild = () => {
    setBuildStep(0);
    setIsBuilding(true);
  };

  const selectAndBuild = (service: ServiceOrb) => {
    setSelectedService(service);
    setBuildStep(0);
    setIsBuilding(true);
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedService) {
        setSelectedService(null);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [selectedService]);

  const handleCardKeyDown = (e: React.KeyboardEvent, index: number, srv: ServiceOrb) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (index + 1) % SERVICES.length;
      const nextCard = document.getElementById(`service-orb-${SERVICES[nextIndex].id}`);
      nextCard?.focus();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (index - 1 + SERVICES.length) % SERVICES.length;
      const prevCard = document.getElementById(`service-orb-${SERVICES[prevIndex].id}`);
      prevCard?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectAndBuild(srv);
    }
  };

  const getIcon = (name: string, color: string) => {
    const props = { className: `w-6 h-6 text-${color}-400` };
    switch (name) {
      case "Globe": return <Globe {...props} />;
      case "Cpu": return <Cpu {...props} />;
      case "Smartphone": return <Smartphone {...props} />;
      case "Layers": return <Layers {...props} />;
      case "Palette": return <Palette {...props} />;
      default: return <BarChart3 {...props} />;
    }
  };

  return (
    <div className="w-full relative" id="service-galaxy-root">
      {/* Galaxy Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {SERVICES.map((srv, index) => {
          const isSelected = selectedService?.id === srv.id;
          const colorClass = 
            srv.themeColor === "blue" ? "shadow-blue-500/10 border-blue-500/30 hover:border-blue-400" :
            srv.themeColor === "purple" ? "shadow-purple-500/10 border-purple-500/30 hover:border-purple-400" :
            "shadow-emerald-500/10 border-emerald-500/30 hover:border-emerald-400";
            
          const glowColor =
            srv.themeColor === "blue" ? "bg-blue-500/20" :
            srv.themeColor === "purple" ? "bg-purple-500/20" :
            "bg-emerald-500/20";

          return (
            <motion.div
              key={srv.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => selectAndBuild(srv)}
              onKeyDown={(e) => handleCardKeyDown(e, index, srv)}
              tabIndex={0}
              role="button"
              aria-expanded={isSelected}
              className={`p-6 rounded-2xl bg-[#090e24]/70 border backdrop-blur-xl cursor-pointer shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-400 ${colorClass} ${
                isSelected ? "ring-2 ring-indigo-500 border-indigo-400" : ""
              }`}
              id={`service-orb-${srv.id}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${glowColor} border border-white/5`}>
                  {getIcon(srv.icon, srv.themeColor)}
                </div>
                {/* Simulated spinning galaxy energy point */}
                <div className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    srv.themeColor === "blue" ? "bg-blue-400" : srv.themeColor === "purple" ? "bg-purple-400" : "bg-emerald-400"
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${
                    srv.themeColor === "blue" ? "bg-blue-500" : srv.themeColor === "purple" ? "bg-purple-500" : "bg-emerald-500"
                  }`}></span>
                </div>
              </div>
              <h3 className="text-lg font-medium text-white mb-2 font-sans tracking-tight">{srv.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{srv.description}</p>
              
              <div className="mt-4 flex items-center text-xs font-mono text-indigo-400 gap-1 opacity-0 hover:opacity-100 transition-opacity">
                <span>Deploy Engine</span>
                <span>→</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Live Builder Interactive Showcase Area */}
      <AnimatePresence mode="wait">
        {selectedService ? (
          <motion.div
            key={selectedService.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="w-full bg-[#070b1e] border border-white/10 rounded-2xl p-6 lg:p-8 relative overflow-hidden shadow-2xl"
            id="builder-showcase"
          >
            {/* Background Accent Gradients */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-purple-500/0 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr from-emerald-500/5 to-blue-500/0 rounded-full blur-3xl pointer-events-none" />

            {/* Header / Meta bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-4 mb-6 gap-4">
              <div>
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">Interactive Showcase</span>
                <h4 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
                  {selectedService.title} 
                  <span className="text-xs bg-indigo-500/20 text-indigo-300 font-mono px-2 py-0.5 rounded-full border border-indigo-500/30">Live Simulation</span>
                </h4>
              </div>
              
              <div className="flex flex-wrap gap-2 items-center">
                {/* Theme Selector for the build */}
                <span className="text-xs font-mono text-gray-500 mr-1">Vibe:</span>
                <button 
                  onClick={() => setThemePreset("midnight")} 
                  className={`text-xs font-mono px-2.5 py-1 rounded-md border transition-all focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:outline-none ${
                    themePreset === "midnight" ? "bg-indigo-500/20 border-indigo-500 text-indigo-300" : "bg-transparent border-white/5 text-gray-400 hover:border-white/10"
                  }`}
                >
                  Cosmic Dark
                </button>
                <button 
                  onClick={() => setThemePreset("royal")} 
                  className={`text-xs font-mono px-2.5 py-1 rounded-md border transition-all focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:outline-none ${
                    themePreset === "royal" ? "bg-purple-500/20 border-purple-500 text-purple-300" : "bg-transparent border-white/5 text-gray-400 hover:border-white/10"
                  }`}
                >
                  Luxury Gold
                </button>
                <button 
                  onClick={() => setThemePreset("neon")} 
                  className={`text-xs font-mono px-2.5 py-1 rounded-md border transition-all focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:outline-none ${
                    themePreset === "neon" ? "bg-emerald-500/20 border-emerald-500 text-emerald-300" : "bg-transparent border-white/5 text-gray-400 hover:border-white/10"
                  }`}
                >
                  Stripe Light
                </button>

                <button
                  onClick={triggerLiveBuild}
                  disabled={isBuilding}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-white/90 text-[#050816] font-mono text-xs font-semibold rounded-md shadow-md transition-colors disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isBuilding ? "animate-spin" : ""}`} />
                  Recompile
                </button>

                <button
                  onClick={() => setSelectedService(null)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 text-gray-300 font-mono text-xs font-semibold rounded-md border border-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none cursor-pointer"
                  title="Close Showcase (Esc)"
                  aria-label="Close Showcase"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Dismiss <kbd className="text-[10px] bg-white/10 px-1 rounded">Esc</kbd></span>
                </button>
              </div>
            </div>

            {/* Layout Wrapper: Code panel + Interactive Preview Canvas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Column: Console & Code Compilation */}
              <div className="lg:col-span-5 flex flex-col bg-[#030614] border border-white/5 rounded-xl p-4 font-mono text-xs text-gray-400 min-h-[320px] justify-between relative">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5 text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                      <span className="ml-1">compiler.ts</span>
                    </span>
                    <span className="text-[10px]">ZEALGUY COMPILER V3.0</span>
                  </div>

                  {/* Progressive build logging */}
                  <div className="space-y-2 select-none">
                    <p className="text-gray-500">{"$ zealguy-compiler --init --preset=" + themePreset}</p>
                    <p className="text-indigo-400 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      Initializing target: <span className="text-white font-semibold">[{selectedService.title}]</span>
                    </p>
                    
                    {buildStep >= 1 ? (
                      <p className="text-blue-400 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        Generating token configuration, layout schema parsed.
                      </p>
                    ) : (
                      <p className="text-gray-600 animate-pulse">Parse configuration...</p>
                    )}

                    {buildStep >= 2 ? (
                      <p className="text-purple-400 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        Injecting styling tokens & tailwind rules.
                      </p>
                    ) : buildStep === 1 ? (
                      <p className="text-gray-600 animate-pulse">Compiling style layers...</p>
                    ) : null}

                    {buildStep >= 3 ? (
                      <p className="text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        Assembling JSX trees, importing <span className="text-white">"motion/react"</span> & <span className="text-white">"lucide-react"</span>.
                      </p>
                    ) : buildStep === 2 ? (
                      <p className="text-gray-600 animate-pulse">Mounting responsive sub-layouts...</p>
                    ) : null}

                    {buildStep >= 4 ? (
                      <p className="text-amber-400 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        Build completed successfully in <span className="text-white">1.36s</span>. Rendering DOM!
                      </p>
                    ) : buildStep === 3 ? (
                      <p className="text-gray-600 animate-pulse">Binding state streams & interactions...</p>
                    ) : null}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-6 pt-3 border-t border-white/5">
                  <div className="flex justify-between text-[10px] text-gray-500 mb-1 font-mono">
                    <span>PROGRESS</span>
                    <span>{Math.round((buildStep / 4) * 100)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500" 
                      animate={{ width: `${(buildStep / 4) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Immersive visual canvas building itself live */}
              <div className="lg:col-span-7 flex flex-col bg-[#050816] border border-white/10 rounded-xl overflow-hidden min-h-[380px] shadow-inner relative justify-center">
                {/* Visual grid watermark background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                {/* Live Output Canvas based on themePreset and buildStep */}
                <div className="w-full h-full p-4 flex flex-col justify-between z-10">
                  {/* Top bar of rendering page */}
                  <div className="flex items-center justify-between bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-[10px] text-gray-400 backdrop-blur-sm select-none">
                    <span className="font-semibold text-white tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      ZEALGUY.STDOUT
                    </span>
                    <div className="flex gap-2">
                      <span className="hover:text-white cursor-pointer">Index</span>
                      <span className="hover:text-white cursor-pointer opacity-50">Analytics</span>
                      <span className="hover:text-white cursor-pointer opacity-50">Docs</span>
                    </div>
                  </div>

                  {/* Rendering workspace */}
                  <div className="my-6 flex-1 flex flex-col justify-center items-center">
                    
                    {buildStep === 0 && (
                      <div className="text-center">
                        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto mb-3" />
                        <span className="text-xs text-gray-500 font-mono">awaiting compiler...</span>
                      </div>
                    )}

                    {buildStep >= 1 && (
                      <div className="w-full max-w-md space-y-4 text-center">
                        {/* Hero text loading */}
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-2"
                        >
                          <span className={`text-[10px] font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                            themePreset === "midnight" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                            themePreset === "royal" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                            "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          }`}>
                            {selectedService.interactiveType.toUpperCase()} CONSOLE ACTIVE
                          </span>
                          <h1 className="text-lg font-bold text-white tracking-tight leading-snug">
                            {selectedService.interactiveType === "website" ? "Extraordinary Multi-Tier Web Architecture" :
                             selectedService.interactiveType === "ai" ? "Reasoning Agents & Deep Model Grounding" :
                             selectedService.interactiveType === "app" ? "Synchronized Lightweight Application Sandbox" :
                             "Interactive Multi-Platform Analytics Engine"}
                          </h1>
                        </motion.div>

                        {/* Middle dynamic interactive block based on current step */}
                        {buildStep >= 2 && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-xl border ${
                              themePreset === "midnight" ? "bg-blue-950/20 border-blue-500/20 text-blue-300" :
                              themePreset === "royal" ? "bg-purple-950/20 border-purple-500/20 text-purple-300" :
                              "bg-emerald-950/20 border-emerald-500/20 text-emerald-300"
                            } text-left text-xs font-mono`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span>ACTIVE_SYSTEM_RESOURCES</span>
                              <span className="text-[10px] opacity-75">ONLINE</span>
                            </div>
                            <p className="text-gray-400 leading-relaxed text-[11px] font-sans">
                              {selectedService.interactiveType === "website" && "Stripe-style fluid CSS layers rendering complex mathematical mesh gradients at 60fps."}
                              {selectedService.interactiveType === "ai" && "Gemini SDK pipeline actively optimizing prompt context, parsing markdown, and feeding vector logs."}
                              {selectedService.interactiveType === "app" && "Fluid touch controllers optimized with zero-lag gestural triggers for ultra-smooth rendering."}
                              {selectedService.interactiveType === "marketing" && "Predictive CRM charts running visual telemetry, maps coordinates, and monthly revenue math."}
                            </p>
                          </motion.div>
                        )}

                        {/* Advanced graphic assets loading on step 3 */}
                        {buildStep >= 3 && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex justify-center gap-3"
                          >
                            {selectedService.interactiveType === "website" && (
                              <div className="flex gap-2 w-full justify-center">
                                <div className="h-10 w-24 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-[10px] text-indigo-400 font-mono">HeaderNav</div>
                                <div className="h-10 w-24 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-[10px] text-indigo-400 font-mono">BentoGrid</div>
                                <div className="h-10 w-24 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-[10px] text-indigo-400 font-mono">SmoothScroller</div>
                              </div>
                            )}
                            {selectedService.interactiveType === "ai" && (
                              <div className="flex gap-2 w-full justify-center items-center">
                                <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-mono">vector_store.db</div>
                                <div className="w-6 h-0.5 bg-purple-500/40" />
                                <div className="p-2 rounded-lg bg-pink-500/20 border border-pink-500/30 text-pink-300 text-[10px] font-mono">agent_decision_tree</div>
                              </div>
                            )}
                            {selectedService.interactiveType === "app" && (
                              <div className="flex gap-2 w-full justify-center">
                                <div className="h-14 w-10 bg-slate-900 border border-white/15 rounded-md p-1 flex flex-col justify-between">
                                  <div className="h-1 w-full bg-white/10 rounded-full" />
                                  <div className="h-4 w-full bg-indigo-500/20 rounded" />
                                  <div className="h-1 w-2/3 bg-white/10 rounded-full" />
                                </div>
                                <div className="h-14 w-10 bg-slate-900 border border-white/15 rounded-md p-1 flex flex-col justify-between">
                                  <div className="h-1 w-full bg-white/10 rounded-full" />
                                  <div className="h-4 w-full bg-purple-500/20 rounded" />
                                  <div className="h-1 w-2/3 bg-white/10 rounded-full" />
                                </div>
                              </div>
                            )}
                            {selectedService.interactiveType === "marketing" && (
                              <div className="w-full flex justify-center items-end gap-1 h-12">
                                <div className="w-4 bg-emerald-500/20 border-t border-emerald-400 h-1/3 rounded-t" />
                                <div className="w-4 bg-emerald-500/20 border-t border-emerald-400 h-2/3 rounded-t animate-pulse" />
                                <div className="w-4 bg-emerald-500/20 border-t border-emerald-400 h-1/2 rounded-t" />
                                <div className="w-4 bg-emerald-500/20 border-t border-emerald-400 h-full rounded-t" />
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer status indicating build completion */}
                  <div className="text-[10px] font-mono text-gray-500 flex justify-between bg-white/[0.02] border-t border-white/5 pt-2 select-none">
                    <span>HOST: localhost:3000</span>
                    <span>
                      {buildStep === 4 ? (
                        <span className="text-emerald-400 font-semibold animate-pulse">● FULLY RENDERING</span>
                      ) : (
                        <span className="text-amber-400 animate-pulse">⚙ BUILDING DOM...</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        ) : (
          <div className="w-full text-center py-12 bg-[#090e24]/30 border border-white/5 rounded-2xl p-6">
            <Layers className="w-12 h-12 text-gray-600 mx-auto mb-3 animate-pulse" />
            <p className="text-sm text-gray-400">Click any interactive service galaxy orb above to explore their immersive live compilation previews.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
