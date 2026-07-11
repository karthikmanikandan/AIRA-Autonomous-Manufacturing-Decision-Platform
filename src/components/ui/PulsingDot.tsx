"use client";

import React from "react";
import { motion } from "framer-motion";

interface PulsingDotProps {
  status?: "healthy" | "warning" | "critical";
  size?: "sm" | "md" | "lg";
}

export default function PulsingDot({
  status = "healthy",
  size = "md"
}: PulsingDotProps) {
  const sizeClasses = {
    sm: "w-1.5 h-1.5",
    md: "w-2.5 h-2.5",
    lg: "w-3.5 h-3.5"
  }[size];

  const colorClasses = {
    healthy: "bg-emerald-500 shadow-emerald-500/50",
    warning: "bg-amber-500 shadow-amber-500/50",
    critical: "bg-red-500 shadow-red-500/50"
  }[status];

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className={`absolute rounded-full opacity-45 ${sizeClasses} ${colorClasses}`}
      />
      <div className={`rounded-full shadow-lg relative z-10 ${sizeClasses} ${colorClasses}`} />
    </div>
  );
}
