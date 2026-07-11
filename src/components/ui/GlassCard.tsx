"use client";

import React from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: "emerald" | "amber" | "red" | "cyan" | "purple" | "none";
  hoverable?: boolean;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = "",
  glow = "none",
  hoverable = true,
  onClick
}: GlassCardProps) {
  const glowClass = {
    none: "",
    emerald: "glow-emerald border-aira-emerald/30",
    amber: "glow-amber border-aira-amber/30",
    red: "glow-red border-aira-red/30",
    cyan: "glow-cyan border-aira-cyan/30",
    purple: "glow-purple border-aira-purple/30"
  }[glow];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={hoverable ? { y: -2, scale: 1.005 } : undefined}
      onClick={onClick}
      className={`glass-card p-5 relative overflow-hidden ${glowClass} ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {/* Scanline overlay for cyber industrial feel */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[10px] w-full pointer-events-none opacity-20" 
           style={{ animation: "scan-line 6s linear infinite" }} />
      {children}
    </motion.div>
  );
}
