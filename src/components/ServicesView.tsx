import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Globe, 
  Smartphone, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Layers, 
  ArrowRight, 
  DollarSign, 
  HelpCircle, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  RefreshCw,
  FolderOpen
} from "lucide-react";

interface ServiceDetail {
  id: string;
  icon: React.ReactNode;
  title: string;
  tagline: string;
  overview: string;
  problemsSolved: string[];
  benefits: string[];
  process: string[];
  timeline: string;
  deliverables: string[];
  techStack: string[];
  packagePrice: string;
  packageTitle: string;
  packageScope: string;
  faqs: { q: string; a: string }[];
}

interface ServicesViewProps {
  onTriggerConsultation: () => void;
  onNavigateToPortfolio: () => void;
}

export default function ServicesView({ onTriggerConsultation, onNavigateToPortfolio }: ServicesViewProps) {
  const [activeServiceId, setActiveServiceId] = useState("web-systems");

  const servicesData: ServiceDetail[] = [
    {
      id: "web-systems",
      icon: <Globe className="w-5 h-5 text-[#FF7A00]" />,
      title: "Bespoke Web Systems",
      tagline: "Sub-0.5s static-generated platforms built for massive scale.",
      overview: "Generic WordPress templates leak traffic, load slowly, and weaken trust. We engineer custom web experiences designed in React, Vite, and Next.js that load in milliseconds and actively convert visitors.",
      problemsSolved: [
        "Slow site loads causing visitor bounce rates to skyrocket (over 50% loss)",
        "Static page layouts failing to capture and validate high-quality business leads",
        "Rigid content management systems unable to scale for custom databases",
        "Vulnerability to SQL injections and DDoS attacks from outdated PHP plugins"
      ],
      benefits: [
        "98+ Core Web Vitals performance score natively on PageSpeed Insights",
        "Sub-0.5 second pre-rendering with robust CDN caching edges",
        "Sleek fluid layouts designed natively with Tailwind CSS and responsive flexgrids",
        "Completely secure, headless static build pipelines with zero server maintenance overhead"
      ],
      process: [
        "Phase 1: High-fidelity layout wireframing and UX analysis (Week 1)",
        "Phase 2: Custom component styling, typography pairings, and interaction design (Weeks 2-3)",
        "Phase 3: Front-end development, API proxy integration, and database mapping (Weeks 4-5)",
        "Phase 4: Global edge deployment, SSL provisioning, and lighthouse auditing (Week 6)"
      ],
      timeline: "4 - 6 Weeks Deployment",
      deliverables: [
        "Fully custom responsive website repository in React & Tailwind",
        "Fully synchronized, secure backend API integrations",
        "Pre-integrated local search and meta description schema SEO",
        "Interactive lead capture forms routing directly to cloud databases"
      ],
      techStack: ["React 19", "Vite", "Tailwind CSS", "Motion", "Express Node.js", "Vercel Edge Network"],
      packageTitle: "Elite Studio Scale",
      packagePrice: "$10,000 - $15,000",
      packageScope: "Ideal for growing startups & premium brands looking to establish absolute digital authority.",
      faqs: [
        { q: "Do you use templates?", a: "Never. Every line of markup, style, and component logic is written specifically for your branding guidelines and performance objectives." },
        { q: "Is the hosting complicated?", a: "No. We deploy to highly resilient global CDNs which are fully managed, secure, and require zero technical maintenance from your side." }
      ]
    },
    {
      id: "mobile-apps",
      icon: <Smartphone className="w-5 h-5 text-blue-400" />,
      title: "Custom Mobile Applications",
      tagline: "Sleek iOS and Android binaries designed with native smoothness.",
      overview: "We construct cross-platform mobile apps using React Native and Flutter. We avoid bloated webviews, ensuring fluid finger-tracking animations, biometric authorization, and real-time offline-first database synchronization.",
      problemsSolved: [
        "Fragmented, sluggish cross-platform builds crashing on modern devices",
        "Complex, high-friction user login states and payment checkouts leaking sales",
        "Loss of offline capabilities and database synchronization when connections drop",
        "Difficulty passing app store review pipelines due to non-compliant layouts"
      ],
      benefits: [
        "Single shared codebase with 100% native execution speed and feel",
        "Fully integrated device permissions: camera, microphone, geolocation, push notifications",
        "Local key-value storage for reliable, instant offline-first capability",
        "Seamless deployment support to both Apple App Store and Google Play Store"
      ],
      process: [
        "Phase 1: User story mapping, wireframing, and touch-target design (Weeks 1-2)",
        "Phase 2: Interactive screen transitions, navigation patterns, and mockups (Weeks 3-4)",
        "Phase 3: Component logic programming and offline SQLite/Firestore integrations (Weeks 5-7)",
        "Phase 4: Multi-device testing, beta releases via TestFlight, and App Store submission (Week 8)"
      ],
      timeline: "6 - 8 Weeks Deployment",
      deliverables: [
        "Compiled iOS & Android app binaries (IPA & APK format)",
        "Complete app store assets, screenshots, and regulatory compliance sheets",
        "Administrative client panel database to dispatch global push notifications",
        "Comprehensive user analytics tracking setup for download attribution"
      ],
      techStack: ["React Native", "Expo", "SQLite", "Firebase Auth", "App Store Connect", "Play Console"],
      packageTitle: "Native Core Scale",
      packagePrice: "$20,000 - $35,000",
      packageScope: "Full application engineering with custom backends, analytics dashboards, and compliance checks.",
      faqs: [
        { q: "Can the app sync in real-time with our website database?", a: "Yes. We design unified cloud databases (such as Firestore) that keep both your mobile and web platforms perfectly synchronized." },
        { q: "Do you handle App Store compliance?", a: "Yes, we handle the complete deployment, guideline compliance, and review submission processes for you." }
      ]
    },
    {
      id: "ai-systems",
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      title: "AI & Automation Integrations",
      tagline: "Unleash the full capability of generative AI to scale operations.",
      overview: "We architect custom server-side artificial intelligence routing systems utilizing Google GenAI SDK and Gemini models. Build smart predictive analytics, automated chatbots, and instant layout and text synthesizers.",
      problemsSolved: [
        "High staff costs spent manually summarizing documents or answering repetitive chats",
        "Exposing sensitive corporate API keys or client data directly to the web browser",
        "Unstructured AI outputs resulting in messy database errors and parsing failures",
        "Underutilized data that could be automated to synthesize user blueprints"
      ],
      benefits: [
        "Custom secure server-side API proxy routers keeping keys hidden",
        "Strict structured schema validation (JSON Schema) guaranteeing perfect database entries",
        "Thinking-level configurations using Gemini 3.1 Pro/3.5 Flash for elite reasoning",
        "Automated cron-job triggers to digest data, generate metrics, and email reports"
      ],
      process: [
        "Phase 1: AI feasibility study, system logic mapping, and model selection (Week 1)",
        "Phase 2: Prompt engineering, strict structured schema design, and server-side setup (Weeks 2-3)",
        "Phase 3: Sandbox testing, guardrail configurations, and context loading (Weeks 4-5)",
        "Phase 4: API integration with front-end UI and performance stress-testing (Week 6)"
      ],
      timeline: "4 - 6 Weeks Deployment",
      deliverables: [
        "Custom middleware server configured with secure Google GenAI SDK",
        "Interactive front-end AI console with structured diagnostic summaries",
        "Automated system triggers with reliable fail-safe local fallback routines",
        "Full data safety audit verifying compliance with enterprise privacy standards"
      ],
      techStack: ["Google GenAI", "Gemini 3.5 Flash", "Gemini 3.1 Pro", "Node.js", "Express API Router", "JSON Schema"],
      packageTitle: "Cognitive AI Bundle",
      packagePrice: "$15,000 - $25,000",
      packageScope: "Premium server-side AI integrations, custom prompt templates, system guardrails, and sandboxes.",
      faqs: [
        { q: "Are our company secrets safe with Gemini?", a: "Yes. By using the official Google GenAI SDK via private server routes, your prompt history and internal data are never used to train public models." },
        { q: "What happens if Gemini API limits are hit?", a: "We program multi-tier fallback architectures (e.g. cascading from 3.1 Pro to 3.5 Flash, down to pre-compiled local heuristic responses) so the user experiences zero downtime." }
      ]
    },
    {
      id: "enterprise-cloud",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      title: "Enterprise Cloud Systems",
      tagline: "Secure, real-time database structures built for high traffic.",
      overview: "We establish scalable, robust database solutions utilizing Google Cloud, Firestore, and relational databases. Secure user authentication, granular access controls, and real-time operational dashboard overlays are standard.",
      problemsSolved: [
        "Slow queries and bottlenecked databases stalling during flash traffic spikes",
        "Security leaks exposing user records due to loose Firestore or SQL rules",
        "Friction-filled registration pipelines lacking easy Social/Google OAuth sign-in",
        "Outdated backend engines that are difficult to monitor and maintain"
      ],
      benefits: [
        "Fully managed databases with scale-to-zero configurations for massive cost savings",
        "Enterprise-grade security policies and rules (e.g. Firebase rules or Drizzle schemas)",
        "Real-time event synchronization via WebSockets or collection listeners",
        "Complete user session history dashboards and activity audit logs"
      ],
      process: [
        "Phase 1: Database entity-relation mapping and security analysis (Week 1)",
        "Phase 2: Authentication flow design, OAuth client provisioning, and secure tokens (Week 2)",
        "Phase 3: Server programming, collection rules deployment, and WebSocket pipelines (Weeks 3-4)",
        "Phase 4: Load testing up to 10,000 concurrent writes and speed optimization (Week 5)"
      ],
      timeline: "4 - 5 Weeks Deployment",
      deliverables: [
        "Secure cloud-hosted database (Firestore or Cloud SQL/Postgres)",
        "Configured Firebase Authentication containing secure OAuth logins",
        "Aesthetic interactive administrative dashboard detailing metrics",
        "Full set of deployed security rules, preventing any unauthorized reads/writes"
      ],
      techStack: ["Firebase Auth", "Firestore", "Cloud SQL", "TypeScript", "Drizzle ORM", "OAuth 2.0 Clients"],
      packageTitle: "Enterprise Database Backbone",
      packagePrice: "$12,000 - $18,000",
      packageScope: "Full persistent database integration, admin overlays, visual charts, and complete security validation.",
      faqs: [
        { q: "Is Firebase Firestore or PostgreSQL better for my project?", a: "We analyze your exact requirements: Firestore is outstanding for real-time chat, flexible documents, and fast setups. PostgreSQL is preferred if you need complex relational SQL querying." },
        { q: "How are security breaches prevented?", a: "We write highly robust security rules and write server-side validation checks, meaning even if someone gains your client config, they cannot write malicious data." }
      ]
    }
  ];

  const activeService = servicesData.find(s => s.id === activeServiceId) || servicesData[0];

  return (
    <div className="space-y-16 py-12 text-left">
      {/* Top Section */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-[#FF7A00] uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Service Suite</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Enterprise Services</h1>
        <p className="text-xs text-gray-400 font-sans leading-relaxed">
          Select a specialized branch below to analyze business objectives, deliverables, timelines, and package prices.
        </p>
      </section>

      {/* Interactive Tabs Menu */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {servicesData.map(service => {
          const isActive = service.id === activeServiceId;
          return (
            <button
              key={service.id}
              onClick={() => setActiveServiceId(service.id)}
              className={`p-4 rounded-[20px] border flex flex-col items-center gap-2.5 text-center transition-all cursor-pointer ${
                isActive 
                  ? "bg-[#0c1435] border-[#FF7A00] text-white shadow-[0_0_15px_rgba(255,122,0,0.15)]" 
                  : "bg-[#050816]/60 border-white/5 hover:border-white/15 text-gray-400 hover:text-white"
              }`}
            >
              <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center border transition-colors ${
                isActive ? "bg-white/10 border-[#FF7A00]/40" : "bg-white/5 border-white/10"
              }`}>
                {service.icon}
              </div>
              <span className="text-xs font-bold font-mono">{service.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Service Detailed Layout */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeService.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="bg-[#070c24]/30 border border-white/5 rounded-[32px] p-6 sm:p-10 relative overflow-hidden"
        >
          {/* Subtle Glows */}
          <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] max-w-[400px] bg-gradient-radial from-blue-500/5 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column - Detailed specifications */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-brand-orange uppercase tracking-wider block">Service Overview</span>
                <h2 className="text-2xl font-extrabold text-white font-display tracking-tight">{activeService.title}</h2>
                <p className="text-xs text-[#FF7A00] font-mono font-bold">{activeService.tagline}</p>
                <p className="text-xs text-gray-400 font-sans leading-relaxed pt-2">{activeService.overview}</p>
              </div>

              {/* Problems Solved */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Business Problems We Eliminate</h4>
                <ul className="space-y-2 text-xs text-gray-400 font-sans">
                  {activeService.problemsSolved.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Zap className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Deliverables & Benefits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                <div className="space-y-2">
                  <h5 className="text-[11px] font-bold text-white uppercase font-mono tracking-widest text-blue-400">Core Benefits</h5>
                  <ul className="space-y-1.5 text-[11px] text-gray-400 font-sans">
                    {activeService.benefits.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="text-[11px] font-bold text-white uppercase font-mono tracking-widest text-[#FF7A00]">Core Deliverables</h5>
                  <ul className="space-y-1.5 text-[11px] text-gray-400 font-sans">
                    {activeService.deliverables.map((d, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FF7A00] flex-shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Technologies Used */}
              <div className="space-y-2.5 pt-4">
                <h5 className="text-[11px] font-bold text-white uppercase font-mono tracking-widest">Technologies & SDKs Utilized</h5>
                <div className="flex flex-wrap gap-2">
                  {activeService.techStack.map((tech, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-gray-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Timeline, Pricing and FAQs */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              {/* Packaging Card */}
              <div className="bg-slate-950/60 border border-white/10 rounded-[24px] p-6 text-left space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Pricing Package</span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#FF7A00]/10 border border-[#FF7A00]/30 rounded-full text-[9px] font-mono text-[#FF7A00]">
                    <Clock className="w-3 h-3 animate-spin" />
                    <span>{activeService.timeline}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white font-mono">{activeService.packageTitle}</h4>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-white font-mono">{activeService.packagePrice}</span>
                    <span className="text-[10px] text-gray-500 font-mono">/ setup</span>
                  </div>
                </div>

                <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                  {activeService.packageScope}
                </p>

                <div className="space-y-2 pt-2 border-t border-white/5">
                  <h5 className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">Implementation Pipeline</h5>
                  <ul className="space-y-1 text-[10px] text-gray-400 font-sans">
                    {activeService.process.map((p, idx) => (
                      <li key={idx} className="truncate">{p}</li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={onTriggerConsultation}
                  className="w-full h-12 min-h-[48px] bg-[#FF7A00] hover:bg-orange-500 text-white font-mono text-xs font-bold rounded-[14px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Request Custom Specification
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Mini FAQ Accordion */}
              <div className="bg-[#050816]/40 p-5 rounded-[24px] border border-white/5 space-y-3 text-left">
                <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest block">Service FAQs</span>
                {activeService.faqs.map((faq, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                      <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                      {faq.q}
                    </h5>
                    <p className="text-[11px] text-gray-400 leading-relaxed font-sans pl-5">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Suggested package pricing section & Related Services Link */}
      <section className="bg-slate-950/40 p-6 rounded-[24px] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="space-y-1">
          <p className="text-xs font-bold text-white font-mono flex items-center justify-center sm:justify-start gap-2">
            <FolderOpen className="w-4 h-4 text-brand-orange" /> Want to audit our genuine, live work cases?
          </p>
          <p className="text-[11px] text-gray-400 font-sans max-w-xl">
            Explore our realistic portfolio comprising functional checkout systems, biometric tools, and automated corporate dashboards.
          </p>
        </div>
        <button
          onClick={onNavigateToPortfolio}
          className="px-5 h-12 min-h-[48px] bg-white/5 hover:bg-white/10 text-white font-mono text-xs font-bold rounded-[14px] border border-white/10 transition-colors cursor-pointer flex items-center justify-center gap-2 flex-shrink-0"
        >
          View Case Portfolio
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </button>
      </section>
    </div>
  );
}
