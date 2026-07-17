import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Image as ImageIcon, Send, RefreshCw, Cpu, Code, DollarSign, Calendar, Sliders, Check, Download } from "lucide-react";
import { BusinessDemoResult } from "../types";

export default function AIDemonstrator() {
  const [activeTab, setActiveTab] = useState<"strategist" | "images">("strategist");
  
  // Strategist state
  const [businessIdea, setBusinessIdea] = useState("");
  const [monthlyRevenue, setMonthlyRevenue] = useState("");
  const [goal, setGoal] = useState("");
  const [loadingStrategy, setLoadingStrategy] = useState(false);
  const [strategyResult, setStrategyResult] = useState<BusinessDemoResult | null>(null);
  const [errorStrategy, setErrorStrategy] = useState<string | null>(null);

  // Image generator state
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [loadingImage, setLoadingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [errorImage, setErrorImage] = useState<string | null>(null);

  const handleGenerateStrategy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessIdea.trim()) return;

    setLoadingStrategy(true);
    setErrorStrategy(null);
    setStrategyResult(null);

    try {
      const response = await fetch("/api/generate-business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessIdea,
          monthlyRevenue,
          goal
        })
      });

      if (!response.ok) {
        throw new Error("Failed to compile AI insights. Try again soon.");
      }

      const data = await response.json();
      setStrategyResult(data);
    } catch (err: any) {
      setErrorStrategy(err.message || "An unexpected error occurred during model analysis.");
    } finally {
      setLoadingStrategy(false);
    }
  };

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePrompt.trim()) return;

    setLoadingImage(true);
    setErrorImage(null);
    setGeneratedImage(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: imagePrompt,
          size: imageSize,
          aspectRatio
        })
      });

      if (!response.ok) {
        throw new Error("Unable to synthesize image asset.");
      }

      const data = await response.json();
      if (data.success && data.image) {
        setGeneratedImage(data.image);
      } else {
        throw new Error(data.error || "Synthesis failed without returning pixel data.");
      }
    } catch (err: any) {
      setErrorImage(err.message || "An unexpected error occurred during image generation.");
    } finally {
      setLoadingImage(false);
    }
  };

  const loadPreset = (idea: string, rev: string, target: string) => {
    setBusinessIdea(idea);
    setMonthlyRevenue(rev);
    setGoal(target);
  };

  return (
    <div className="w-full bg-[#090e24]/60 border border-white/10 rounded-2xl p-6 lg:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl" id="ai-demonstrator-container">
      {/* Absolute top glowing background anchor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Tabs Switcher */}
      <div className="flex justify-center mb-8 border-b border-white/5 pb-6">
        <div className="bg-[#030614] p-1 rounded-xl border border-white/5 flex gap-2">
          <button
            onClick={() => setActiveTab("strategist")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === "strategist"
                ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-purple-500/30 text-white"
                : "text-gray-400 hover:text-white border border-transparent"
            }`}
            id="tab-strategist"
          >
            <Sparkles className="w-4.5 h-4.5 text-purple-400" />
            AI Strategy Blueprint
          </button>
          <button
            onClick={() => setActiveTab("images")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === "images"
                ? "bg-gradient-to-r from-purple-500/20 to-emerald-500/20 border border-emerald-500/30 text-white"
                : "text-gray-400 hover:text-white border border-transparent"
            }`}
            id="tab-images"
          >
            <ImageIcon className="w-4.5 h-4.5 text-emerald-400" />
            High-Quality Asset Lab
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "strategist" ? (
          <motion.div
            key="strategist"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Input Form Column */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                  Live Startup & Strategy Engine
                </h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Enter details to trigger a full scale, server-proxied layout generation and business impact forecast powered by <b>gemini-3.1-pro-preview</b>.
                </p>
              </div>

              {/* Quick Preset Ideas */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Example Industries:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => loadPreset("Premium Boutique Pharmacy", "$25k/mo", "Direct subscription deliveries & AI symptoms guidance")}
                    className="text-[11px] font-mono bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5 hover:border-white/10 px-2.5 py-1 rounded-md transition-colors"
                  >
                    ✦ Pharmacy
                  </button>
                  <button
                    onClick={() => loadPreset("Decentralized Carbon Credit Market", "$12k/mo", "Onboard 50 enterprise clean-energy suppliers")}
                    className="text-[11px] font-mono bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5 hover:border-white/10 px-2.5 py-1 rounded-md transition-colors"
                  >
                    ✦ CleanTech
                  </button>
                  <button
                    onClick={() => loadPreset("Smart Wearable Health Coaching", "$45k/mo", "Increase customer lifetime value (LTV) by 35%")}
                    className="text-[11px] font-mono bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5 hover:border-white/10 px-2.5 py-1 rounded-md transition-colors"
                  >
                    ✦ Health IoT
                  </button>
                </div>
              </div>

              <form onSubmit={handleGenerateStrategy} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Describe your business idea *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A boutique luxury watch rental club or high-tech dental practice"
                    value={businessIdea}
                    onChange={(e) => setBusinessIdea(e.target.value)}
                    className="w-full bg-[#030614] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Est. Monthly Revenue</label>
                    <input
                      type="text"
                      placeholder="e.g. $10,000"
                      value={monthlyRevenue}
                      onChange={(e) => setMonthlyRevenue(e.target.value)}
                      className="w-full bg-[#030614] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Primary Target / Goal</label>
                    <input
                      type="text"
                      placeholder="e.g. Expand to 5 cities"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-full bg-[#030614] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loadingStrategy}
                  className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:opacity-90 text-white font-mono text-xs font-semibold py-3.5 px-4 rounded-xl shadow-lg transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  id="submit-ai-strategist"
                >
                  {loadingStrategy ? (
                    <>
                      <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                      Assembling Digital DNA...
                    </>
                  ) : (
                    <>
                      <Send className="w-4.5 h-4.5" />
                      Generate Custom Strategy Blueprint
                    </>
                  )}
                </button>
              </form>

              {errorStrategy && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 font-mono">
                  {errorStrategy}
                </div>
              )}
            </div>

            {/* Results Output Column */}
            <div className="lg:col-span-7">
              <div className="w-full min-h-[420px] bg-[#030614] border border-white/5 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between">
                {/* Simulated Glass/Scanlines over render view */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[size:100%_4px,6px_100%] pointer-events-none opacity-40" />

                {loadingStrategy ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 border-4 border-purple-500/10 rounded-full" />
                      <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      <Cpu className="w-6 h-6 text-purple-400 absolute inset-0 m-auto animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white tracking-wide">Compiling Mathematical Strategy</h4>
                      <p className="text-[11px] text-gray-500 font-mono mt-1 animate-pulse">Routing reasoning tokens via gemini-3.1-pro-preview (HIGH Thinking)...</p>
                    </div>
                  </div>
                ) : strategyResult ? (
                  <div className="space-y-6 z-10">
                    {/* Header */}
                    <div className="border-b border-white/5 pb-4">
                      <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">Blueprint Generated</span>
                      <h4 className="text-xl font-bold text-white tracking-tight mt-0.5">{strategyResult.landingPage.title}</h4>
                      <p className="text-xs text-gray-400 italic mt-1 font-sans">"{strategyResult.slogan}"</p>
                    </div>

                    {/* Web Preview Box */}
                    <div className="bg-[#050816] rounded-lg border border-white/10 overflow-hidden shadow-inner">
                      {/* Browser header */}
                      <div className="bg-white/5 px-3 py-1.5 flex items-center justify-between text-[10px] text-gray-500 border-b border-white/5 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-500/50" />
                          <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
                          <span className="w-2 h-2 rounded-full bg-green-500/50" />
                        </div>
                        <span>preview.zealguy.studio</span>
                        <span className="opacity-0">mock</span>
                      </div>
                      
                      {/* Inner mockup representation */}
                      <div className="p-4 space-y-3">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-white tracking-tight" style={{ color: strategyResult.landingPage.primaryColor }}>{strategyResult.landingPage.title}</span>
                          <div className="flex gap-2 text-gray-400">
                            <span>Services</span>
                            <span>About</span>
                            <span className="px-1.5 py-0.5 bg-white/5 rounded" style={{ color: strategyResult.landingPage.secondaryColor }}>Connect</span>
                          </div>
                        </div>

                        <div className="text-center py-6 space-y-2">
                          <h5 className="text-sm font-extrabold text-white leading-snug">{strategyResult.landingPage.subtitle}</h5>
                          <p className="text-[10px] text-gray-400 max-w-xs mx-auto leading-relaxed">{strategyResult.landingPage.heroText}</p>
                        </div>

                        {/* Interactive columns inside mockup */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          {strategyResult.landingPage.sections.slice(0, 2).map((sec, idx) => (
                            <div key={idx} className="bg-white/[0.02] border border-white/5 p-2.5 rounded-lg">
                              <h6 className="text-[10px] font-bold text-white" style={{ color: strategyResult.landingPage.primaryColor }}>{sec.title}</h6>
                              <p className="text-[9px] text-gray-400 leading-relaxed mt-1">{sec.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Strategy list */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Code className="w-3.5 h-3.5 text-indigo-400" />
                        Expansion Strategy Matrix:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {strategyResult.businessStrategy.map((item, idx) => (
                          <div key={idx} className="p-3 bg-white/[0.01] border border-white/5 rounded-lg flex gap-2.5 items-start">
                            <span className="p-1 rounded bg-indigo-500/10 text-indigo-400 text-xs font-mono font-bold">{idx + 1}</span>
                            <div>
                              <h6 className="text-xs font-semibold text-white tracking-tight">{item.title}</h6>
                              <p className="text-[10px] text-gray-400 mt-1 leading-normal">{item.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timeline and Metrics */}
                    <div className="bg-gradient-to-r from-blue-950/20 to-purple-950/20 border border-white/5 p-4 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs text-gray-400">
                      <div>
                        <span className="block text-[10px] text-gray-500 mb-1 flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                          ESTIMATED BUDGET
                        </span>
                        <span className="text-white font-bold">{strategyResult.timelineAndCost.costEstimate}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-500 mb-1 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-400" />
                          LAUNCH TIMELINE
                        </span>
                        <span className="text-white font-bold">{strategyResult.timelineAndCost.duration}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-500 mb-1 flex items-center gap-1">
                          <Sliders className="w-3.5 h-3.5 text-purple-400" />
                          MILESTONES
                        </span>
                        <span className="text-white font-bold">{strategyResult.timelineAndCost.milestones.length} Key Steps</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-12 text-center text-gray-500 font-mono space-y-3">
                    <Sparkles className="w-8 h-8 text-white/10 animate-pulse" />
                    <div>
                      <p className="text-xs text-gray-400">Awaiting your parameters on the left pane.</p>
                      <p className="text-[10px] text-gray-600 mt-1">Submit description to build strategy instantaneously.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="images"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Input Form Column */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-emerald-400" />
                  Premium Graphic Asset Synthesizer
                </h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Synthesize premium layouts, landing page hero illustrations, and sleek UI background assets at high-resolution using the state-of-the-art <b>gemini-3-pro-image-preview</b> model.
                </p>
              </div>

              {/* Quick Prompt Templates */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Asset Presets:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setImagePrompt("Sleek luxury cyber glassmorphic credit card hovering over metallic purple grid, premium visual UI branding")}
                    className="text-[11px] font-mono bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5 hover:border-white/10 px-2.5 py-1 rounded-md transition-colors"
                  >
                    ✦ Glass Credit Card
                  </button>
                  <button
                    onClick={() => setImagePrompt("Minimalist line art of floating smartphone mockup inside isometric holographic ring, electric blue details")}
                    className="text-[11px] font-mono bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5 hover:border-white/10 px-2.5 py-1 rounded-md transition-colors"
                  >
                    ✦ Phone Mockup
                  </button>
                  <button
                    onClick={() => setImagePrompt("Abstract architectural mesh of neon glowing filaments connecting, luxury brand background wallpaper, 8k")}
                    className="text-[11px] font-mono bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5 hover:border-white/10 px-2.5 py-1 rounded-md transition-colors"
                  >
                    ✦ Mesh Grid
                  </button>
                </div>
              </div>

              <form onSubmit={handleGenerateImage} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Image Prompt *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe the aesthetic asset details in full depth..."
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    className="w-full bg-[#030614] border border-white/10 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Resolution Size</label>
                    <div className="flex bg-[#030614] rounded-lg border border-white/10 p-1">
                      {(["1K", "2K", "4K"] as const).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setImageSize(sz)}
                          className={`flex-1 text-center font-mono text-xs py-1.5 rounded transition-all ${
                            imageSize === sz
                              ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Aspect Ratio</label>
                    <select
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value)}
                      className="w-full bg-[#030614] border border-white/10 focus:border-emerald-500 rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono"
                    >
                      <option value="16:9">16:9 Landscape</option>
                      <option value="1:1">1:1 Square</option>
                      <option value="3:4">3:4 Portrait</option>
                      <option value="4:3">4:3 Wide</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loadingImage}
                  className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 hover:opacity-90 text-white font-mono text-xs font-semibold py-3.5 px-4 rounded-xl shadow-lg transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  id="submit-ai-images"
                >
                  {loadingImage ? (
                    <>
                      <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                      Synthesizing Pixels...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4.5 h-4.5" />
                      Synthesize Ultra-HQ Asset
                    </>
                  )}
                </button>
              </form>

              {errorImage && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 font-mono">
                  {errorImage}
                </div>
              )}
            </div>

            {/* Results Image Output Column */}
            <div className="lg:col-span-7">
              <div className="w-full min-h-[420px] bg-[#030614] border border-white/5 rounded-xl p-4 relative overflow-hidden flex flex-col justify-between">
                
                {loadingImage ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 border-4 border-emerald-500/10 rounded-full" />
                      <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <ImageIcon className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white tracking-wide">Synthesizing {imageSize} Canvas</h4>
                      <p className="text-[11px] text-gray-500 font-mono mt-1 animate-pulse">Running neural generator model (gemini-3-pro-image-preview)...</p>
                    </div>
                  </div>
                ) : generatedImage ? (
                  <div className="flex-1 flex flex-col justify-between space-y-4 z-10">
                    <div className="relative rounded-lg border border-white/10 overflow-hidden shadow-2xl bg-black flex-1 flex items-center justify-center group">
                      <img
                        src={generatedImage}
                        alt="AI Synthesized Asset"
                        className="max-h-[340px] w-auto object-contain transition-transform duration-500 group-hover:scale-102"
                      />
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded text-[10px] font-mono text-emerald-400">
                        {imageSize} RESOLUTION
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-lg font-mono text-[11px]">
                      <span className="text-gray-400">Prompt matches criteria. Optimized file structure ready.</span>
                      <a
                        href={generatedImage}
                        download="zealguy-synthesized-asset.png"
                        className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-md transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-12 text-center text-gray-500 font-mono space-y-3">
                    <ImageIcon className="w-8 h-8 text-white/10 animate-pulse" />
                    <div>
                      <p className="text-xs text-gray-400">Awaiting prompt parameters on the left pane.</p>
                      <p className="text-[10px] text-gray-600 mt-1">Render high-quality vector assets for immediate download.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
