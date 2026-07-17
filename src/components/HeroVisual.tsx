import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Laptop, Tablet, Smartphone, Compass, ShieldCheck, Activity } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroVisual() {
  const [windowWidth, setWindowWidth] = useState(1024);
  const containerRef = useRef<HTMLDivElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);
  const tabletRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  // Motion physics springs for slight delay follow-the-cursor tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Map to small rotational and translation adjustments
  const rotateY = useTransform(smoothX, [-300, 300], [-10, 10]);
  const rotateX = useTransform(smoothY, [-300, 300], [10, -10]);

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate relative delta from window center
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create high-performance quickTo setters for translations
      const laptopY = gsap.quickTo(laptopRef.current, "y", { duration: 0.6, ease: "power2.out" });
      const laptopZ = gsap.quickTo(laptopRef.current, "z", { duration: 0.6, ease: "power2.out" });

      const tabletY = gsap.quickTo(tabletRef.current, "y", { duration: 0.8, ease: "power2.out" });
      const tabletZ = gsap.quickTo(tabletRef.current, "z", { duration: 0.8, ease: "power2.out" });

      const phoneY = gsap.quickTo(phoneRef.current, "y", { duration: 1.0, ease: "power2.out" });
      const phoneZ = gsap.quickTo(phoneRef.current, "z", { duration: 1.0, ease: "power2.out" });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress; // ranges from 0 to 1
          const velocity = self.getVelocity(); // raw pixel scrolling speed per second (pos/neg)

          // 1. Map progress to depth-shifting baseline offsets
          // Background (Laptop): Slower, less travel
          // Middleground (Tablet): Moderate travel
          // Foreground (Phone): Faster, max travel
          const laptopBaseY = (progress - 0.5) * 50; 
          const tabletBaseY = (progress - 0.5) * 90;
          const phoneBaseY = (progress - 0.5) * 150;

          // Map progress to Z-depth to compress/expand the devices in 3D space as you scroll
          const laptopBaseZ = -10 + progress * 20;
          const tabletBaseZ = 20 + progress * 40;
          const phoneBaseZ = 60 + progress * 60;

          // 2. Map scroll velocity for a natural, elastic compression/inertia feel
          // Scale down raw velocity so it acts as an elegant accentuation, capped to prevent clipping
          const maxVelImpact = 60;
          const velocityEffect = Math.min(Math.max(velocity * 0.015, -maxVelImpact), maxVelImpact);

          // Apply velocity-induced depth-shifting. Foreground components react with more lag & inertia
          laptopY(laptopBaseY + velocityEffect * 0.25);
          laptopZ(laptopBaseZ - Math.abs(velocityEffect) * 0.1);

          tabletY(tabletBaseY + velocityEffect * 0.55);
          tabletZ(tabletBaseZ - Math.abs(velocityEffect) * 0.25);

          phoneY(phoneBaseY + velocityEffect * 0.95);
          phoneZ(phoneBaseZ - Math.abs(velocityEffect) * 0.45);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full relative py-8 flex flex-col items-center justify-center min-h-[460px]" id="hero-devices-container">
      {/* Underlying circular holographic compass ring */}
      <div className="absolute w-[360px] md:w-[500px] h-[360px] md:h-[500px] rounded-full border border-[#0C2D70]/20 flex items-center justify-center animate-spin-slow pointer-events-none z-0">
        <div className="w-[300px] md:w-[420px] h-[300px] md:h-[420px] rounded-full border border-dashed border-brand-orange/10 flex items-center justify-center">
          <div className="w-[200px] md:w-[280px] h-[200px] md:h-[280px] rounded-full border border-white/5" />
        </div>
      </div>

      {/* Main 3D Tilted container using motion.div */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full max-w-4xl h-[380px] flex items-center justify-center z-10 select-none"
      >
        {/* Device 1: LAPTOP (Centermost & Back) */}
        <div ref={laptopRef} className="absolute z-10" style={{ transformStyle: "preserve-3d" }}>
          <motion.div
            style={{ transform: "translateZ(0px)" }}
            className="w-[300px] sm:w-[440px] aspect-[16/10] bg-slate-900 border-[8px] sm:border-[12px] border-slate-950 rounded-2xl shadow-2xl overflow-hidden flex flex-col justify-between cursor-image-trigger"
          >
            {/* Top bezel camera */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black rounded-full z-20" />
            {/* Bezel header */}
            <div className="h-5 sm:h-6 bg-slate-950 flex items-center px-3 border-b border-white/5 justify-between font-mono text-[8px] sm:text-[9px]">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                <span className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
              </div>
              <span className="text-gray-500 font-bold tracking-tight">zealguyventure.com</span>
              <div className="w-4" />
            </div>

            {/* Screen Content */}
            <div className="flex-1 bg-gradient-to-br from-[#071E4A] to-[#030817] p-3 sm:p-5 flex flex-col justify-between relative overflow-hidden">
              {/* Overlay scanlines */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
              
              <div className="flex justify-between items-center text-[8px] sm:text-[10px] font-mono text-gray-400">
                <span className="font-extrabold text-white tracking-widest text-[#FF7A00]">ZEALGUY</span>
                <span className="text-emerald-400">● ENG_CONNECTED</span>
              </div>

              <div className="space-y-1 my-2">
                <span className="text-[7px] sm:text-[8px] font-mono text-blue-400 tracking-wider uppercase block">Corporate Portal V1.0</span>
                <h4 className="text-xs sm:text-base font-extrabold text-white tracking-tight leading-tight max-w-xs font-display">
                  Systems Engineering & Platform Architectures.
                </h4>
                <p className="text-[8px] sm:text-[10px] text-gray-400 leading-relaxed max-w-xs font-sans">
                  Deploying cloud structures, HIPAA compliance pipelines, and low latency mobile frontends.
                </p>
              </div>

              <div className="flex justify-between items-center text-[7px] sm:text-[9px] font-mono text-gray-500">
                <span>99/100 LIGHTHOUSE SPEED</span>
                <span className="text-[#FF9D1F]">STABLE ENGINE</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Device 2: TABLET (Leftmost & Slightly forward) */}
        <div ref={tabletRef} className="absolute -left-2 sm:left-12 bottom-4 hidden sm:flex z-10" style={{ transformStyle: "preserve-3d" }}>
          <motion.div
            style={{ transform: "translateZ(40px)" }}
            className="w-[160px] sm:w-[240px] aspect-[4/3] bg-slate-900 border-[6px] sm:border-[8px] border-slate-950 rounded-xl shadow-2xl overflow-hidden flex flex-col justify-between cursor-image-trigger"
          >
            {/* Header */}
            <div className="h-5 bg-slate-950 flex items-center px-2.5 border-b border-white/5 justify-between font-mono text-[8px]">
              <span className="text-[#FF7A00] font-bold">DASHBOARD</span>
              <span className="text-gray-500">sec_terminal</span>
            </div>

            {/* Screen Content */}
            <div className="flex-1 bg-gradient-to-br from-indigo-950/20 to-black p-3 flex flex-col justify-between relative overflow-hidden">
              <div className="flex justify-between items-center">
                <Activity className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[8px] text-emerald-400 font-mono">LIVE +14.2%</span>
              </div>

              <div className="space-y-1">
                <span className="text-[7px] font-mono text-gray-500 block">TOTAL PLATFORM REVENUE</span>
                <span className="text-sm sm:text-base font-black text-white block tracking-tight font-mono">$1,484,200</span>
              </div>

              {/* Micro bar chart representation */}
              <div className="flex items-end gap-1.5 h-8">
                <div className="w-full bg-blue-500/30 rounded-sm h-[30%]" />
                <div className="w-full bg-blue-500/50 rounded-sm h-[45%]" />
                <div className="w-full bg-indigo-500 rounded-sm h-[80%]" />
                <div className="w-full bg-[#FF7A00] rounded-sm h-[95%]" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Device 3: SMARTPHONE (Rightmost & Foremost) */}
        <div ref={phoneRef} className="absolute -right-2 sm:right-16 -bottom-6 z-20" style={{ transformStyle: "preserve-3d" }}>
          <motion.div
            style={{ transform: "translateZ(80px)" }}
            className="w-[100px] sm:w-[130px] aspect-[9/19] bg-slate-950 border-[4px] sm:border-[6px] border-slate-900 rounded-[18px] sm:rounded-[22px] shadow-2xl overflow-hidden flex flex-col justify-between cursor-image-trigger"
          >
            {/* Bezel notch */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-2.5 bg-slate-900 rounded-full z-20" />

            {/* Screen Content */}
            <div className="flex-1 bg-gradient-to-br from-[#030817] to-[#071E4A] p-2.5 sm:p-3.5 pt-4 sm:pt-5 flex flex-col justify-between font-mono">
              <div className="flex justify-between items-center text-[7px] text-gray-400">
                <span>9:41 AM</span>
                <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
              </div>

              <div className="space-y-1 text-center my-2">
                <div className="w-5 h-5 rounded-full bg-[#FF7A00]/10 border border-brand-orange/20 flex items-center justify-center mx-auto mb-1">
                  <Compass className="w-3 h-3 text-[#FF7A00]" />
                </div>
                <h5 className="text-[8px] font-black text-white tracking-tight leading-tight">Solis Wear</h5>
                <p className="text-[6px] text-gray-500 leading-tight">Active Sensor Stream</p>
              </div>

              {/* Swipe prompt */}
              <div className="h-5 sm:h-6 bg-brand-orange hover:bg-bright-orange text-white text-[7px] sm:text-[8px] rounded-md flex items-center justify-center font-bold tracking-wider cursor-pointer">
                ACTIVATE APP
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating features badge summary beneath */}
      <div className="flex items-center gap-6 mt-8 text-[11px] font-mono text-gray-500 bg-white/[0.02] border border-white/5 py-2 px-5 rounded-full z-10 shadow-sm">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          ✔ Responsive Websites
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
          ✔ Live Admin Dashboards
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
          ✔ Secure Mobile Native Apps
        </span>
      </div>
    </div>
  );
}
