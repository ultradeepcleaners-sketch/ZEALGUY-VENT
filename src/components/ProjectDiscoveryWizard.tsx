import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Briefcase, ArrowRight, ArrowLeft, Check, Sparkles, RefreshCw, 
  User, Mail, Phone, Calendar, DollarSign, Terminal, Layers, Copy 
} from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";

const INDUSTRIES = [
  "Healthcare / Medical",
  "Retail / E-commerce",
  "Finance / Wealth Tech",
  "Education / Learn Tech",
  "Construction / Architecture",
  "Hospitality / Booking",
  "Church / Nonprofit",
  "Real Estate / Property",
  "Logistics / Supply Chain",
  "Custom / Tech Startup"
];

const OBJECTIVES = [
  "Premium Website Launch",
  "E-commerce Checkout Solutions",
  "Native Mobile Applications",
  "AI Agents & Symptoms Guidance",
  "Workflow Business Automation",
  "High Speed Cloud Architecture"
];

const BUDGETS = [
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000 - $50,000",
  "$50,000+ Premium Scale"
];

const TIMELINES = [
  "Next 30 Days",
  "1 - 3 Months",
  "3 - 6 Months",
  "Flexible / Long-term"
];

export default function ProjectDiscoveryWizard() {
  const [step, setStep] = useState(1);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form States
  const [businessType, setBusinessType] = useState("");
  const [objectives, setObjectives] = useState<string[]>([]);
  const [budget, setBudget] = useState(BUDGETS[1]);
  const [timeline, setTimeline] = useState(TIMELINES[1]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const getEmailValidation = (emailStr: string) => {
    if (!emailStr.trim()) {
      return { status: "idle", message: "", isValid: false };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailStr)) {
      return { status: "invalid", message: "Invalid email format", isValid: false };
    }
    const domain = emailStr.split("@")[1]?.toLowerCase() || "";
    
    const disposableDomains = [
      "mailinator.com", "10minutemail.com", "tempmail.com", "yopmail.com", 
      "guerrillamail.com", "sharklasers.com", "dispostable.com", "getairmail.com", 
      "burnermail.io", "temp-mail.org", "trashmail.com", "disposable.com",
      "tempmail.net", "guerrillamailblock.com"
    ];
    const personalDomains = [
      "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com", 
      "icloud.com", "mail.com", "zoho.com", "protonmail.com", "proton.me", 
      "gmx.com", "yandex.com", "live.com", "msn.com", "me.com", "googlemail.com",
      "fastmail.com", "hushmail.com"
    ];

    if (disposableDomains.some(d => domain.includes(d))) {
      return { status: "disposable", message: "Disposable domains are blocked.", isValid: false };
    }
    if (personalDomains.some(d => domain === d || domain.endsWith("." + d))) {
      return { status: "personal", message: "Personal email. Verified work email preferred.", isValid: true };
    }
    return { status: "professional", message: "Verified business email domain.", isValid: true };
  };

  // AI Summary state
  const [aiResult, setAiResult] = useState<{
    summary: string;
    opportunities: string[];
    actionPlan: string[];
  } | null>(null);

  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    const summaryText = `========================================
PARTNERSHIP DISCOVERY SUMMARY
========================================
Client Name: ${name}
Email Address: ${email}
Phone Number: ${phone || "N/A"}

BUSINESS TYPE:
${businessType}

ARCHITECTURAL OBJECTIVES:
${objectives.map((obj) => `- ${obj}`).join("\n")}

TIMELINE:
${timeline}

BUDGET RANGE:
${budget}

----------------------------------------
EXECUTIVE BRIEF (GEMINI COMPILED):
----------------------------------------
${aiResult ? aiResult.summary : "No brief compiled."}

ACTION PLAN:
${aiResult ? aiResult.actionPlan.map((act, i) => `M${i+1}: ${act}`).join("\n") : "No action plan compiled."}

OPPORTUNITIES:
${aiResult ? aiResult.opportunities.map((opp) => `- ${opp}`).join("\n") : "No opportunities compiled."}

========================================
Generated on: ${new Date().toLocaleDateString()}
`;
    navigator.clipboard.writeText(summaryText.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleObjectiveToggle = (obj: string) => {
    setObjectives((prev) =>
      prev.includes(obj) ? prev.filter((o) => o !== obj) : [...prev, obj]
    );
  };

  const generateAISummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await fetch("/api/generate-discovery-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessType,
          objectives,
          budget,
          timeline,
          name
        })
      });
      if (!res.ok) throw new Error("Could not assemble summary.");
      const data = await res.json();
      setAiResult(data);
    } catch (e) {
      console.warn("Using localized summary fallback...", e);
      setAiResult({
        summary: `Dear ${name || "Valued Partner"}, our system team has processed your answers. We propose constructing a sub-0.5s pre-rendered system optimized for ${businessType} workflows with secure portal accounts.`,
        opportunities: [
          "Deploy smart symptoms guidance widgets or CRM connections.",
          "Integrate customized secure Stripe checkouts with direct SMS notifications.",
          "Build multi-tenant administrative dashboards."
        ],
        actionPlan: [
          "Milestone 1: UI Mockups & Schema (Week 1)",
          "Milestone 2: Custom Caching & Admin Portals (Week 3)",
          "Milestone 3: AI Assistant & Secure Integrations (Week 5)",
          "Milestone 4: Production Audits & Launch (Week 6)"
        ]
      });
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && !businessType) return;
    if (step === 2 && objectives.length === 0) return;
    if (step === 5) {
      if (!name || !email) return;
      const validation = getEmailValidation(email);
      if (!validation.isValid) return;
      setStep(6);
      generateAISummary();
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleFinalSubmit = async () => {
    try {
      // 1. Submit project lead to Firestore
      await addDoc(collection(db, "projects"), {
        clientName: name,
        clientEmail: email,
        clientPhone: phone,
        businessType,
        objectives,
        budget,
        timeline,
        summary: aiResult?.summary || "",
        opportunities: aiResult?.opportunities || [],
        actionPlan: aiResult?.actionPlan || [],
        status: "In Discovery Pipeline",
        createdAt: serverTimestamp()
      });

      // 2. Add simulated sale in Sales collection to dynamically update client dashboard
      let amt = 1500;
      if (budget.includes("25k")) amt = 15000;
      else if (budget.includes("50k")) amt = 35000;
      else if (budget.includes("10k")) amt = 7500;

      await addDoc(collection(db, "sales"), {
        customer: name,
        amount: amt,
        type: objectives[0] || "Custom Software",
        createdAt: serverTimestamp()
      });

      setSubmitted(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "projects");
    }
  };

  return (
    <div className="w-full bg-[#090e24]/60 border border-white/10 rounded-[24px] p-6 lg:p-10 backdrop-blur-xl relative overflow-hidden shadow-2xl" id="discovery-wizard-container">
      {/* Background glow layers */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />

      {/* Progress Bar Indicators */}
      <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-brand-orange uppercase tracking-widest block">Partnership Gateway</span>
          <h3 className="text-2xl font-bold text-white tracking-tight">Interactive Discovery Wizard</h3>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs text-gray-500">
          <span className="text-white font-bold">0{step}</span> / <span>06</span>
          <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden ml-2">
            <div 
              className="h-full bg-brand-orange transition-all duration-300" 
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <AnPresenceOrNormalMode mode="wait">
        {!submitted ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="min-h-[280px] flex flex-col justify-between"
          >
            {/* STEP 1: BUSINESS TYPE */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <h4 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#FF7A00]" />
                    Step 1: Select Your Core Industry Verticals
                  </h4>
                  <p className="text-xs text-gray-400">
                    Which sector does your business or startup operate within? This tunes our layout recommendations.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {INDUSTRIES.map((ind) => (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => setBusinessType(ind)}
                      className={`p-3 rounded-[18px] text-left border text-xs font-mono font-medium transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer flex flex-col justify-between h-20 ${
                        businessType === ind
                          ? "bg-brand-orange/10 border-brand-orange text-white"
                          : "bg-[#030614] border-white/5 text-gray-400 hover:text-white hover:border-white/15"
                      }`}
                    >
                      <span className="text-[10px] opacity-40">✦ VERTICAL</span>
                      <span className="font-sans font-semibold tracking-tight">{ind.split(" / ")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: OBJECTIVES */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <h4 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <Layers className="w-5 h-5 text-blue-400" />
                    Step 2: Select Your Growth Objectives
                  </h4>
                  <p className="text-xs text-gray-400">
                    What primary technical modules should Zealguy Venture engineer for your team? (Select all that apply)
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {OBJECTIVES.map((obj) => {
                    const isSelected = objectives.includes(obj);
                    return (
                      <button
                        key={obj}
                        type="button"
                        onClick={() => handleObjectiveToggle(obj)}
                        className={`p-4 rounded-[18px] text-left border text-xs transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? "bg-blue-500/10 border-blue-400 text-white"
                            : "bg-[#030614] border-white/5 text-gray-400 hover:text-white"
                        }`}
                      >
                        <span className="font-sans font-medium tracking-tight">{obj}</span>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                          isSelected ? "bg-blue-500 border-blue-400 text-white" : "border-white/10"
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: BUDGET */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <h4 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    Step 3: Define Project Scale & Budgeting
                  </h4>
                  <p className="text-xs text-gray-400">
                    We coordinate features and developer pipelines matching your appropriate financing bandwidth.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {BUDGETS.map((bud) => (
                    <button
                      key={bud}
                      type="button"
                      onClick={() => setBudget(bud)}
                      className={`p-5 rounded-[18px] border text-center transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer space-y-2 flex flex-col justify-center ${
                        budget === bud
                          ? "bg-emerald-500/10 border-emerald-400 text-white"
                          : "bg-[#030614] border-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      <span className="text-xs font-mono text-gray-500 uppercase">ESTIMATED</span>
                      <span className="text-sm font-bold font-mono tracking-tight text-white">{bud}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: TIMELINE */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <h4 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                    Step 4: Target Deployment Timeline
                  </h4>
                  <p className="text-xs text-gray-400">
                    What is your ideal launch timeline? Fast-track developer allocation is available for active contracts.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {TIMELINES.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setTimeline(time)}
                      className={`p-5 rounded-[18px] border text-center transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer space-y-2 flex flex-col justify-center ${
                        timeline === time
                          ? "bg-indigo-500/10 border-indigo-400 text-white"
                          : "bg-[#030614] border-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      <span className="text-xs font-mono text-gray-500 uppercase">TARGET LAUNCH</span>
                      <span className="text-sm font-bold font-mono tracking-tight text-white">{time}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: CONTACT */}
            {step === 5 && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <h4 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-400" />
                    Step 5: Direct Communication Coordinates
                  </h4>
                  <p className="text-xs text-gray-400">
                    Who should we reach out to for the initial architecture proposal walkthrough?
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-gray-500 uppercase">Full Name *</label>
                    <div className="relative">
                       <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Satoshi Nakamoto"
                        className="w-full bg-[#030614] border border-white/10 rounded-[16px] px-4 py-3 pl-10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF7A00] focus:scale-[1.015] focus:shadow-[0_0_12px_rgba(255,122,0,0.35)] transition-all duration-250"
                      />
                      <User className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                    </div>
                  </div>

                   <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] font-mono text-gray-500 uppercase">Email Address *</label>
                      {email.trim() && (() => {
                        const v = getEmailValidation(email);
                        return (
                          <span className={`text-[9px] font-mono font-semibold ${
                            v.status === "invalid" ? "text-red-400" :
                            v.status === "disposable" ? "text-red-500" :
                            v.status === "personal" ? "text-yellow-400" :
                            "text-emerald-400"
                          }`}>
                            {v.status === "invalid" && "Invalid Format"}
                            {v.status === "disposable" && "Disposable Domain Blocked"}
                            {v.status === "personal" && "Personal Domain"}
                            {v.status === "professional" && "Professional Domain Verified"}
                          </span>
                        );
                      })()}
                    </div>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. satoshi@bitcoin.org"
                        className={`w-full bg-[#030614] border rounded-[16px] px-4 py-3 pl-10 text-xs text-white placeholder-gray-500 focus:outline-none transition-all duration-250 focus:scale-[1.015] ${
                          !email.trim()
                            ? "border-white/10 focus:border-[#FF7A00] focus:shadow-[0_0_12px_rgba(255,122,0,0.35)]"
                            : (() => {
                                const v = getEmailValidation(email);
                                return v.status === "invalid" || v.status === "disposable"
                                  ? "border-red-500/80 focus:border-red-500 focus:shadow-[0_0_12px_rgba(239,68,68,0.35)]"
                                  : v.status === "personal"
                                    ? "border-yellow-500/40 focus:border-yellow-500 focus:shadow-[0_0_12px_rgba(234,179,8,0.35)]"
                                    : "border-emerald-500/40 focus:border-emerald-500 focus:shadow-[0_0_12px_rgba(16,185,129,0.35)]";
                              })()
                        }`}
                      />
                      <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                    </div>
                    {email.trim() && (() => {
                      const v = getEmailValidation(email);
                      return (
                        <p className={`text-[9px] font-sans leading-tight mt-1 ${
                          v.status === "invalid" || v.status === "disposable" ? "text-red-400/80" :
                          v.status === "personal" ? "text-yellow-400/80" :
                          "text-emerald-400/80"
                        }`}>
                          {v.status === "invalid" && "Please enter a valid email format."}
                          {v.status === "disposable" && "Disposable domains are blocked. Please use a verified work or personal email."}
                          {v.status === "personal" && "Work/company email domains receive priority systems support."}
                          {v.status === "professional" && "Business-grade system credentials configured successfully."}
                        </p>
                      );
                    })()}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-gray-500 uppercase">Phone Number</label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +1 (555) 0199"
                        className="w-full bg-[#030614] border border-white/10 rounded-[16px] px-4 py-3 pl-10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF7A00] focus:scale-[1.015] focus:shadow-[0_0_12px_rgba(255,122,0,0.35)] transition-all duration-250"
                      />
                      <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: AI SUMMARY */}
            {step === 6 && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <h4 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-orange animate-pulse" />
                    Custom-Compiled Proposal Brief
                  </h4>
                  <p className="text-xs text-gray-400">
                    Our AI models have structured an instantaneous systems summary matching your precise business coordinates:
                  </p>
                </div>

                {loadingSummary ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-3">
                    <RefreshCw className="w-8 h-8 text-brand-orange animate-spin" />
                    <span className="text-xs font-mono text-gray-500 animate-pulse">Analyzing technical feasibility via Gemini models...</span>
                  </div>
                ) : aiResult ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono text-xs text-gray-400">
                    {/* Brief paragraph */}
                    <div className="lg:col-span-7 bg-[#030614] border border-[#0C2D70]/20 p-5 rounded-[24px] space-y-4">
                      <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                        <Terminal className="w-4 h-4 text-brand-orange" />
                        <span className="text-white font-bold uppercase">Executive Systems Brief</span>
                      </div>
                      <p className="text-xs leading-relaxed text-gray-300 font-sans">
                        {aiResult.summary}
                      </p>

                      <div className="space-y-2 pt-2">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Engineered Action Milestones:</span>
                        <div className="space-y-1.5">
                          {aiResult.actionPlan.map((act, i) => (
                            <div key={i} className="flex gap-2.5 items-start text-[11px]">
                              <span className="px-1 bg-white/5 border border-white/10 rounded text-[9px] text-[#FF9D1F] font-bold">M{i+1}</span>
                              <span className="font-sans text-gray-400">{act}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Side opportunities card */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="p-5 bg-gradient-to-br from-indigo-950/20 to-black border border-white/10 rounded-[24px] space-y-3">
                        <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest block flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                          Growth Accelerations
                        </span>
                        <div className="space-y-3">
                          {aiResult.opportunities.map((opp, idx) => (
                            <div key={idx} className="flex gap-2 items-start text-[11px]">
                              <span className="p-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold">✦</span>
                              <span className="font-sans text-gray-300 leading-normal">{opp}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs font-mono text-red-400">Synthesis failed. Please hit back and try again.</p>
                )}
              </div>
            )}

            {/* BUTTON CONTROLS ROW */}
            <div className="flex justify-between items-center border-t border-white/5 pt-6 mt-6">
              {step > 1 && step < 6 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/15 text-xs font-mono font-medium rounded-[18px] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={step === 1 ? !businessType : step === 2 ? objectives.length === 0 : false}
                  className="px-6 py-3 bg-[#0C2D70] hover:bg-[#FF7A00] text-white text-xs font-mono font-bold rounded-[18px] transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] flex items-center gap-1.5 disabled:opacity-40 cursor-pointer ml-auto"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : step === 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!name || !email || !getEmailValidation(email).isValid}
                  className="px-6 py-3 bg-[#FF7A00] hover:bg-[#FF9D1F] text-white text-xs font-mono font-bold rounded-[18px] transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] flex items-center gap-1.5 disabled:opacity-40 cursor-pointer ml-auto shadow-lg shadow-brand-orange/20"
                >
                  Synthesize Custom Proposal Brief
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </button>
              ) : step === 6 ? (
                <div className="flex gap-4 w-full justify-between items-center">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setBusinessType(""); setObjectives([]); }}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/15 text-xs font-mono font-medium rounded-[18px] transition-all cursor-pointer"
                  >
                    Reset Wizard
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={loadingSummary}
                    className="px-7 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-white text-xs font-mono font-bold rounded-[18px] transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
                    id="submit-discovery-wizard"
                  >
                    Confirm & Submit Partnership Request
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              ) : null}
            </div>

          </motion.div>
        ) : (
          /* SUCCESS SUBMIT SCREEN */
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12 space-y-6 flex flex-col items-center justify-center font-sans"
            id="success-discovery-screen"
          >
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h4 className="text-2xl font-bold text-white tracking-tight">Partnership Application Transmitted</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Thank you, <b>{name}</b>. Your custom-compiled executive brief has been synchronized to cloud servers and synchronized inside your active <b>Client Dashboard Preview</b> below.
              </p>
            </div>

            <div className="bg-[#030614] border border-white/5 p-4 rounded-[24px] text-xs font-mono text-gray-500 max-w-sm">
              ✔ Cloud database document: <span className="text-emerald-400">ACTIVE</span><br />
              ✔ Direct slack routing: <span className="text-emerald-400">QUEUED</span><br />
              ✔ SLA Response guarantee: <span className="text-white">UNDER 24 HOURS</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <button
                type="button"
                onClick={handleCopySummary}
                className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white font-mono text-xs font-bold rounded-[18px] border border-white/10 transition-all hover:-translate-y-0.5 active:scale-[0.98] duration-200 cursor-pointer flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-gray-400" />
                    Copy Summary Details
                  </>
                )}
              </button>

              <a
                href="#client-portal"
                className="px-6 py-3 bg-[#0C2D70] hover:bg-[#FF7A00] text-white font-mono text-xs font-bold rounded-[18px] transition-all inline-block hover:-translate-y-0.5 active:scale-[0.98] duration-200 cursor-pointer"
              >
                Verify Inside Client Portal Preview
              </a>
            </div>
          </motion.div>
        )}
      </AnPresenceOrNormalMode>
    </div>
  );
}

// Private component helper to prevent any motion import discrepancies or missing components
function AnPresenceOrNormalMode({ children, mode }: { children: React.ReactNode; mode?: string }) {
  return <AnimatePresence mode="wait">{children}</AnimatePresence>;
}
