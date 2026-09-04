"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export const SecureBackground3D = () => {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 30, stiffness: 40, mass: 1.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Map mouse positions (0 to 1) to rotation angles (-4deg to +4deg)
  const rotateX = useTransform(smoothY, [0, 1], [4, -4]);
  const rotateY = useTransform(smoothX, [0, 1], [-4, 4]);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      // Disable parallax on reduced motion or mobile
      if (window.innerWidth < 768) return;
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) return;

      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Deterministically generate particles and hex values inside useMemo
  const particles = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: ((i * 137.5) % 100) - 50,
      y: ((i * 93.1) % 100) - 50,
      z: ((i * 47.3) % 400) - 200,
      size: (i % 3) + 1,
      opacity: 0.1 + ((i % 5) * 0.1),
    }));
  }, []);

  const hexFragments = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const hex = Math.floor((i * 1234567) % 0xffffffff).toString(16).toUpperCase().padStart(8, '0');
      return {
        id: i,
        hex,
        x: ((i * 73.1) % 80) - 40,
        y: ((i * 111.7) % 80) - 40,
        z: ((i * 31.9) % 300) - 100,
        delay: (i % 5) * 2,
        duration: 15 + (i % 10),
      };
    });
  }, []);

  if (!mounted) return <div className="fixed inset-0 bg-[#0B1214] z-0" />;

  return (
    <div className="fixed inset-0 bg-[#0B1214] z-0 overflow-hidden pointer-events-none" style={{ perspective: "1200px" }}>
      
      {/* Deepest Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] rounded-full bg-[#3C9D91] opacity-[0.03] blur-[150px]" />
      </div>

      {/* 3D Scene Container */}
      <motion.div 
        style={{ 
          rotateX, 
          rotateY, 
          transformStyle: "preserve-3d" 
        }} 
        className="absolute inset-0 flex items-center justify-center w-full h-full"
      >
        {/* Particles Field */}
        {particles.map(p => (
          <div
            key={`p-${p.id}`}
            className="absolute rounded-full bg-[#6BAE91]"
            style={{
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              transform: `translate3d(${p.x}vw, ${p.y}vh, ${p.z}px)`,
            }}
          />
        ))}

        {/* Floating Hex Data Fragments */}
        {hexFragments.map(h => (
          <motion.div
            key={`h-${h.id}`}
            initial={{ opacity: 0, y: h.y + "vh" }}
            animate={{ opacity: [0, 0.4, 0], y: [(h.y + 10) + "vh", (h.y - 10) + "vh"] }}
            transition={{ duration: h.duration, repeat: Infinity, delay: h.delay, ease: "linear" }}
            className="absolute text-[10px] sm:text-[12px] font-mono text-[#3C9D91] tracking-[0.2em] font-medium"
            style={{
              transform: `translate3d(${h.x}vw, 0, ${h.z}px)`,
            }}
          >
            {h.hex}
          </motion.div>
        ))}

        {/* RING 1: Solid Outer Ring (Deep) */}
        <motion.div
          animate={{ rotateZ: 360 }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
          className="absolute w-[130vw] h-[130vw] sm:w-[90vw] sm:h-[90vw] max-w-[1400px] max-h-[1400px] rounded-full border border-[#304347]/40 flex items-center justify-center"
          style={{ transform: "translateZ(-150px)", transformStyle: "preserve-3d" }}
        >
           {/* Verification node traveling on ring */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#6BAE91] shadow-[0_0_10px_#6BAE91]" />
        </motion.div>

        {/* RING 2: Dashed Middle Ring */}
        <motion.div
          animate={{ rotateZ: -360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute w-[100vw] h-[100vw] sm:w-[70vw] sm:h-[70vw] max-w-[1000px] max-h-[1000px] rounded-full border-[1.5px] border-dashed border-[#3C9D91]/20 flex items-center justify-center"
          style={{ transform: "translateZ(-50px)", transformStyle: "preserve-3d" }}
        >
          {/* Inner metallic glass-like surface */}
          <div className="absolute inset-[15%] rounded-full border border-[#304347]/30 bg-gradient-to-tr from-[#1A292C]/5 to-transparent backdrop-blur-[2px]" />
        </motion.div>

        {/* RING 3: Segmented Verification Ring (Front) */}
        <motion.div
          animate={{ rotateZ: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          className="absolute w-[70vw] h-[70vw] sm:w-[50vw] sm:h-[50vw] max-w-[700px] max-h-[700px] rounded-full flex items-center justify-center relative overflow-hidden"
          style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }}
        >
           <svg className="absolute w-full h-full" viewBox="0 0 100 100" overflow="visible">
             <circle cx="50" cy="50" r="49" fill="none" stroke="#4EB3A6" strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="4 8" />
             <circle cx="50" cy="50" r="40" fill="none" stroke="#304347" strokeWidth="1" strokeOpacity="0.5" />
           </svg>
           
           {/* Radar Sweep Effect */}
           <motion.div 
             animate={{ rotateZ: 360 }}
             transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
             className="absolute inset-0 rounded-full"
             style={{ background: 'conic-gradient(from 0deg, transparent 75%, rgba(60, 157, 145, 0.15) 100%)' }}
           />
           
           {/* Highlighting edge of radar sweep */}
           <motion.div 
             animate={{ rotateZ: 360 }}
             transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
             className="absolute inset-0 rounded-full border-t border-[#3C9D91]/60"
           />
        </motion.div>

        {/* Center Volumetric Core Glow */}
        <div className="absolute w-[15vw] h-[15vw] max-w-[200px] max-h-[200px] rounded-full bg-gradient-to-b from-[#3C9D91]/10 to-transparent blur-[30px]" style={{ transform: "translateZ(100px)" }} />
        
      </motion.div>
    </div>
  );
};
