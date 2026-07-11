"use client";

import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";

interface AgentNodeProps {
  name: string;
  label: string;
  iconName: string;
  status: "idle" | "active" | "complete";
  color: string;
}

export default function AgentNode({
  name,
  label,
  iconName,
  status,
  color
}: AgentNodeProps) {
  // Dynamically resolve lucide icon or fallback to default
  const IconComponent = (Icons as any)[iconName] || Icons.Cpu;

  const isActive = status === "active";
  const isComplete = status === "complete";

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative">
        {/* Pulsing glow under active nodes */}
        {isActive && (
          <motion.div
            layoutId={`glow-${name}`}
            animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full blur-md"
            style={{ backgroundColor: color }}
          />
        )}

        {/* Outer active border glow ring */}
        <motion.div
          animate={isActive ? { scale: 1.05 } : { scale: 1 }}
          className={`w-14 h-14 rounded-full flex items-center justify-center border relative z-10 transition-all duration-300 ${
            isActive 
              ? "bg-[#0c0c14]" 
              : isComplete
              ? "bg-[#0a0a0f] border-emerald-500/30"
              : "bg-[#07070a] border-white/5 opacity-55"
          }`}
          style={isActive ? { borderColor: color, boxShadow: `0 0 15px ${color}30` } : {}}
        >
          {isComplete ? (
            <Icons.CheckCircle2 className="w-6 h-6 text-emerald-500" />
          ) : (
            <IconComponent 
              className="w-5 h-5 transition-all duration-300"
              style={{ color: isActive ? color : "rgba(255, 255, 255, 0.4)" }}
            />
          )}
        </motion.div>
      </div>

      <span className={`text-[10px] font-mono tracking-tight mt-2 transition-all duration-300 ${
        isActive ? "text-white font-bold" : isComplete ? "text-emerald-400" : "text-aira-text-muted"
      }`}>
        {label}
      </span>
    </div>
  );
}
