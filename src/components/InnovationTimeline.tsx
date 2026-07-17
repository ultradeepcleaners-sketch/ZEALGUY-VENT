import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Play, Compass, Palette, Code, CheckCircle, Rocket, TrendingUp, 
  Check, Film, ListTodo, ClipboardCheck 
} from "lucide-react";

interface TimelinePhase {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<any>;
  tasks: { text: string; done: boolean }[];
  deliverables: string[];
  videoTitle: string;
  duration: string;
}

const PHASES: TimelinePhase[] = [
  {
    id: "discovery",
    number: "01",
    title: "Discovery & Blueprinting",
    subtitle: "Strategic Architecture Modeling",
    description: "Extracting business metrics, target goals, and corporate requirements to compile the master specification specification.",
    icon: Compass,
    tasks: [
      { text: "Map database relations & index endpoints", done: true },
      { text: "Verify HIPAA or PCI compliance criteria", done: true },
      { text: "Formulate user story maps and SLA guidelines", done: false }
    ],
    deliverables: ["Product Specification Blueprint", "System Architecture Schema", "Figma Frame Layout Structure"],
    videoTitle: "Intro_Discovery_Briefing.mp4",
    duration: "Week 1"
  },
  {
    id: "design",
    number: "02",
    title: "Luxury Design & Asset Lab",
    subtitle: "Apple & Stripe Level UI Minimalism",
    description: "Designing responsive layouts with custom typography tokens, fluid animations, and custom logo visuals.",
    icon: Palette,
    tasks: [
      { text: "Compile master color tokens and font weights", done: true },
      { text: "Render 3D product floating device mockups", done: true },
      { text: "Establish micro-interaction spring constraints", done: true }
    ],
    deliverables: ["Figma Interactive Prototype", "Tailwind Design Token Map", "Custom Vector Brand Assets"],
    videoTitle: "Visual_Design_Tokens_Walkthrough.mp4",
    duration: "Week 2"
  },
  {
    id: "engineering",
    number: "03",
    title: "Premium Development",
    subtitle: "NextJS 15, TypeScript & Tailwind CSS",
    description: "Compiling modular components, cloud schemas, and proxying API keys securely inside server routes.",
    icon: Code,
    tasks: [
      { text: "Program server-side proxy route logic", done: true },
      { text: "Configure anonymous session listener gates", done: true },
      { text: "Setup responsive layout containers for mobile", done: false }
    ],
    deliverables: ["Compiled Node.js Express Engine", "Client Portal Dashboard Components", "Secure Auth Sockets"],
    videoTitle: "Fullstack_Architecture_Audit.mp4",
    duration: "Weeks 3-4"
  },
  {
    id: "qa",
    number: "04",
    title: "Security & Speed Audits",
    subtitle: "Perfect 100/100 PageSpeed Rating",
    description: "Testing visual layout frames, bot shields, API response latency, and complete browser support.",
    icon: CheckCircle,
    tasks: [
      { text: "Run Lighthouse PageSpeed audit (Target 95+)", done: true },
      { text: "Conduct cross-browser flex layout testing", done: true },
      { text: "Execute automated TLS handshake checks", done: true }
    ],
    deliverables: ["Lighthouse Speed Certification", "W3C Validation Audit", "TLS & Encryption Manifest"],
    videoTitle: "PageSpeed_Optimization_Run.mp4",
    duration: "Week 5"
  },
  {
    id: "launch",
    number: "05",
    title: "Orchestrated Launch",
    subtitle: "Zero-Downtime Deployment Setup",
    description: "Deploying secure, load-balanced containers globally to support high traffic density on Day 1.",
    icon: Rocket,
    tasks: [
      { text: "Configure Cloudflare CDN edge caching rules", done: true },
      { text: "Connect Google Analytics telemetry tags", done: true },
      { text: "Conduct production sanity checks", done: false }
    ],
    deliverables: ["Production Ingress Gateway Live", "Zero-downtime Rollback Config", "Administrator Control Access"],
    videoTitle: "Cloud_Deployment_Handover.mp4",
    duration: "Week 6"
  },
  {
    id: "compounding",
    number: "06",
    title: "Compounding Growth",
    subtitle: "A/B Testing & AI Advisory Loop",
    description: "Deploying automated analytics loops and support message triggers to scale conversion rates.",
    icon: TrendingUp,
    tasks: [
      { text: "Deploy automated support email hooks", done: true },
      { text: "Configure active customer funnel logs", done: true },
      { text: "Calibrate AI chatbot response matrices", done: true }
    ],
    deliverables: ["Monthly Conversion Funnel Report", "A/B Layout Testing Dashboard", "24/7 Priority Support SLA"],
    videoTitle: "Post_Launch_Growth_Advisors.mp4",
    duration: "Continuous"
  }
];

export default function InnovationTimeline() {
  const [selectedPhase, setSelectedPhase] = useState<TimelinePhase>(PHASES[0]);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  return (
    <div className="w-full bg-[#090e24]/60 border border-white/10 rounded-2xl p-6 lg:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl" id="sideways-roadmap-container">
      {/* Background radial soft light */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF7A00]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#0C2D70]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Sideways scrolling roadmap rail */}
      <div className="space-y-3 mb-6">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">
          ✦ Sideways Scrollable Roadmap (Sidestep Drag to Navigate) ✦
        </span>
        <div className="overflow-x-auto pb-4 pt-2 scrollbar-thin scrollbar-thumb-[#0C2D70] scrollbar-track-transparent">
          <div className="flex gap-4 min-w-[1024px] px-2">
            {PHASES.map((phase) => {
              const PhaseIcon = phase.icon;
              const isSelected = selectedPhase.id === phase.id;

              return (
                <button
                  key={phase.id}
                  onClick={() => {
                    setSelectedPhase(phase);
                    setIsPlayingVideo(false);
                  }}
                  className={`flex-1 text-left p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between h-40 cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-br from-[#071E4A] to-[#030817] border-brand-orange text-white shadow-lg shadow-brand-orange/5"
                      : "bg-[#030614] border-white/5 text-gray-400 hover:text-white hover:border-white/10"
                  }`}
                  style={{ minWidth: "160px" }}
                >
                  <div className="flex justify-between items-start w-full">
                    <span className="text-xs font-mono font-bold text-gray-500">{phase.number}</span>
                    <PhaseIcon className={`w-5 h-5 ${isSelected ? "text-brand-orange" : "text-gray-500"}`} />
                  </div>

                  <div>
                    <span className="text-[9px] font-mono block text-gray-500 uppercase mb-1">{phase.duration}</span>
                    <h5 className="text-xs font-bold tracking-tight leading-snug text-white font-sans">
                      {phase.title}
                    </h5>
                    <p className="text-[10px] text-gray-400 truncate w-full mt-0.5">{phase.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Phase detail expansion container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-t border-white/5 pt-8 mt-6">
        
        {/* Left column: Video preview / Overview */}
        <div className="lg:col-span-5 space-y-5">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-brand-orange uppercase tracking-widest block">Active Phase Details</span>
            <h4 className="text-2xl font-bold text-white tracking-tight font-display">{selectedPhase.title}</h4>
            <p className="text-xs text-[#FF9D1F] font-semibold font-mono">{selectedPhase.subtitle}</p>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed font-sans">
            {selectedPhase.description}
          </p>

          {/* Simulated Video briefing */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block flex items-center gap-1">
              <Film className="w-3.5 h-3.5 text-brand-orange" />
              Developer Walkthrough Video:
            </span>
            <div className="bg-[#030614] rounded-xl border border-white/10 overflow-hidden relative aspect-video flex items-center justify-center">
              {isPlayingVideo ? (
                <div className="absolute inset-0 bg-black flex flex-col items-center justify-center space-y-2 p-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-brand-orange animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    STREAMING: {selectedPhase.videoTitle}
                  </div>
                  <p className="text-center text-[10px] text-gray-400 leading-normal font-sans">
                    [Simulation Walkthrough: Senior Systems Architect detailing the {selectedPhase.title.toLowerCase()} milestones, technical parameters, and deliverable handoffs.]
                  </p>
                  <button
                    onClick={() => setIsPlayingVideo(false)}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-[9px] font-mono rounded"
                  >
                    Pause Stream
                  </button>
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 bg-cover bg-center opacity-40 filter blur-xs" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=600&auto=format&fit=crop')` }} />
                  <div className="absolute inset-0 bg-black/60" />
                  <div className="z-10 flex flex-col items-center space-y-2">
                    <button
                      onClick={() => setIsPlayingVideo(true)}
                      className="w-11 h-11 bg-brand-orange text-white rounded-full flex items-center justify-center hover:bg-bright-orange transition-all hover:scale-105 shadow-lg shadow-brand-orange/20 cursor-pointer"
                    >
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </button>
                    <span className="text-[10px] font-mono text-gray-400 tracking-wide">{selectedPhase.videoTitle}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Checklist tasks & deliverables */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Phase Tasks Checklist */}
          <div className="bg-[#030614] border border-white/5 p-5 rounded-xl space-y-4">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block flex items-center gap-1">
              <ListTodo className="w-4 h-4 text-blue-400" />
              Phase Tasks Checklist
            </span>
            <div className="space-y-3">
              {selectedPhase.tasks.map((task, idx) => (
                <div key={idx} className="flex gap-2.5 items-start text-xs font-sans">
                  <div className={`w-4 h-4 rounded flex items-center justify-center border mt-0.5 shrink-0 ${
                    task.done ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400" : "bg-white/5 border-white/10 text-gray-600"
                  }`}>
                    {task.done && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className={task.done ? "text-gray-300 line-through decoration-white/10" : "text-gray-400"}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Core Phase Tangibles Deliverables */}
          <div className="bg-[#030614] border border-white/5 p-5 rounded-xl space-y-4">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block flex items-center gap-1">
              <ClipboardCheck className="w-4 h-4 text-indigo-400" />
              Core Tangible Deliverables
            </span>
            <div className="space-y-3">
              {selectedPhase.deliverables.map((del, idx) => (
                <div key={idx} className="p-3 bg-white/[0.01] border border-white/5 rounded-lg flex items-center gap-2.5 text-xs text-gray-300 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0" />
                  <span>{del}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
