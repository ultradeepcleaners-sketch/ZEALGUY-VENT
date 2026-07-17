import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface PageLoaderProps {
  onComplete: () => void;
}

export default function PageLoader({ onComplete }: PageLoaderProps) {
  const [stage, setStage] = useState<"pixels" | "form-v" | "lock-z" | "tagline" | "complete">("pixels");

  useEffect(() => {
    // 2.4s total animation pipeline
    // 0.0s - 0.6s: Random orange pixels appear and bounce around
    // 0.6s - 1.2s: Pixels move together to create "V"
    // 1.2s - 1.8s: Blue "Z" appears and locks
    // 1.8s - 2.4s: Tagline fades in
    // 2.6s: Loader opens website
    const t1 = setTimeout(() => setStage("form-v"), 600);
    const t2 = setTimeout(() => setStage("lock-z"), 1200);
    const t3 = setTimeout(() => setStage("tagline"), 1800);
    const t4 = setTimeout(() => {
      setStage("complete");
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  // Generate 20 orange pixels with random starting offsets
  const pixelCount = 24;
  const initialPixels = Array.from({ length: pixelCount }).map((_, i) => {
    const angle = (i / pixelCount) * Math.PI * 2;
    const radius = 150 + Math.random() * 100;
    return {
      id: i,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      size: Math.random() * 8 + 6,
    };
  });

  return (
    <div className="fixed inset-0 z-[9999] bg-[#030817] flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* Decorative cybernetic blueprint grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-10 pointer-events-none" />

      {/* Main Animation Arena */}
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Stage 1 & 2: Pixel assembly into a V-shape */}
        {stage === "pixels" && (
          <div className="absolute inset-0 flex items-center justify-center">
            {initialPixels.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: p.x, y: p.y }}
                animate={{ opacity: 1, x: p.x * 0.4, y: p.y * 0.4 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute bg-[#FF7A00] rounded-sm"
                style={{ width: p.size, height: p.size, boxShadow: "0 0 10px #FF7A00" }}
              />
            ))}
          </div>
        )}

        {/* Stage 2, 3, 4: Forming the V and locking the Z */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <svg
            width="120"
            height="120"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_0_15px_rgba(255,122,0,0.3)]"
          >
            {/* The Right/Left arms of V constructed from dynamic grid segments */}
            <AnimatePresence>
              {(stage === "form-v" || stage === "lock-z" || stage === "tagline") && (
                <motion.g id="v-pixel-structure">
                  {/* Left line of V */}
                  <motion.rect
                    initial={{ x: -30, y: -30, opacity: 0, scale: 0 }}
                    animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 120, damping: 15 }}
                    x="20"
                    y="25"
                    width="12"
                    height="12"
                    fill="#FF7A00"
                    rx="2"
                  />
                  <motion.rect
                    initial={{ x: -20, y: -20, opacity: 0 }}
                    animate={{ x: 0, y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    x="28"
                    y="37"
                    width="12"
                    height="12"
                    fill="#FF7A00"
                    rx="2"
                  />
                  <motion.rect
                    initial={{ x: -10, y: -10, opacity: 0 }}
                    animate={{ x: 0, y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    x="36"
                    y="49"
                    width="12"
                    height="12"
                    fill="#FF7A00"
                    rx="2"
                  />
                  
                  {/* Vertex / Center of V */}
                  <motion.rect
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    x="44"
                    y="61"
                    width="12"
                    height="12"
                    fill="#FF9D1F"
                    rx="2"
                  />

                  {/* Right line of V */}
                  <motion.rect
                    initial={{ x: 10, y: -10, opacity: 0 }}
                    animate={{ x: 0, y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    x="52"
                    y="49"
                    width="12"
                    height="12"
                    fill="#FF7A00"
                    rx="2"
                  />
                  <motion.rect
                    initial={{ x: 20, y: -20, opacity: 0 }}
                    animate={{ x: 0, y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    x="60"
                    y="37"
                    width="12"
                    height="12"
                    fill="#FF7A00"
                    rx="2"
                  />
                  <motion.rect
                    initial={{ x: 30, y: -30, opacity: 0, scale: 0 }}
                    animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 120, damping: 15 }}
                    x="68"
                    y="25"
                    width="12"
                    height="12"
                    fill="#FF7A00"
                    rx="2"
                  />
                </motion.g>
              )}
            </AnimatePresence>

            {/* Blue Z locks in and wraps around */}
            <AnimatePresence>
              {(stage === "lock-z" || stage === "tagline") && (
                <motion.g id="z-structure">
                  {/* Top segment of Z */}
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    d="M 25 28 L 75 28 L 25 72 L 75 72"
                    stroke="#0C2D70"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-[0_0_8px_rgba(12,45,112,0.8)]"
                  />
                  {/* Extra central core for premium futuristic look */}
                  <motion.path
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.8 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    d="M 35 32 L 65 32 L 35 68 L 65 68"
                    stroke="#93C5FD"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.g>
              )}
            </AnimatePresence>
          </svg>
        </div>
      </div>

      {/* Titles and Taglines */}
      <div className="absolute bottom-24 flex flex-col items-center text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: stage !== "pixels" ? 1 : 0, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-xl font-bold font-display tracking-[0.25em] text-white uppercase"
        >
          ZEALGUY VENTURE
        </motion.h2>

        <AnimatePresence>
          {(stage === "tagline" || stage === "complete") && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-3 flex flex-col items-center"
            >
              <p className="text-xs font-mono text-[#FF7A00] tracking-wide uppercase">
                Building Digital Solutions. Growing Businesses.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16C784] animate-ping" />
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                  Systems Ready // Project ZEUS
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
