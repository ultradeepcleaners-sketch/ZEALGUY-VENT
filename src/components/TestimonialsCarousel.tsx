import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, ChevronLeft, ChevronRight, Quote, ShieldCheck, TrendingUp } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  metrics: string;
  metricLabel: string;
  rating: number;
  avatar: string;
  tags: string[];
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Alistair Sterling",
    role: "Managing Partner",
    company: "Apex Sovereign Capital",
    quote: "Zealguy Venture does not build conventional websites—they engineer absolute digital monopolies. The level of aesthetic discipline, fluid motion, and Apple-level precision has completely elevated our firm's digital presence. Our client inquiry value grew by 340% within weeks of deployment.",
    metrics: "+340%",
    metricLabel: "Lead Quality Increase",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    tags: ["Systems Architecture", "High-Net-Worth Portal"]
  },
  {
    id: "2",
    name: "Dr. Evelyn Zhao",
    role: "Chief Product Officer",
    company: "NeuraFlow Diagnostics",
    quote: "We required a secure, HIPAA-compliant patient diagnostics portal with real-time biometric rendering. Most studios shied away from the technical complexity. Zealguy Venture executed it flawlessly. The integrated cloud database, custom webGL layouts, and 99 PageSpeed performance are a masterpiece.",
    metrics: "99/100",
    metricLabel: "Performance Rating",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    tags: ["Biometric WebGL", "HIPAA Compliant Security"]
  },
  {
    id: "3",
    name: "Marcus Vance",
    role: "Founder & CEO",
    company: "Valuation Matrix Corp",
    quote: "Other agencies sell raw hours; Zealguy Venture sells compounding valuations. The integrated interactive financial estimators and streamlined client portals automated 90% of our manual sales pipeline. They are our unfair competitive advantage.",
    metrics: "90%",
    metricLabel: "Onboarding Automated",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    tags: ["Sales Pipeline Automation", "Interactive Estimators"]
  },
  {
    id: "4",
    name: "Seraphina Vance",
    role: "VP of Digital Strategy",
    company: "Synapse Logistics",
    quote: "The visual weight, typography, and negative spacing in their designs are outstanding. They delivered a fully functional custom dashboard and telemetry console on an insanely aggressive timeline. Truly elite engineers.",
    metrics: "12 Days",
    metricLabel: "Time-to-Market Delivery",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    tags: ["Custom Telemetry", "Rapid Cloud Deployment"]
  }
];

export default function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for previous, 1 for next

  // Auto-slide every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(timer);
  }, [index]);

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prevIndex) => (prevIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNext = () => {
    setDirection(1);
    setIndex((prevIndex) => (prevIndex + 1) % TESTIMONIALS.length);
  };

  const currentTestimonial = TESTIMONIALS[index];

  // Framer Motion Variants for sliding transition
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 },
        opacity: { duration: 0.35 },
        scale: { duration: 0.35 }
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 }
      }
    })
  };

  return (
    <div className="w-full bg-[#090e24]/60 border border-white/10 rounded-2xl p-6 lg:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl" id="testimonials-carousel-container">
      {/* Background visual details and ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block">Validated Trust</span>
          <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 mt-1">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            Venture Success Testimonials
          </h3>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed max-w-xl">
            Read direct accounts from industry-leading operators, founders, and venture backers who trust Zealguy Venture to build their core digital assets.
          </p>
        </div>

        {/* Sliders Buttons */}
        <div className="flex items-center gap-2" id="testimonial-navigation-controls">
          <button
            onClick={handlePrev}
            className="p-2.5 bg-[#030614] hover:bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-all cursor-pointer"
            aria-label="Previous Testimonial"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-2.5 bg-[#030614] hover:bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-all cursor-pointer"
            aria-label="Next Testimonial"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Glassmorphic Sliding Stage */}
      <div className="relative min-h-[380px] md:min-h-[280px] lg:min-h-[240px] flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentTestimonial.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#030614]/40 border border-white/5 rounded-xl p-6 md:p-8 relative"
            id={`testimonial-card-${currentTestimonial.id}`}
          >
            {/* Top right floating big quote icon */}
            <Quote className="absolute top-6 right-6 w-16 h-16 text-white/5 pointer-events-none" />

            {/* Left Column: Avatar & Meta */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full blur-sm opacity-60 animate-pulse" />
                <img
                  src={currentTestimonial.avatar}
                  alt={currentTestimonial.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-full object-cover border-2 border-white/20 relative z-10"
                />
                <div className="absolute bottom-0 right-0 bg-emerald-500 border border-[#050816] w-5 h-5 rounded-full flex items-center justify-center z-20 shadow-md">
                  <ShieldCheck className="w-3 h-3 text-white" />
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-white tracking-tight">{currentTestimonial.name}</h4>
                <p className="text-xs text-purple-300 font-mono mt-0.5">{currentTestimonial.role}</p>
                <p className="text-[11px] text-gray-400 font-sans mt-0.5">{currentTestimonial.company}</p>
              </div>

              {/* Tag Badges */}
              <div className="flex flex-wrap gap-1.5 justify-center lg:justify-start">
                {currentTestimonial.tags.map((tag) => (
                  <span key={tag} className="text-[9px] font-mono px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-gray-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Quote & High Impact Metrics */}
            <div className="lg:col-span-8 space-y-6">
              {/* Star Rating row */}
              <div className="flex items-center gap-1 justify-center lg:justify-start">
                {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ))}
                <span className="text-[10px] text-emerald-400 font-mono ml-2 uppercase tracking-widest flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                  Verified Partner
                </span>
              </div>

              {/* Quote text */}
              <p className="text-sm md:text-base text-gray-200 leading-relaxed italic font-sans relative z-10 text-center lg:text-left">
                "{currentTestimonial.quote}"
              </p>

              {/* Metrics block */}
              <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-6 items-center lg:items-start text-center sm:text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-xl font-extrabold text-white block font-mono leading-none tracking-tight">
                      {currentTestimonial.metrics}
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block mt-1">
                      {currentTestimonial.metricLabel}
                    </span>
                  </div>
                </div>

                <div className="hidden sm:block text-gray-700 font-mono text-xs select-none self-center">|</div>

                <div className="text-[11px] font-mono text-gray-400 max-w-sm flex items-center gap-2">
                  <span>✦ Signed under strict system validation auditing.</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom pagination Indicators */}
      <div className="mt-6 flex justify-center items-center gap-1.5" id="testimonial-pagination-indicators">
        {TESTIMONIALS.map((t, idx) => (
          <button
            key={t.id}
            onClick={() => {
              setDirection(idx > index ? 1 : -1);
              setIndex(idx);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              index === idx ? "w-6 bg-gradient-to-r from-blue-500 to-purple-500" : "w-1.5 bg-white/10 hover:bg-white/20"
            }`}
            aria-label={`Go to testimonial ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
