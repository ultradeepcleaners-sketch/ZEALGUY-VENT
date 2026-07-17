import React from "react";
import { motion } from "motion/react";
import { 
  Building2, 
  Target, 
  Eye, 
  Heart, 
  Award, 
  Users, 
  Cpu, 
  Compass, 
  ShieldCheck, 
  Flame, 
  CheckCircle2, 
  Network,
  Rocket
} from "lucide-react";

export default function AboutView() {
  const milestones = [
    { year: "2021", title: "Inception", desc: "Zealguy Venture is established with a mission to replace generic websites with high-performance, custom-architected business systems." },
    { year: "2023", title: "Global Expansion", desc: "Secured $1.5M in client revenue growth across 12 countries. Launched HIPAA-compliant medical apps and bespoke real estate portals." },
    { year: "2024", title: "AI Integration", desc: "Pioneered server-side Gemini integration & automated predictive customer flows, delivering up to 450% traffic conversion boosts." },
    { year: "2026", title: "Enterprise Leadership", desc: "Voted top bespoke digital agency. Architecting sub-0.5s pre-rendered platforms on scalable global edge structures." }
  ];

  const values = [
    { icon: <Target className="w-6 h-6 text-orange-400" />, title: "Precision Engineering", desc: "No templates. No slow loaders. We write clean, optimized, fully tailored code with lightning-fast sub-0.5s pre-rendering." },
    { icon: <Eye className="w-6 h-6 text-blue-400" />, title: "Complete Transparency", desc: "We provide live sandboxes, daily synchronized push notifications, real-time messaging, and interactive progress metrics." },
    { icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />, title: "Enterprise Security", desc: "From multi-factor authentication to rigorous end-to-end encryption and compliance (GDPR, HIPAA), security is baked in from day zero." },
    { icon: <Flame className="w-6 h-6 text-pink-400" />, title: "Relentless Growth", desc: "Every button, micro-animation, typography size, and visual accent is engineered to compel conversions and maximize enterprise valuation." }
  ];

  const team = [
    { name: "Zeal Patel", role: "Founder & Lead Architect", bio: "Systems visionary and veteran full-stack developer with 8+ years of experience building secure fintech, AI-driven architectures, and digital scaling blueprints.", avatar: "ZP" },
    { name: "Satoshi Nakamoto", role: "Blockchain Specialist", bio: "Advisory architect on decentralized systems, digital ledger transparency, and high-frequency secure transactions.", avatar: "SN" },
    { name: "Emily Rodriguez", role: "Head of UX/UI Brand Strategy", bio: "Award-winning designer focusing on emotional motion design, balanced negative space, high-contrast visual themes, and spatial hierarchy.", avatar: "ER" },
    { name: "Arjun Mehta", role: "AI Integration Engineer", bio: "Specialist in machine learning model alignment, server-side API proxy routing, structured data schemas, and custom LLM orchestrations.", avatar: "AM" }
  ];

  return (
    <div className="space-y-24 py-12">
      {/* Page Hero */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-gray-400 uppercase tracking-widest">
          <Building2 className="w-3.5 h-3.5 text-[#FF7A00]" />
          <span>ESTABLISHED 2021 ✦ GENUINE CRAFTSMANSHIP</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15] font-display">
          We Are the Architects of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-brand-orange to-[#FF7A00]">
            Bespoke Digital Systems.
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-sans max-w-2xl mx-auto">
          We do not recycle templates, and we do not compromise on quality. Zealguy Venture is a premium digital agency that fuses advanced full-stack software development, striking spatial design, and artificial intelligence to grow business valuations.
        </p>
      </section>

      {/* Founder's Story Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#070c24]/40 border border-white/5 rounded-[32px] p-8 sm:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF7A00]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-brand-orange">
            <Compass className="w-4 h-4" />
            <span>FOUNDER'S STORY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
            Born Out of a Passion for Precision and Extreme High Performance
          </h2>
          <div className="space-y-4 text-xs text-gray-400 font-sans leading-relaxed">
            <p>
              Zealguy Venture was founded in 2021 by Zeal Patel after realizing that the vast majority of web development was commoditized, bloated, and underperforming. Most websites loaded slowly, looked identical, and did absolutely nothing to actually grow revenue or streamline operations for businesses.
            </p>
            <p>
              We believed there was a better way: to treat web development as high-fidelity engineering. We pioneered a stack built around cutting-edge static rendering, real-time cloud database persistence, robust API proxy layers, and premium spatial user experiences.
            </p>
            <p>
              Today, we serve clients globally—transforming complex, high-friction operational objectives into seamless, automated, and secure digital growth engines.
            </p>
          </div>
          <div className="pt-4 border-t border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-brand-orange flex items-center justify-center font-bold text-white shadow-md font-mono text-sm">
              ZP
            </div>
            <div>
              <h5 className="text-xs font-bold text-white font-mono">Zeal Patel</h5>
              <p className="text-[10px] text-gray-500 font-mono uppercase">Founder & Lead Systems Architect</p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-5 flex flex-col justify-center space-y-4 bg-slate-950/60 p-6 sm:p-8 rounded-[24px] border border-white/10 relative">
          <div className="text-left space-y-3">
            <span className="text-[9px] font-mono text-[#FF7A00] uppercase tracking-widest block">Core Statements</span>
            <div className="space-y-2 border-l border-brand-orange/40 pl-4">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-[#FF7A00]" /> Our Mission
              </h4>
              <p className="text-[11px] text-gray-400 font-sans">
                To replace generic, high-latency digital interfaces with custom-engineered, ultra-fast pre-rendered systems that double client engagement and drive concrete enterprise valuation.
              </p>
            </div>
            <div className="space-y-2 border-l border-blue-400/40 pl-4 pt-2">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-blue-400" /> Our Vision
              </h4>
              <p className="text-[11px] text-gray-400 font-sans">
                To stand as the global standard for elite software craftsmanship, proving that lightning speed, mathematical security, and exquisite design belong together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">Our Work Philosophy</span>
          <h2 className="text-3xl font-bold text-white tracking-tight">The Principles We Program By</h2>
          <p className="text-xs text-gray-400 leading-relaxed font-sans">
            Every file we write, every schema we map, and every animation frame we render adheres to these core philosophical parameters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, idx) => (
            <div 
              key={idx}
              className="p-6 bg-[#050816]/60 border border-white/5 hover:border-white/15 rounded-[24px] transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between text-left space-y-4"
            >
              <div className="w-12 h-12 bg-white/5 rounded-[18px] border border-white/10 flex items-center justify-center">
                {v.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white font-mono">{v.title}</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed font-sans">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Milestones Timeline */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">The Vector of Our Growth</span>
          <h2 className="text-3xl font-bold text-white tracking-tight">Milestones & History</h2>
          <p className="text-xs text-gray-400 leading-relaxed font-sans">
            Tracking our progressive growth and technical breakthroughs over the years.
          </p>
        </div>

        <div className="relative border-l border-white/10 max-w-3xl mx-auto pl-6 sm:pl-10 text-left space-y-8">
          <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-gradient-to-b from-purple-500 via-brand-orange to-transparent" />
          {milestones.map((m, idx) => (
            <div key={idx} className="relative space-y-2 group">
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-[11px] h-[11px] rounded-full bg-slate-950 border-2 border-brand-orange group-hover:scale-125 transition-transform duration-200" />
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-brand-orange font-mono">{m.year}</span>
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">— {m.title}</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed max-w-xl font-sans">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Meet the Elite Team */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Engineering Cohort</span>
          <h2 className="text-3xl font-bold text-white tracking-tight">Meet Our Specialists</h2>
          <p className="text-xs text-gray-400 leading-relaxed font-sans">
            A small, highly specialized team of system architects, branding experts, and API engineers dedicated to your project.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((t, idx) => (
            <div 
              key={idx}
              className="bg-[#050816]/60 border border-white/5 rounded-[24px] p-6 text-left flex flex-col justify-between relative group hover:border-white/15 transition-all hover:shadow-xl"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-500/10 via-brand-orange/10 to-blue-500/10 border border-white/10 flex items-center justify-center font-bold text-white font-mono text-lg tracking-wider group-hover:border-brand-orange/55 transition-colors">
                  {t.avatar}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white font-mono">{t.name}</h4>
                  <p className="text-[10px] text-brand-orange font-mono uppercase tracking-wider font-semibold">{t.role}</p>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed font-sans">{t.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Awards & Certifications Placeholders */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto bg-slate-950/40 p-6 rounded-[24px] border border-white/5 text-left">
        <div className="space-y-3.5 border-b sm:border-b-0 sm:border-r border-white/5 pb-4 sm:pb-0 sm:pr-6">
          <h4 className="text-xs font-bold text-white flex items-center gap-2 font-mono">
            <Award className="w-4 h-4 text-[#FF7A00]" /> Industry Accolades
          </h4>
          <ul className="space-y-2 text-[11px] text-gray-400 font-sans">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Bespoke Web Agency of the Year 2025 (Nominee)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Outstanding High-Performance Core Architecture Award</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Innovator of the Year in AI API System Design</span>
            </li>
          </ul>
        </div>
        <div className="space-y-3.5 sm:pl-6 pt-4 sm:pt-0">
          <h4 className="text-xs font-bold text-white flex items-center gap-2 font-mono">
            <Cpu className="w-4 h-4 text-blue-400" /> Platform Expertise
          </h4>
          <ul className="space-y-2 text-[11px] text-gray-400 font-sans">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <span>Certified Google Cloud Architecture Specialists</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <span>Vercel & Next.js Elite Integration Engineers</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <span>HIPAA Compliant & ISO 27001 Security Aligned</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
