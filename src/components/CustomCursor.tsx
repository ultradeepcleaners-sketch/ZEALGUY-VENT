import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function CustomCursor() {
  const [hoverType, setHoverType] = useState<"none" | "interactive" | "image">("none");
  const [isVisible, setIsVisible] = useState(false);

  // Position variables
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Physics spring configurations for smooth trailing lag effect
  const springConfig = { damping: 28, stiffness: 220, mass: 0.6 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Hide native cursor only when this custom cursor is active
    document.documentElement.classList.add("md:cursor-none");

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (!isVisible) setIsVisible(true);

      // Inspect target elements below the cursor pointer
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check for interactive tags
      const isInteractive = 
        target.tagName === "A" || 
        target.tagName === "BUTTON" || 
        target.closest("button") || 
        target.closest("a") || 
        target.getAttribute("role") === "button" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT";

      // Check for image tags
      const isImage = 
        target.tagName === "IMG" || 
        target.tagName === "canvas" ||
        target.closest(".cursor-image-trigger");

      if (isInteractive) {
        setHoverType("interactive");
      } else if (isImage) {
        setHoverType("image");
      } else {
        setHoverType("none");
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.documentElement.classList.remove("md:cursor-none");
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  // Render responsive customized premium cursor nodes (Hidden on mobile)
  return (
    <div className="fixed inset-0 pointer-events-none z-[10000] hidden md:block">
      {/* Outer Ring: Primary/Secondary Navy (Expands on Hover) */}
      <motion.div
        className="absolute rounded-full border-2 border-[#0C2D70] -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          width: hoverType === "interactive" ? 48 : hoverType === "image" ? 64 : 28,
          height: hoverType === "interactive" ? 48 : hoverType === "image" ? 64 : 28,
          backgroundColor: hoverType === "image" ? "rgba(255, 122, 0, 0.1)" : "rgba(12, 45, 112, 0)",
          borderColor: hoverType === "interactive" ? "#FF7A00" : hoverType === "image" ? "#FF9D1F" : "#0C2D70",
          borderRadius: hoverType === "image" ? "12px" : "9999px",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />

      {/* Inner Dot: Orange Center */}
      <motion.div
        className="absolute bg-[#FF7A00] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none shadow-[0_0_8px_#FF7A00]"
        style={{
          x: cursorX,
          y: cursorY,
          width: 6,
          height: 6,
        }}
        animate={{
          scale: hoverType === "interactive" ? 2.5 : hoverType === "image" ? 0 : 1,
          backgroundColor: hoverType === "interactive" ? "#FF9D1F" : "#FF7A00"
        }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
}
